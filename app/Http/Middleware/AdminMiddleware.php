<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()) {
            return redirect()->route('welcome')->with('error', 'Unauthorized access.');
        }

        // Admins and Super Admins have complete access to the admin panel
        if ($request->user()->isAdmin()) {
            return $next($request);
        }

        // Cashiers and Staff are allowed access ONLY to the POS terminal and its API endpoints
        if ($request->user()->isStaff()) {
            if ($request->is('admin/pos*') || $request->is('admin/api/pos*')) {
                return $next($request);
            }
        }

        return redirect()->route('welcome')->with('error', 'Unauthorized access.');
    }
}
