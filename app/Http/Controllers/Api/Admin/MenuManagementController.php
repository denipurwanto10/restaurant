<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMenuRequest;
use App\Http\Resources\MenuResource;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MenuManagementController extends Controller
{
    public function index(Request $request)
    {
        $query = Menu::with('category')->orderByDesc('created_at');

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return MenuResource::collection($query->paginate($request->integer('per_page', 15)));
    }

    public function store(StoreMenuRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = $request->slug ?: Str::slug($request->name).'-'.Str::lower(Str::random(5));

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('menu', 'public');
        }
        unset($data['branch_ids']);

        $menu = Menu::create($data);

        if ($request->filled('branch_ids')) {
            $menu->branches()->sync($request->branch_ids);
        }

        return response()->json([
            'message' => 'Menu created successfully.',
            'menu' => new MenuResource($menu->load(['category', 'addons'])),
        ], 201);
    }

    public function show(Menu $menu)
    {
        return new MenuResource($menu->load(['category', 'addons', 'branches']));
    }

    public function update(StoreMenuRequest $request, Menu $menu)
    {
        $data = $request->validated();

        if ($request->filled('slug')) {
            $data['slug'] = $request->slug;
        } elseif ($request->name !== $menu->name) {
            $data['slug'] = $this->uniqueMenuSlug($request->name, $menu->id);
        } else {
            unset($data['slug']);
        }

        if ($request->hasFile('image')) {
            if ($menu->image && ! str_starts_with($menu->image, 'http')) {
                Storage::disk('public')->delete($menu->image);
            }
            $data['image'] = $request->file('image')->store('menu', 'public');
        }
        unset($data['branch_ids']);

        $menu->update($data);

        if ($request->has('branch_ids')) {
            $menu->branches()->sync($request->branch_ids ?? []);
        }

        return response()->json([
            'message' => 'Menu updated successfully.',
            'menu' => new MenuResource($menu->fresh(['category', 'addons'])),
        ]);
    }

    public function destroy(Menu $menu)
    {
        if ($menu->image && ! str_starts_with($menu->image, 'http')) {
            Storage::disk('public')->delete($menu->image);
        }
        $menu->delete();

        return response()->json(['message' => 'Menu deleted successfully.']);
    }

    private function uniqueMenuSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'menu';
        $slug = $base;
        $i = 2;
        while (Menu::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
