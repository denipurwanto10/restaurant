<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number', 'order_id', 'payment_method_id', 'payment_method_code',
        'bank_code', 'amount', 'status', 'expires_at', 'paid_at', 'payload',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function method()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }

    public static function generateInvoiceNumber(): string
    {
        // Unguessable: guest payment flows rely on invoice secrecy.
        return 'INV-'.now()->format('Ymd').'-'.strtoupper(\Illuminate\Support\Str::random(10));
    }
}
