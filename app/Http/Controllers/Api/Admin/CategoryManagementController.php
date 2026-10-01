<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryManagementController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('menus')->orderBy('sort_order')->get();

        return CategoryResource::collection($categories);
    }

    public function store(StoreCategoryRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = $this->uniqueSlug($request->name);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        $category = Category::create($data);

        return response()->json([
            'message' => 'Category created successfully.',
            'category' => new CategoryResource($category),
        ], 201);
    }

    public function update(StoreCategoryRequest $request, Category $category)
    {
        $data = $request->validated();

        if ($request->name !== $category->name) {
            $data['slug'] = $this->uniqueSlug($request->name, $category->id);
        }

        if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($data);

        return response()->json([
            'message' => 'Category updated successfully.',
            'category' => new CategoryResource($category->fresh()),
        ]);
    }

    public function destroy(Category $category)
    {
        if ($category->menus()->exists()) {
            return response()->json([
                'message' => 'Cannot delete category that still has menus.',
            ], 422);
        }

        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully.']);
    }

    public function reorder(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:categories,id'],
        ]);

        foreach ($request->ids as $index => $id) {
            Category::where('id', $id)->update(['sort_order' => $index + 1]);
        }

        return response()->json(['message' => 'Category order updated.']);
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'category';
        $slug = $base;
        $i = 2;
        while (Category::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
