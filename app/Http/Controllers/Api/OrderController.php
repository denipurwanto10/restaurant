<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Menu;
use App\Models\MenuAddon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Promo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with(['branch', 'items', 'payment'])
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 10));

        return OrderResource::collection($orders);
    }

    public function show(Request $request, Order $order)
    {
        abort_unless($order->user_id === $request->user()->id, 403, 'Not your order.');
        $order->load(['branch', 'items', 'payment.method', 'promo', 'user']);

        return new OrderResource($order);
    }

    public function showByNumber(Request $request, string $orderNumber)
    {
        $order = Order::with(['branch', 'items', 'payment.method', 'promo'])
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        if ($request->user() && $order->user_id !== $request->user()->id && ! $request->user()->isAdmin()) {
            abort(403, 'Not your order.');
        }

        return new OrderResource($order);
    }

    public function showByInvoice(string $invoice)
    {
        $payment = \App\Models\Payment::with(['method', 'order'])
            ->where('invoice_number', $invoice)
            ->firstOrFail();

        return response()->json([
            'order_number' => $payment->order->order_number,
            'payment' => new \App\Http\Resources\PaymentResource($payment),
        ]);
    }

    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();

        $order = DB::transaction(function () use ($validated, $request) {
            $menuIds = collect($validated['items'])->pluck('menu_id')->all();
            $menus = Menu::whereIn('id', $menuIds)->where('is_available', true)->get()->keyBy('id');

            $addonIds = collect($validated['items'])->pluck('addon_ids')->flatten()->filter()->unique()->all();
            $addons = $addonIds ? MenuAddon::whereIn('id', $addonIds)->where('is_active', true)->get()->keyBy('id') : collect();

            $subtotal = 0;
            $lines = [];
            foreach ($validated['items'] as $item) {
                $menu = $menus->get($item['menu_id']);
                abort_unless($menu, 422, 'One of the selected menus is unavailable.');

                $addonTotal = 0;
                $addonNames = [];
                foreach ($item['addon_ids'] ?? [] as $addonId) {
                    $addon = $addons->get($addonId);
                    if ($addon && $addon->menu_id === $menu->id) {
                        $addonTotal += $addon->price;
                        $addonNames[] = ['name' => $addon->name, 'price' => (int) $addon->price];
                    }
                }

                $lineSubtotal = ($menu->price + $addonTotal) * $item['quantity'];
                $subtotal += $lineSubtotal;
                $lines[] = [
                    'menu' => $menu,
                    'quantity' => $item['quantity'],
                    'addon_names' => $addonNames,
                    'addon_total' => $addonTotal,
                    'line_subtotal' => $lineSubtotal,
                    'note' => $item['note'] ?? null,
                ];
            }

            // Promo discount
            $discount = 0;
            $promo = null;
            if (! empty($validated['promo_code'])) {
                $promo = Promo::where('code', $validated['promo_code'])->where('is_active', true)->first();
                if ($promo && $subtotal >= $promo->min_order) {
                    $discount = $promo->discount_type === 'percent'
                        ? (int) round($subtotal * $promo->discount_value / 100)
                        : (int) $promo->discount_value;
                    if ($promo->max_discount) {
                        $discount = min($discount, $promo->max_discount);
                    }
                }
            }

            $serviceCharge = (int) round($subtotal * 0.05);
            $deliveryFee = $validated['order_type'] === 'delivery' ? 15000 : 0;
            $total = max(0, $subtotal - $discount + $serviceCharge + $deliveryFee);

            $method = PaymentMethod::where('code', $validated['payment_method'])->where('is_active', true)->firstOrFail();

            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => $request->user()?->id,
                'branch_id' => $validated['branch_id'],
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'order_type' => $validated['order_type'],
                'table_number' => $validated['table_number'] ?? null,
                'delivery_address' => $validated['delivery_address'] ?? null,
                'delivery_city' => $validated['delivery_city'] ?? null,
                'delivery_postal_code' => $validated['delivery_postal_code'] ?? null,
                'delivery_note' => $validated['delivery_note'] ?? null,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'service_charge' => $serviceCharge,
                'delivery_fee' => $deliveryFee,
                'total' => $total,
                'promo_id' => $promo?->id,
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);

            foreach ($lines as $line) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_id' => $line['menu']->id,
                    'menu_name' => $line['menu']->name,
                    'menu_price' => $line['menu']->price,
                    'quantity' => $line['quantity'],
                    'addons' => $line['addon_names'],
                    'addons_total' => $line['addon_total'],
                    'subtotal' => $line['line_subtotal'],
                    'note' => $line['note'],
                ]);
                $line['menu']->increment('sold_count', $line['quantity']);
            }

            Payment::create([
                'invoice_number' => Payment::generateInvoiceNumber(),
                'order_id' => $order->id,
                'payment_method_id' => $method->id,
                'payment_method_code' => $method->code,
                'bank_code' => $validated['bank_code'] ?? null,
                'amount' => $total,
                'status' => 'pending',
                'expires_at' => now()->addDay(),
                'payload' => json_encode(['demo' => true, 'note' => 'Demo payment — no real money will be charged.']),
            ]);

            return $order;
        });

        $order->load(['branch', 'items', 'payment.method']);

        return response()->json([
            'message' => 'Order created. Please complete your demo payment.',
            'order' => new OrderResource($order),
        ], 201);
    }
}
