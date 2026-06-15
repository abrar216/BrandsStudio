<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::with('transactions')->latest()->paginate(10),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'balance' => 'required|numeric|min:0',
            'is_admin' => 'required|boolean',
        ]);

        $user->update($validated);

        return back()->with('status', "User {$user->name} updated successfully.");
    }

    public function toggleAdmin(User $user)
    {
        // Don't allow changing your own admin status or the main superadmin (optional safety)
        if (auth()->id() === $user->id) {
            return back()->with('error', 'You cannot change your own admin status.');
        }

        $user->update([
            'is_admin' => !$user->is_admin
        ]);

        return back()->with('status', "User {$user->name} admin status updated.");
    }
}
