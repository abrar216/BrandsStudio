<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'symbol',
        'type',
        'order_type',
        'limit_price',
        'quantity',
        'price',
        'total_price',
        'status',
    ];

    protected $casts = [
        'limit_price' => 'float',
        'quantity' => 'integer',
        'price' => 'float',
        'total_price' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
