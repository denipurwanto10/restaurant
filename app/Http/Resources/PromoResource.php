<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'title' => $this->title,
            'description' => $this->description,
            'image' => $this->image ? asset('storage/'.$this->image) : null,
            'discount_type' => $this->discount_type,
            'discount_value' => (int) $this->discount_value,
            'min_order' => (int) $this->min_order,
            'max_discount' => $this->max_discount !== null ? (int) $this->max_discount : null,
        ];
    }
}
