<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'customer_type',
        'customer_name',
        'customer_phone',
        'customer_email',
        'status',
        'subtotal',
        'discount',
        'shipping_charges',
        'tax',
        'total',
        'payment_method',
        'payment_status',
        'shipping_address',
        'billing_address',
        'notes',
        'tracking_number',
        'estimated_delivery',
        'cashier_id',
        'cash_received',
        'change_returned',
        'amount_paid',
        'payment_details',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'shipping_charges' => 'decimal:2',
        'tax' => 'decimal:2',
        'total' => 'decimal:2',
        'cash_received' => 'decimal:2',
        'change_returned' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'estimated_delivery' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cashier()
    {
        return $this->belongsTo(User::class, 'cashier_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
