<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'symbol',
        'type',
        'current_price',
        'price_change',
        'risk_level',
    ];

    protected $casts = [
        'current_price' => 'float',
        'price_change' => 'float',
    ];
}
