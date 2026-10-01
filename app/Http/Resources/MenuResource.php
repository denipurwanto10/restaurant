<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'ingredients' => $this->ingredients,
            'price' => (int) $this->price,
            'price_formatted' => 'Rp '.number_format($this->price, 0, ',', '.'),
            'image' => $this->image_url,
            'is_available' => (bool) $this->is_available,
            'is_featured' => (bool) $this->is_featured,
            'is_popular' => (bool) $this->is_popular,
            'is_new' => (bool) $this->is_new,
            'is_vegetarian' => (bool) $this->is_vegetarian,
            'is_spicy' => (bool) $this->is_spicy,
            'stock' => (int) $this->stock,
            'sold_count' => (int) $this->sold_count,
            'badges' => $this->badges(),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'addons' => MenuAddonResource::collection($this->whenLoaded('addons')),
            'branches' => BranchResource::collection($this->whenLoaded('branches')),
            'branch_ids' => $this->whenLoaded('branches', fn () => $this->branches->pluck('id')->all()),
        ];
    }
}
