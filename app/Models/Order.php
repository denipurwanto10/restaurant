<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number', 'user_id', 'branch_id', 'customer_name', 'customer_email',
        'customer_phone', 'order_type', 'table_number', 'delivery_address',
        'delivery_city', 'delivery_postal_code', 'delivery_note', 'subtotal',
        'discount', 'service_charge', 'delivery_fee', 'total', 'promo_id',
        'status', 'payment_status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function promo()
    {
        return $this->belongsTo(Promo::class);
    }

    public static function generateOrderNumber(): string
    {
        // Unguessable: guest order tracking relies on number secrecy.
        return 'ORD-'.now()->format('Ymd').'-'.strtoupper(\Illuminate\Support\Str::random(10));
    }
}
