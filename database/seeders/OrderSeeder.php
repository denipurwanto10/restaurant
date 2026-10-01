<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::where('email', 'customer@restaurant.test')->first();
        $branchId = \App\Models\Branch::where('slug', 'downtown')->value('id');
        $qris = PaymentMethod::where('code', 'qris')->first();
        $bca = PaymentMethod::where('code', 'bank_bca')->first();
        $menus = Menu::take(8)->get();

        if (! $customer || ! $menus->count()) {
            return;
        }

        $statuses = ['completed', 'completed', 'preparing', 'pending', 'ready'];
        foreach ($statuses as $i => $status) {
            $items = $menus->random(min(3, $menus->count()));
            $subtotal = 0;
            $order = Order::create([
                'order_number' => Order::generateOrderNumber().$i,
                'user_id' => $customer->id,
                'branch_id' => $branchId,
                'customer_name' => $customer->name,
                'customer_email' => $customer->email,
                'customer_phone' => $customer->phone ?? '081298765432',
                'order_type' => ['dine_in', 'take_away', 'delivery'][$i % 3],
                'table_number' => $i % 3 === 0 ? 'A-'.($i + 1) : null,
                'subtotal' => 0,
                'service_charge' => 0,
                'total' => 0,
                'status' => $status,
                'payment_status' => in_array($status, ['pending']) ? 'pending' : 'paid',
            ]);

            foreach ($items as $menu) {
                $qty = rand(1, 2);
                $line = $menu->price * $qty;
                $subtotal += $line;
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_id' => $menu->id,
                    'menu_name' => $menu->name,
                    'menu_price' => $menu->price,
                    'quantity' => $qty,
                    'subtotal' => $line,
                ]);
            }

            $service = (int) round($subtotal * 0.05);
            $order->update([
                'subtotal' => $subtotal,
                'service_charge' => $service,
                'total' => $subtotal + $service,
            ]);

            $method = $i % 2 === 0 ? $qris : $bca;
            Payment::create([
                'invoice_number' => Payment::generateInvoiceNumber().$i,
                'order_id' => $order->id,
                'payment_method_id' => $method?->id,
                'payment_method_code' => $method?->code ?? 'qris',
                'amount' => $order->total,
                'status' => $order->payment_status,
                'expires_at' => now()->addDay(),
                'paid_at' => $order->payment_status === 'paid' ? now()->subHours($i + 1) : null,
            ]);
        }
    }
}
