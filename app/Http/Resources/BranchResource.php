<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BranchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'address' => $this->address,
            'city' => $this->city,
            'phone' => $this->phone,
            'latitude' => (float) $this->latitude,
            'longitude' => (float) $this->longitude,
            'opening_hours' => $this->opening_hours,
            'description' => $this->description,
            'facilities' => $this->facilities,
            'image' => $this->image_url,
            'menus_count' => $this->whenCounted('menus'),
            'menus' => MenuResource::collection($this->whenLoaded('menus')),
        ];
    }
}
