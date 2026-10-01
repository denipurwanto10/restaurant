<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name,
            'rating' => (int) $this->rating,
            'comment' => $this->comment,
            'branch' => $this->whenLoaded('branch', fn () => [
                'name' => $this->branch?->name,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
