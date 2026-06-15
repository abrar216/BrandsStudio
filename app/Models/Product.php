<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'sku',
        'description',
        'short_description',
        'price',
        'discount_price',
        'category_id',
        'stock_quantity',
        'is_featured',
        'is_trending',
        'is_best_seller',
        'is_new_arrival',
        'status',
        'image',
        'main_image',
        'gallery_images',
        'show_in_explore_collections',
        'show_in_featured_couture',
        'show_in_new_arrivals',
        'show_in_trending_apparel',
        'show_in_best_sellers',
        'show_in_collections',
        'display_order',
        'cost_price',
        'gst_rate',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'gst_rate' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_trending' => 'boolean',
        'is_best_seller' => 'boolean',
        'is_new_arrival' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function getActivePriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }

    // Helper to check stock including variants
    public function getTotalStockAttribute()
    {
        if ($this->variants()->exists()) {
            return $this->variants()->sum('stock_quantity');
        }
        return $this->stock_quantity;
    }
}
