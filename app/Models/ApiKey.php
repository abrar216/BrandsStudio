<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiKey extends Model
{
    use HasFactory;

    protected $table = 'api_keys';

    protected $fillable = [
        'user_id',
        'exchange',
        'label',
        'api_key',
        'api_secret',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
