<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\MenuResource;
use App\Models\Category;
use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $query = Menu::query()
            ->with(['category', 'addons'])
            ->where('is_available', true);

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category));
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%"));
        }
        if ($request->boolean('vegetarian')) {
            $query->where('is_vegetarian', true);
        }
        if ($request->boolean('spicy')) {
            $query->where('is_spicy', true);
        }
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }
        if ($request->boolean('popular')) {
            $query->where('is_popular', true);
        }

        match ($request->get('sort', 'popular')) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'newest' => $query->orderByDesc('created_at'),
            default => $query->orderByDesc('sold_count'),
        };

        $menus = $query->paginate($request->integer('per_page', 12));

        return MenuResource::collection($menus);
    }

    public function show(Menu $menu)
    {
        abort_unless($menu->is_available, 404, 'Menu not found.');
        $menu->load(['category', 'addons']);

        return new MenuResource($menu);
    }

    public function featured()
    {
        $menus = Menu::with(['category', 'addons'])
            ->where('is_available', true)
            ->where(fn ($q) => $q->where('is_featured', true)->orWhere('is_popular', true))
            ->orderByDesc('sold_count')
            ->take(8)
            ->get();

        return MenuResource::collection($menus);
    }

    public function categories()
    {
        $categories = Category::where('is_active', true)
            ->withCount(['menus' => fn ($q) => $q->where('is_available', true)])
            ->orderBy('sort_order')
            ->get();

        return CategoryResource::collection($categories);
    }
}
