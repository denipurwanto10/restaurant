<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PromoResource;
use App\Http\Resources\ReviewResource;
use App\Models\Promo;
use App\Models\Review;

class ContentController extends Controller
{
    public function promos()
    {
        $promos = Promo::where('is_active', true)
            ->where(fn ($q) => $q->whereNull('starts_at')->orWhere('starts_at', '<=', now()))
            ->where(fn ($q) => $q->whereNull('ends_at')->orWhere('ends_at', '>=', now()))
            ->orderByDesc('created_at')
            ->get();

        return PromoResource::collection($promos);
    }

    public function reviews()
    {
        $reviews = Review::with('branch')
            ->where('is_approved', true)
            ->where('is_featured', true)
            ->orderByDesc('created_at')
            ->take(6)
            ->get();

        return ReviewResource::collection($reviews);
    }
}
