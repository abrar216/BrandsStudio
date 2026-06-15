<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'start_date',
        'end_date',
        'active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function isValid(): bool
    {
        if (!$this->active) {
            return false;
        }

        $today = now()->startOfDay();

        if ($this->start_date && $today->lt($this->start_date)) {
            return false;
        }

        if ($this->end_date && $today->gt($this->end_date)) {
            return false;
        }

        return true;
    }

    public function calculateDiscount($subtotal): float
    {
        if ($this->type === 'percentage') {
            return round(($subtotal * ($this->value / 100)), 2);
        }
        return min((float)$this->value, (float)$subtotal);
    }
}
