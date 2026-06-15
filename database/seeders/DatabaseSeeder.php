<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Coupon;
use App\Models\Expense;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Users & Roles
        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'admin@brandsstudio.com',
                'password' => bcrypt('password'),
                'role' => 'super_admin',
            ],
            [
                'name' => 'Dedicated Superadmin',
                'email' => 'superadmin@brandsstudio.com',
                'password' => bcrypt('superadmin2026!'),
                'role' => 'super_admin',
            ],
            [
                'name' => 'Store Manager',
                'email' => 'manager@brandsstudio.com',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ],
            [
                'name' => 'John Cashier',
                'email' => 'cashier@brandsstudio.com',
                'password' => bcrypt('password'),
                'role' => 'cashier',
            ],
            [
                'name' => 'Sarah Staff',
                'email' => 'staff@brandsstudio.com',
                'password' => bcrypt('password'),
                'role' => 'staff',
            ],
            [
                'name' => 'Jane Customer',
                'email' => 'customer@brandsstudio.com',
                'password' => bcrypt('password'),
                'role' => 'customer',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(['email' => $user['email']], $user);
        }

        // 2. Categories
        $categories = [
            [
                'name' => 'Menswear',
                'slug' => 'menswear',
                'description' => 'Premium menswear collection including shirts, trousers, jackets, and smart casuals.',
            ],
            [
                'name' => 'Womenswear',
                'slug' => 'womenswear',
                'description' => 'Elegant and contemporary womenswear dresses, tops, bottoms, and outerwear.',
            ],
            [
                'name' => 'Kids',
                'slug' => 'kids',
                'description' => 'Comfortable and durable apparel for toddlers and teens.',
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Fine leather belts, minimal watches, bags, and luxury accessories to perfect your style.',
            ],
        ];

        $categoryModels = [];
        foreach ($categories as $cat) {
            $categoryModels[$cat['slug']] = Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        // 3. Products
        $productsData = [
            [
                'name' => 'Slim Fit Chinos',
                'slug' => 'slim-fit-chinos',
                'sku' => 'M-CHINO-001',
                'description' => 'Crafted from stretch cotton twill, these slim fit chinos offer a modern silhouette and all-day comfort. Featuring a classic 5-pocket design, zip-fly with button closure, and clean tailored finish. Ideal for both smart-casual office wear and weekend outings.',
                'short_description' => 'Comfortable stretch cotton chinos with a modern slim silhouette.',
                'price' => 4500.00,
                'discount_price' => 3999.00,
                'category_slug' => 'menswear',
                'is_featured' => true,
                'is_trending' => true,
                'is_best_seller' => true,
                'is_new_arrival' => false,
                'status' => 'active',
                'variants' => [
                    ['size' => 'S', 'color' => 'Navy', 'stock' => 15],
                    ['size' => 'M', 'color' => 'Navy', 'stock' => 20],
                    ['size' => 'L', 'color' => 'Navy', 'stock' => 25],
                    ['size' => 'S', 'color' => 'Khaki', 'stock' => 10],
                    ['size' => 'M', 'color' => 'Khaki', 'stock' => 15],
                    ['size' => 'L', 'color' => 'Khaki', 'stock' => 12],
                    ['size' => 'S', 'color' => 'Black', 'stock' => 8],
                    ['size' => 'M', 'color' => 'Black', 'stock' => 14],
                    ['size' => 'L', 'color' => 'Black', 'stock' => 18],
                ]
            ],
            [
                'name' => 'Cotton Crewneck T-Shirt',
                'slug' => 'cotton-crewneck-tshirt',
                'sku' => 'M-TEE-002',
                'description' => 'Made with 100% premium combed ringspun cotton, our signature crewneck t-shirt offers exceptional softness and durability. Detailed with a ribbed collar and double-needle stitching, it is an essential foundation layer for every contemporary wardrobe.',
                'short_description' => 'Ultra-soft 100% organic cotton basic crewneck tee.',
                'price' => 2500.00,
                'discount_price' => null,
                'category_slug' => 'menswear',
                'is_featured' => false,
                'is_trending' => false,
                'is_best_seller' => true,
                'is_new_arrival' => true,
                'status' => 'active',
                'variants' => [
                    ['size' => 'S', 'color' => 'White', 'stock' => 30],
                    ['size' => 'M', 'color' => 'White', 'stock' => 45],
                    ['size' => 'L', 'color' => 'White', 'stock' => 40],
                    ['size' => 'S', 'color' => 'Grey', 'stock' => 25],
                    ['size' => 'M', 'color' => 'Grey', 'stock' => 35],
                    ['size' => 'L', 'color' => 'Grey', 'stock' => 30],
                    ['size' => 'S', 'color' => 'Black', 'stock' => 30],
                    ['size' => 'M', 'color' => 'Black', 'stock' => 50],
                    ['size' => 'L', 'color' => 'Black', 'stock' => 45],
                ]
            ],
            [
                'name' => 'Floral Summer Dress',
                'slug' => 'floral-summer-dress',
                'sku' => 'W-DRESS-001',
                'description' => 'Beautifully designed lightweight floral summer dress with an elegant waist tie and flutter sleeves. Cut from breathable viscose crepe, this vibrant piece flows gracefully and is fully lined for perfect coverage and a clean drape.',
                'short_description' => 'Vibrant lightweight floral dress with adjustable waist belt.',
                'price' => 5999.00,
                'discount_price' => 4999.00,
                'category_slug' => 'womenswear',
                'is_featured' => true,
                'is_trending' => true,
                'is_best_seller' => false,
                'is_new_arrival' => true,
                'status' => 'active',
                'variants' => [
                    ['size' => 'S', 'color' => 'Red', 'stock' => 12],
                    ['size' => 'M', 'color' => 'Red', 'stock' => 15],
                    ['size' => 'L', 'color' => 'Red', 'stock' => 10],
                    ['size' => 'S', 'color' => 'Blue', 'stock' => 8],
                    ['size' => 'M', 'color' => 'Blue', 'stock' => 12],
                    ['size' => 'L', 'color' => 'Blue', 'stock' => 14],
                ]
            ],
            [
                'name' => 'Classic Leather Biker Jacket',
                'slug' => 'classic-leather-biker-jacket',
                'sku' => 'W-JACKET-002',
                'description' => 'A timeless wardrobe investment. Crafted from buttery-soft premium sheepskin leather, this classic asymmetrical biker jacket is detailed with heavy-duty silver-tone zippers, snap lapels, and zipped cuffs. The satin lining ensures smooth layering.',
                'short_description' => 'Premium lambskin leather asymmetrical motorcycle jacket.',
                'price' => 12000.00,
                'discount_price' => null,
                'category_slug' => 'womenswear',
                'is_featured' => true,
                'is_trending' => false,
                'is_best_seller' => true,
                'is_new_arrival' => false,
                'status' => 'active',
                'variants' => [
                    ['size' => 'S', 'color' => 'Black', 'stock' => 5],
                    ['size' => 'M', 'color' => 'Black', 'stock' => 10],
                    ['size' => 'L', 'color' => 'Black', 'stock' => 8],
                    ['size' => 'S', 'color' => 'Brown', 'stock' => 4],
                    ['size' => 'M', 'color' => 'Brown', 'stock' => 6],
                    ['size' => 'L', 'color' => 'Brown', 'stock' => 5],
                ]
            ],
            [
                'name' => 'Casual Fleece Hoodie',
                'slug' => 'casual-fleece-hoodie',
                'sku' => 'K-HOODIE-001',
                'description' => 'Super cosy kids pullover hoodie lined with soft brushed fleece. Features a front kangaroo pocket, ribbed cuffs, and high-density branding embroidery. Crafted from a blend of organic cotton and recycled polyester to ensure maximum softness and durability.',
                'short_description' => 'Comfy and warm cotton-mix fleece pullover for kids.',
                'price' => 3000.00,
                'discount_price' => 2499.00,
                'category_slug' => 'kids',
                'is_featured' => false,
                'is_trending' => true,
                'is_best_seller' => false,
                'is_new_arrival' => true,
                'status' => 'active',
                'variants' => [
                    ['size' => '4Y', 'color' => 'Navy', 'stock' => 10],
                    ['size' => '6Y', 'color' => 'Navy', 'stock' => 15],
                    ['size' => '8Y', 'color' => 'Navy', 'stock' => 12],
                    ['size' => '4Y', 'color' => 'Grey', 'stock' => 8],
                    ['size' => '6Y', 'color' => 'Grey', 'stock' => 14],
                    ['size' => '8Y', 'color' => 'Grey', 'stock' => 10],
                ]
            ],
            [
                'name' => 'Classic Leather Belt',
                'slug' => 'classic-leather-belt',
                'sku' => 'A-BELT-001',
                'description' => 'Complete your outfit with this sleek, full-grain leather belt. Crafted in Italy, it features a polished brushed metal buckle, hand-painted edges, and a clean, versatile design suitable for both formal suits and casual denim.',
                'short_description' => 'Italian full-grain leather belt with brushed steel buckle.',
                'price' => 3500.00,
                'discount_price' => null,
                'category_slug' => 'accessories',
                'is_featured' => false,
                'is_trending' => false,
                'is_best_seller' => true,
                'is_new_arrival' => false,
                'status' => 'active',
                'variants' => [
                    ['size' => '32', 'color' => 'Black', 'stock' => 15],
                    ['size' => '34', 'color' => 'Black', 'stock' => 20],
                    ['size' => '36', 'color' => 'Black', 'stock' => 15],
                    ['size' => '32', 'color' => 'Brown', 'stock' => 10],
                    ['size' => '34', 'color' => 'Brown', 'stock' => 15],
                    ['size' => '36', 'color' => 'Brown', 'stock' => 12],
                ]
            ],
            [
                'name' => 'Minimalist Quartz Watch',
                'slug' => 'minimalist-quartz-watch',
                'sku' => 'A-WATCH-002',
                'description' => 'A beautifully clean timepiece for the modern minimalist. Features a 40mm matte black stainless steel case, an ultra-thin profile, scratch-resistant mineral crystal glass, Japanese quartz movement, and an interchangeable genuine leather strap.',
                'short_description' => 'Premium 40mm matte black watch with Japanese quartz movement.',
                'price' => 8999.00,
                'discount_price' => 7999.00,
                'category_slug' => 'accessories',
                'is_featured' => true,
                'is_trending' => true,
                'is_best_seller' => true,
                'is_new_arrival' => true,
                'status' => 'active',
                'variants' => [] // No variants, standalone stock
            ]
        ];

        foreach ($productsData as $prod) {
            $category = $categoryModels[$prod['category_slug']] ?? null;
            
            $product = Product::updateOrCreate(
                ['slug' => $prod['slug']],
                [
                    'name' => $prod['name'],
                    'sku' => $prod['sku'],
                    'description' => $prod['description'],
                    'short_description' => $prod['short_description'],
                    'price' => $prod['price'],
                    'discount_price' => $prod['discount_price'],
                    'category_id' => $category ? $category->id : null,
                    'is_featured' => $prod['is_featured'],
                    'is_trending' => $prod['is_trending'],
                    'is_best_seller' => $prod['is_best_seller'],
                    'is_new_arrival' => $prod['is_new_arrival'],
                    'status' => $prod['status'],
                    'stock_quantity' => empty($prod['variants']) ? 25 : 0 // Set direct stock if no variants
                ]
            );

            // Add variants
            if (!empty($prod['variants'])) {
                $totalStock = 0;
                foreach ($prod['variants'] as $v) {
                    ProductVariant::updateOrCreate(
                        [
                            'product_id' => $product->id,
                            'size' => $v['size'],
                            'color' => $v['color']
                        ],
                        [
                            'sku' => $product->sku . '-' . strtoupper(substr($v['color'], 0, 2)) . '-' . $v['size'],
                            'price' => null, // Inherits product price
                            'stock_quantity' => $v['stock']
                        ]
                    );
                    $totalStock += $v['stock'];
                }
                
                // Update product stock_quantity to represent total of variants
                $product->update(['stock_quantity' => $totalStock]);
            }
        }

        // 4. Coupons
        Coupon::updateOrCreate(
            ['code' => 'WELCOME10'],
            [
                'type' => 'percentage',
                'value' => 10.00,
                'start_date' => now()->subDays(2),
                'end_date' => now()->addMonths(6),
                'active' => true,
            ]
        );

        Coupon::updateOrCreate(
            ['code' => 'FLAT500'],
            [
                'type' => 'fixed',
                'value' => 500.00,
                'start_date' => now()->subDays(2),
                'end_date' => now()->addMonths(3),
                'active' => true,
            ]
        );

        // 5. Settings
        $settings = [
            'site_name' => 'Brands Studio',
            'site_tagline' => 'Wear your signature.',
            'currency' => 'Rs.',
            'currency_code' => 'PKR',
            'tax_rate' => '10', // 10% tax
            'shipping_charges' => '250',
            'contact_email' => 'support@brandsstudio.com',
            'contact_phone' => '+92 (21) 111-272-637',
            'contact_address' => 'Plot 43-C, Bukhari Commercial Lane 5, Phase 6, DHA, Karachi, Pakistan',
        ];

        foreach ($settings as $key => $val) {
            Setting::updateOrCreate(['key' => $key], ['value' => $val]);
        }

        // 6. Expenses
        $expenses = [
            [
                'title' => 'Winter Stock Procurement',
                'amount' => 250000.00,
                'category' => 'Inventory',
                'date' => now()->subDays(10),
                'description' => 'Purchased fresh winter batch of jackets and hoodies from regional supplier.',
            ],
            [
                'title' => 'Social Media Ad Campaign',
                'amount' => 45000.00,
                'category' => 'Marketing',
                'date' => now()->subDays(5),
                'description' => 'Instagram and Facebook targeted ads for Spring/Summer clearance.',
            ],
            [
                'title' => 'POS Thermal Roll Pack',
                'amount' => 4500.00,
                'category' => 'Office Supplies',
                'date' => now()->subDays(3),
                'description' => 'Bought 20 packs of 80mm thermal receipt printer paper rolls.',
            ],
            [
                'title' => 'Store Electricity Bill',
                'amount' => 31050.00,
                'category' => 'Utilities',
                'date' => now()->subDays(1),
                'description' => 'Monthly electricity charges for the main retail outlet.',
            ],
        ];

        foreach ($expenses as $exp) {
            Expense::create($exp);
        }
    }
}
