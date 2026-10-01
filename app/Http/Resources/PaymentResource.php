<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'payment_method_code' => $this->payment_method_code,
            'payment_method_name' => $this->method?->name,
            'bank_code' => $this->bank_code,
            'account_number' => $this->method?->account_number,
            'account_name' => $this->method?->account_name,
            'amount' => (int) $this->amount,
            'amount_formatted' => 'Rp '.number_format($this->amount, 0, ',', '.'),
            'status' => $this->status,
            'expires_at' => $this->expires_at?->toIso8601String(),
            'paid_at' => $this->paid_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'is_demo' => true,
            'order' => $this->whenLoaded('order', fn () => [
                'id' => $this->order->id,
                'order_number' => $this->order->order_number,
                'customer_name' => $this->order->customer_name,
                'total' => (int) $this->order->total,
            ]),
        ];
    }
}
