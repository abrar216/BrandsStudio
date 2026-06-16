<?php

namespace App\Http\Controllers;

abstract class Controller
{
    protected function imageToBase64($file)
    {
        if (!$file) return null;
        return 'data:' . $file->getMimeType() . ';base64,' . base64_encode(file_get_contents($file->getRealPath()));
    }
}
