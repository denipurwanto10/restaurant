<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'menu_id' => $this->menu_id,
            'menu_name' => $this->menu_name,
            'menu_price' => (int) $this->menu_price,
            'quantity' => (int) $this->quantity,
            'addons' => $this->addons ?? [],
            'addons_total' => (int) $this->addons_total,
            'subtotal' => (int) $this->subtotal,
            'note' => $this->note,
        ];
    }
}
