<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create(['role' => 'customer']);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }

    public function test_super_admin_redirected_to_admin_dashboard_after_login(): void
    {
        $user = User::factory()->create(['role' => 'super_admin']);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('admin.dashboard', absolute: false));
    }

    public function test_admin_redirected_to_admin_dashboard_after_login(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('admin.dashboard', absolute: false));
    }

    public function test_cashier_redirected_to_pos_after_login(): void
    {
        $user = User::factory()->create(['role' => 'cashier']);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('admin.pos.index', absolute: false));
    }

    public function test_staff_redirected_to_pos_after_login(): void
    {
        $user = User::factory()->create(['role' => 'staff']);

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('admin.pos.index', absolute: false));
    }

    public function test_admin_restricted_from_customer_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertRedirect(route('admin.dashboard', absolute: false));
    }

    public function test_cashier_restricted_from_customer_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'cashier']);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertRedirect(route('admin.pos.index', absolute: false));
    }

    public function test_customer_restricted_from_admin_dashboard(): void
    {
        $user = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($user)->get('/admin');

        $response->assertRedirect(route('welcome', absolute: false));
        $response->assertSessionHas('error', 'Unauthorized access.');
    }

    public function test_customer_restricted_from_pos(): void
    {
        $user = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($user)->get('/admin/pos');

        $response->assertRedirect(route('welcome', absolute: false));
        $response->assertSessionHas('error', 'Unauthorized access.');
    }

    public function test_cashier_restricted_from_admin_pages_except_pos(): void
    {
        $user = User::factory()->create(['role' => 'cashier']);

        // Cashier tries to access Admin home
        $response = $this->actingAs($user)->get('/admin');
        $response->assertRedirect(route('welcome', absolute: false));
        $response->assertSessionHas('error', 'Unauthorized access.');

        // Cashier tries to access Admin Products page
        $response = $this->actingAs($user)->get('/admin/products');
        $response->assertRedirect(route('welcome', absolute: false));
        $response->assertSessionHas('error', 'Unauthorized access.');
    }
}


