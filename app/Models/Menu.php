<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'name', 'slug', 'description', 'ingredients', 'price',
        'image', 'is_available', 'is_featured', 'is_popular', 'is_new',
        'is_vegetarian', 'is_spicy', 'stock', 'sold_count',
    ];

    protected function casts(): array
    {
        return [
            'is_available' => 'boolean',
            'is_featured' => 'boolean',
            'is_popular' => 'boolean',
            'is_new' => 'boolean',
            'is_vegetarian' => 'boolean',
            'is_spicy' => 'boolean',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function addons()
    {
        return $this->hasMany(MenuAddon::class);
    }

    public function branches()
    {
        return $this->belongsToMany(Branch::class, 'branch_menu')->withTimestamps();
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }
        if (str_starts_with($this->image, 'http')) {
            return $this->image;
        }

        return asset('storage/'.$this->image);
    }

    public function badges(): array
    {
        $badges = [];
        if ($this->is_popular) {
            $badges[] = 'Popular';
        }
        if ($this->is_new) {
            $badges[] = 'New';
        }
        if ($this->is_featured) {
            $badges[] = 'Best Seller';
        }
        if ($this->is_spicy) {
            $badges[] = 'Spicy';
        }
        if ($this->is_vegetarian) {
            $badges[] = 'Vegetarian';
        }

        return $badges;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
