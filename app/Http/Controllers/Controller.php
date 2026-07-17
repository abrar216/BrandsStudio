<?php

namespace App\Http\Controllers;

abstract class Controller
{
    protected function imageToBase64($file)
    {
        if (!$file) return null;

        $mime = $file->getMimeType();
        $path = $file->getRealPath();

        // Compress and resize image if GD library is available
        if (extension_loaded('gd')) {
            try {
                list($width, $height) = getimagesize($path);
                
                // Maximum dimension limit (400px) for thumbnails and lists
                $maxDim = 400;
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

                $src = null;
                if ($mime === 'image/jpeg' || $mime === 'image/jpg') {
                    $src = imagecreatefromjpeg($path);
                } elseif ($mime === 'image/png') {
                    $src = imagecreatefrompng($path);
                } elseif ($mime === 'image/gif') {
                    $src = imagecreatefromgif($path);
                } elseif ($mime === 'image/webp') {
                    if (function_exists('imagecreatefromwebp')) {
                        $src = imagecreatefromwebp($path);
                    }
                }

                if ($src) {
                    $dst = imagecreatetruecolor($newWidth, $newHeight);
                    
                    if ($mime === 'image/png' || $mime === 'image/gif') {
                        imagealphablending($dst, false);
                        imagesavealpha($dst, true);
                    }
                    
                    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                    
                    ob_start();
                    // Always convert to high-compression JPEG with 60% quality to keep base64 strings tiny (< 30KB)
                    imagejpeg($dst, null, 60);
                    $data = ob_get_clean();
                    
                    imagedestroy($src);
                    imagedestroy($dst);
                    
                    return 'data:image/jpeg;base64,' . base64_encode($data);
                }
            } catch (\Exception $e) {
                // Fall back to original file content if exception occurs
            }
        }

        return 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($path));
    }
}
