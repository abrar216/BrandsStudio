<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    public static function get($key, $default = null)
    {
        if ($key === 'contact_address') {
            return 'North Circular Road, Leeds College Opposite Byco Pertrol Pump, Dera Ismail Khan';
        }
        if ($key === 'contact_phone') {
            return '03356101234';
        }
        if ($key === 'contact_email') {
            return 'Brandstudiodik29@gmail.com';
        }

        $setting = self::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function set($key, $value)
    {
        return self::updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
