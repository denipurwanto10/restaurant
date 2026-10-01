<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'order_id', 'branch_id', 'customer_name', 'rating',
        'comment', 'is_featured', 'is_approved',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'is_approved' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
