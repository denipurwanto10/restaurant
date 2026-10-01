<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBranchRequest;
use App\Http\Requests\StorePromoRequest;
use App\Http\Resources\BranchResource;
use App\Http\Resources\PromoResource;
use App\Models\Branch;
use App\Models\Promo;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ResourceManagementController extends Controller
{
    // ---- Branches ----
    public function branches()
    {
        return BranchResource::collection(Branch::withCount('menus')->orderBy('name')->get());
    }

    public function storeBranch(StoreBranchRequest $request)
    {
        $data = $request->validated();
        $data['slug'] = $this->uniqueBranchSlug($request->name);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('branches', 'public');
        }

        $branch = Branch::create($data);

        return response()->json([
            'message' => 'Branch created successfully.',
            'branch' => new BranchResource($branch),
        ], 201);
    }

    public function updateBranch(StoreBranchRequest $request, Branch $branch)
    {
        $data = $request->validated();

        if ($request->name !== $branch->name) {
            $data['slug'] = $this->uniqueBranchSlug($request->name, $branch->id);
        }

        if ($request->hasFile('image')) {
            if ($branch->image) {
                Storage::disk('public')->delete($branch->image);
            }
            $data['image'] = $request->file('image')->store('branches', 'public');
        }

        $branch->update($data);

        return response()->json([
            'message' => 'Branch updated successfully.',
            'branch' => new BranchResource($branch->fresh()),
        ]);
    }

    public function destroyBranch(Branch $branch)
    {
        $branch->update(['is_active' => false]);

        return response()->json(['message' => 'Branch deactivated.']);
    }

    // ---- Promos ----
    public function promos()
    {
        return PromoResource::collection(Promo::orderByDesc('created_at')->get());
    }

    public function storePromo(StorePromoRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('promos', 'public');
        }

        $promo = Promo::create($data);

        return response()->json([
            'message' => 'Promo created successfully.',
            'promo' => new PromoResource($promo),
        ], 201);
    }

    public function updatePromo(StorePromoRequest $request, Promo $promo)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($promo->image) {
                Storage::disk('public')->delete($promo->image);
            }
            $data['image'] = $request->file('image')->store('promos', 'public');
        }

        $promo->update($data);

        return response()->json([
            'message' => 'Promo updated successfully.',
            'promo' => new PromoResource($promo->fresh()),
        ]);
    }

    public function destroyPromo(Promo $promo)
    {
        $promo->delete();

        return response()->json(['message' => 'Promo deleted.']);
    }

    // ---- Customers ----
    public function customers(Request $request)
    {
        $query = User::where('role', 'customer')->withCount('orders')->orderByDesc('created_at');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(fn ($q) => $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%"));
        }

        return $query->paginate($request->integer('per_page', 15));
    }

    // ---- Reviews ----
    public function reviews()
    {
        return Review::with(['branch', 'user'])->orderByDesc('created_at')->paginate(15);
    }

    public function toggleReview(Review $review)
    {
        $review->update(['is_approved' => ! $review->is_approved]);

        return response()->json(['message' => 'Review visibility updated.']);
    }

    private function uniqueBranchSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'branch';
        $slug = $base;
        $i = 2;
        while (Branch::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
