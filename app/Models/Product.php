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

    protected static function booted()
    {
        static::retrieved(function ($product) {
            $updated = false;
            $updates = [];

            if ($product->image && str_starts_with($product->image, 'data:image/') && strlen($product->image) > 40000) {
                $compressed = static::compressBase64String($product->image);
                if ($compressed && $compressed !== $product->image) {
                    $updates['image'] = $compressed;
                    $updates['main_image'] = $compressed;
                    $product->image = $compressed;
                    $product->main_image = $compressed;
                    $updated = true;
                }
            }

            if ($product->gallery_images) {
                $gallery = json_decode($product->gallery_images, true);
                if (is_array($gallery)) {
                    $changed = false;
                    $newGallery = [];
                    foreach ($gallery as $img) {
                        if (is_string($img) && str_starts_with($img, 'data:image/') && strlen($img) > 40000) {
                            $comp = static::compressBase64String($img);
                            $newGallery[] = $comp;
                            $changed = true;
                        } else {
                            $newGallery[] = $img;
                        }
                    }
                    if ($changed) {
                        $encoded = json_encode($newGallery);
                        $updates['gallery_images'] = $encoded;
                        $product->gallery_images = $encoded;
                        $updated = true;
                    }
                }
            }

            if ($updated && isset($product->id)) {
                try {
                    \Illuminate\Support\Facades\DB::table('products')
                        ->where('id', $product->id)
                        ->update($updates);
                } catch (\Exception $e) {
                    // Ignore DB locks during read-only ops
                }
            }
        });
    }

    public static function compressBase64String($base64Str, $maxDim = 700, $quality = 70)
    {
        if (!$base64Str || !extension_loaded('gd')) return $base64Str;
        try {
            $parts = explode(',', $base64Str);
            if (count($parts) < 2) return $base64Str;

            $data = base64_decode($parts[1]);
            if (!$data) return $base64Str;

            $src = @imagecreatefromstring($data);
            if (!$src) return $base64Str;

            $width = imagesx($src);
            $height = imagesy($src);

            if ($width > $maxDim || $height > $maxDim) {
                if ($width > $height) {
                    $newWidth = $maxDim;
                    $newHeight = intval($height * ($maxDim / $width));
                } else {
                    $newHeight = $maxDim;
                    $newWidth = intval($width * ($maxDim / $height));
                }
            } else {
                $newWidth = $width;
                $newHeight = $height;
            }

            $dst = imagecreatetruecolor($newWidth, $newHeight);
            imagealphablending($dst, false);
            imagesavealpha($dst, true);
            imagecopyresampled($dst, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

            ob_start();
            imagejpeg($dst, null, $quality);
            $compressedData = ob_get_clean();

            imagedestroy($src);
            imagedestroy($dst);

            return 'data:image/jpeg;base64,' . base64_encode($compressedData);
        } catch (\Exception $e) {
            return $base64Str;
        }
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
