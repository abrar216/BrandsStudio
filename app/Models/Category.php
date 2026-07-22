<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id',
        'image',
        'display_order',
        'show_on_homepage',
    ];

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
    protected static function booted()
    {
        static::retrieved(function ($category) {
            if ($category->image && str_starts_with($category->image, 'data:image/') && strlen($category->image) > 30000) {
                $compressed = static::compressBase64String($category->image);
                if ($compressed && $compressed !== $category->image) {
                    $category->image = $compressed;
                    if (isset($category->id)) {
                        try {
                            \Illuminate\Support\Facades\DB::table('categories')
                                ->where('id', $category->id)
                                ->update(['image' => $compressed]);
                        } catch (\Exception $e) {
                            // Ignore DB locks
                        }
                    }
                }
            }
        });
    }

    public static function compressBase64String($base64Str, $maxDim = 600, $quality = 70)
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
}
