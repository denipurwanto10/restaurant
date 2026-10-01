<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Resources\OrderResource;
use App\Http\Resources\PaymentResource;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;

class OrderManagementController extends Controller
{
    public function orders(Request $request)
    {
        $query = Order::with(['branch', 'items', 'payment', 'user'])->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(fn ($q) => $q->where('order_number', 'like', "%{$search}%")
                ->orWhere('customer_name', 'like', "%{$search}%")
                ->orWhere('customer_email', 'like', "%{$search}%"));
        }

        return OrderResource::collection($query->paginate($request->integer('per_page', 15)));
    }

    public function showOrder(Order $order)
    {
        return new OrderResource($order->load(['branch', 'items', 'payment.method', 'promo', 'user']));
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order)
    {
        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Order status updated.',
            'order' => new OrderResource($order->fresh(['branch', 'items', 'payment'])),
        ]);
    }

    public function payments(Request $request)
    {
        $query = Payment::with(['order.user', 'order.branch', 'method'])->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('invoice_number', 'like', "%{$search}%");
        }

        return PaymentResource::collection($query->paginate($request->integer('per_page', 15)));
    }
}
