<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'customer_phone' => $this->customer_phone,
            'order_type' => $this->order_type,
            'table_number' => $this->table_number,
            'delivery_address' => $this->delivery_address,
            'delivery_city' => $this->delivery_city,
            'delivery_postal_code' => $this->delivery_postal_code,
            'delivery_note' => $this->delivery_note,
            'subtotal' => (int) $this->subtotal,
            'discount' => (int) $this->discount,
            'service_charge' => (int) $this->service_charge,
            'delivery_fee' => (int) $this->delivery_fee,
            'total' => (int) $this->total,
            'total_formatted' => 'Rp '.number_format($this->total, 0, ',', '.'),
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'created_at' => $this->created_at?->toIso8601String(),
            'branch' => new BranchResource($this->whenLoaded('branch')),
            'customer' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ]),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'payment' => new PaymentResource($this->whenLoaded('payment')),
            'promo' => $this->whenLoaded('promo', fn () => [
                'code' => $this->promo->code,
                'title' => $this->promo->title,
            ]),
        ];
    }
}
