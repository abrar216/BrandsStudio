<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    /**
     * Send a WhatsApp message.
     * 
     * @param string $to The recipient phone number
     * @param string $message The message body
     * @return bool
     */
    public static function sendMessage($to, $message)
    {
        try {
            // Log the notification for visibility and testing
            Log::info("WhatsApp Notification Sent to [{$to}]:\n{$message}");
            
            // Example real API call (can be uncommented and configured via .env)
            /*
            $url = env('WHATSAPP_API_URL');
            $token = env('WHATSAPP_API_TOKEN');
            
            $response = Http::withToken($token)->post($url, [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'text',
                'text' => ['body' => $message],
            ]);
            
            return $response->successful();
            */
            
            return true;
        } catch (\Exception $e) {
            Log::error("Failed to send WhatsApp message: " . $e->getMessage());
            return false;
        }
    }
}
