<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminProductDeleteTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_delete_product()
    {
        // 1. Create a Super Admin
        $superAdmin = User::factory()->create(['role' => 'super_admin']);

        // 2. Create a Category and Product
        $category = Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);

        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-SKU-123',
            'price' => 100.00,
            'category_id' => $category->id,
            'stock_quantity' => 10,
            'status' => 'active',
        ]);

        // 3. Create variants and gallery images to test cascading deletion
        $variant = ProductVariant::create([
            'product_id' => $product->id,
            'sku' => 'TEST-SKU-123-VAR',
            'price' => 100.00,
            'stock_quantity' => 5,
        ]);

        $galleryImage = ProductImage::create([
            'product_id' => $product->id,
            'image_path' => 'products/gallery_test.jpg',
        ]);

        // Verify they exist in DB
        $this->assertDatabaseHas('products', ['id' => $product->id]);
        $this->assertDatabaseHas('product_variants', ['id' => $variant->id]);
        $this->assertDatabaseHas('product_images', ['id' => $galleryImage->id]);

        // 4. Send delete request
        $response = $this
            ->actingAs($superAdmin)
            ->delete(route('admin.products.destroy', $product->id));

        // 5. Verify redirect back with success message
        $response->assertStatus(302);
        $response->assertSessionHas('success', 'Product deleted successfully.');

        // 6. Verify product, variant, and gallery images are deleted from database
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
        $this->assertDatabaseMissing('product_variants', ['id' => $variant->id]);
        $this->assertDatabaseMissing('product_images', ['id' => $galleryImage->id]);
    }

    public function test_standard_admin_can_delete_product()
    {
        // 1. Create a Standard Admin
        $admin = User::factory()->create(['role' => 'admin']);

        // 2. Create a Category and Product
        $category = Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);

        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-SKU-123',
            'price' => 100.00,
            'category_id' => $category->id,
            'stock_quantity' => 10,
            'status' => 'active',
        ]);

        // 3. Send delete request
        $response = $this
            ->actingAs($admin)
            ->delete(route('admin.products.destroy', $product->id));

        // 4. Verify redirect back with success message
        $response->assertStatus(302);
        $response->assertSessionHas('success', 'Product deleted successfully.');

        // 5. Verify product is deleted
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_unauthorized_roles_cannot_delete_product()
    {
        // 1. Create Category and Product
        $category = Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);

        $product = Product::create([
            'name' => 'Test Product',
            'slug' => 'test-product',
            'sku' => 'TEST-SKU-123',
            'price' => 100.00,
            'category_id' => $category->id,
            'stock_quantity' => 10,
            'status' => 'active',
        ]);

        // 2. Cashier role is redirected to home/welcome by AdminMiddleware
        $cashier = User::factory()->create(['role' => 'cashier']);
        $response = $this
            ->actingAs($cashier)
            ->delete(route('admin.products.destroy', $product->id));

        $response->assertStatus(302);
        $this->assertDatabaseHas('products', ['id' => $product->id]);

        // 3. Customer role is redirected by AdminMiddleware
        $customer = User::factory()->create(['role' => 'customer']);
        $response = $this
            ->actingAs($customer)
            ->delete(route('admin.products.destroy', $product->id));

        $response->assertStatus(302);
        $this->assertDatabaseHas('products', ['id' => $product->id]);

        // 4. Guest is redirected by auth middleware
        $response = $this->delete(route('admin.products.destroy', $product->id));
        $response->assertStatus(302);
        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }
}
