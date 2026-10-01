<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Category;
use App\Models\Menu;
use App\Models\MenuAddon;
use App\Models\PaymentMethod;
use App\Models\Promo;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RestaurantSeeder extends Seeder
{
    public function run(): void
    {
        // ---- Users ----
        User::updateOrCreate(
            ['email' => 'admin@restaurant.test'],
            ['name' => 'Restaurant Admin', 'password' => Hash::make('password'), 'role' => 'admin', 'phone' => '081234567890']
        );
        $customer = User::updateOrCreate(
            ['email' => 'customer@restaurant.test'],
            ['name' => 'Jane Customer', 'password' => Hash::make('password'), 'role' => 'customer', 'phone' => '081298765432']
        );
        foreach (['Budi Santoso', 'Siti Rahayu', 'Andi Pratama'] as $i => $name) {
            User::updateOrCreate(
                ['email' => "customer{$i}@restaurant.test"],
                ['name' => $name, 'password' => Hash::make('password'), 'role' => 'customer']
            );
        }

        // ---- Categories ----
        $categories = [
            ['name' => 'Appetizer', 'slug' => 'appetizer', 'description' => 'Small plates to awaken the palate.', 'sort_order' => 1],
            ['name' => 'Main Course', 'slug' => 'main-course', 'description' => 'Signature dishes crafted by our chefs.', 'sort_order' => 2],
            ['name' => 'Dessert', 'slug' => 'dessert', 'description' => 'Sweet endings worth lingering for.', 'sort_order' => 3],
            ['name' => 'Drinks', 'slug' => 'drinks', 'description' => 'Fresh juices, teas and coolers.', 'sort_order' => 4],
            ['name' => 'Coffee', 'slug' => 'coffee', 'description' => 'Single-origin coffee, brewed with care.', 'sort_order' => 5],
        ];
        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat + ['is_active' => true]);
        }
        $catId = fn (string $slug) => Category::where('slug', $slug)->firstOrFail()->id;

        // ---- Menus (24 items) ----
        $menus = [
            // Appetizer
            ['c' => 'appetizer', 'name' => 'Bruschetta al Pomodoro', 'price' => 45000, 'desc' => 'Toasted sourdough, marinated tomatoes, basil, extra-virgin olive oil.', 'ing' => 'Sourdough, tomato, basil, garlic, olive oil', 'popular' => true, 'veg' => true],
            ['c' => 'appetizer', 'name' => 'Caesar Salad', 'price' => 55000, 'desc' => 'Crisp romaine, parmesan, house croutons, classic Caesar dressing.', 'ing' => 'Romaine, parmesan, croutons, anchovy dressing', 'popular' => true, 'veg' => true],
            ['c' => 'appetizer', 'name' => 'Crispy Calamari', 'price' => 62000, 'desc' => 'Golden-fried calamari with lemon aioli and fresh herbs.', 'ing' => 'Squid, flour, lemon, aioli'],
            ['c' => 'appetizer', 'name' => 'French Fries Truffle', 'price' => 48000, 'desc' => 'Hand-cut fries tossed in truffle oil with parmesan snow.', 'ing' => 'Potato, truffle oil, parmesan', 'veg' => true, 'new' => true],
            // Main Course
            ['c' => 'main-course', 'name' => 'Wagyu Steak', 'price' => 185000, 'desc' => 'Premium wagyu striploin, grilled to perfection, red wine jus.', 'ing' => 'Wagyu striploin, rosemary, garlic butter, red wine jus', 'featured' => true, 'popular' => true],
            ['c' => 'main-course', 'name' => 'Chicken Steak', 'price' => 75000, 'desc' => 'Juicy grilled chicken steak with creamy mushroom sauce.', 'ing' => 'Chicken breast, mushroom, cream, herbs', 'popular' => true],
            ['c' => 'main-course', 'name' => 'Truffle Pasta', 'price' => 95000, 'desc' => 'Handmade tagliatelle in black truffle cream sauce.', 'ing' => 'Tagliatelle, black truffle, cream, parmesan', 'featured' => true, 'veg' => true],
            ['c' => 'main-course', 'name' => 'Beef Burger Deluxe', 'price' => 68000, 'desc' => 'Double smashed beef patty, cheddar, caramelized onion, brioche.', 'ing' => 'Beef, cheddar, brioche, onion, house sauce', 'popular' => true],
            ['c' => 'main-course', 'name' => 'Margherita Pizza', 'price' => 72000, 'desc' => 'Wood-fired pizza, san marzano tomato, fior di latte, basil.', 'ing' => 'Flour, tomato, mozzarella, basil', 'veg' => true],
            ['c' => 'main-course', 'name' => 'Salmon Teriyaki', 'price' => 89000, 'desc' => 'Pan-seared salmon glazed with house teriyaki, sesame rice.', 'ing' => 'Salmon, teriyaki, sesame, rice', 'new' => true],
            ['c' => 'main-course', 'name' => 'Nasi Goreng Special', 'price' => 58000, 'desc' => 'Indonesian fried rice, prawn, chicken satay, fried egg.', 'ing' => 'Rice, prawn, chicken, egg, kecap manis', 'spicy' => true, 'popular' => true],
            ['c' => 'main-course', 'name' => 'Beef Rendang', 'price' => 78000, 'desc' => 'Slow-braised beef rendang with coconut rice and sambal.', 'ing' => 'Beef, coconut milk, spices, rice', 'spicy' => true],
            ['c' => 'main-course', 'name' => 'Spaghetti Aglio e Olio', 'price' => 62000, 'desc' => 'Garlic-chili olive oil spaghetti with parmesan and parsley.', 'ing' => 'Spaghetti, garlic, chili, olive oil', 'spicy' => true, 'veg' => true],
            // Dessert
            ['c' => 'dessert', 'name' => 'Tiramisu Classico', 'price' => 52000, 'desc' => 'Espresso-soaked savoiardi, mascarpone cloud, cocoa dust.', 'ing' => 'Mascarpone, espresso, savoiardi, cocoa', 'popular' => true, 'veg' => true],
            ['c' => 'dessert', 'name' => 'New York Cheesecake', 'price' => 55000, 'desc' => 'Baked cheesecake, buttery biscuit base, berry coulis.', 'ing' => 'Cream cheese, biscuit, berries', 'veg' => true],
            ['c' => 'dessert', 'name' => 'Chocolate Lava Cake', 'price' => 58000, 'desc' => 'Warm dark chocolate cake with molten center, vanilla gelato.', 'ing' => 'Dark chocolate, butter, egg, vanilla gelato', 'featured' => true, 'veg' => true],
            ['c' => 'dessert', 'name' => 'Panna Cotta Berry', 'price' => 48000, 'desc' => 'Silky vanilla panna cotta with macerated seasonal berries.', 'ing' => 'Cream, vanilla, gelatin, berries', 'veg' => true, 'new' => true],
            // Drinks
            ['c' => 'drinks', 'name' => 'Iced Tea Classic', 'price' => 22000, 'desc' => 'Freshly brewed black tea served over crystal ice.', 'ing' => 'Black tea, cane sugar, lemon', 'veg' => true],
            ['c' => 'drinks', 'name' => 'Lemon Tea Honey', 'price' => 28000, 'desc' => 'Citrus tea brightened with honey and mint.', 'ing' => 'Tea, lemon, honey, mint', 'veg' => true],
            ['c' => 'drinks', 'name' => 'Mango Smoothie', 'price' => 35000, 'desc' => 'Ripe mango blended with yogurt and a touch of honey.', 'ing' => 'Mango, yogurt, honey', 'veg' => true, 'new' => true],
            // Coffee
            ['c' => 'coffee', 'name' => 'Espresso', 'price' => 28000, 'desc' => 'Double shot of single-origin arabica, golden crema.', 'ing' => 'Arabica coffee beans', 'veg' => true],
            ['c' => 'coffee', 'name' => 'Cappuccino', 'price' => 35000, 'desc' => 'Velvety steamed milk over rich espresso, cocoa veil.', 'ing' => 'Espresso, milk, cocoa', 'popular' => true, 'veg' => true],
            ['c' => 'coffee', 'name' => 'Caffe Latte', 'price' => 38000, 'desc' => 'Silky latte with delicate latte art, single-origin beans.', 'ing' => 'Espresso, steamed milk', 'veg' => true],
            ['c' => 'coffee', 'name' => 'Caramel Macchiato', 'price' => 42000, 'desc' => 'Layered espresso, milk and house caramel drizzle.', 'ing' => 'Espresso, milk, caramel', 'veg' => true, 'featured' => true],
        ];

        foreach ($menus as $m) {
            $menu = Menu::updateOrCreate(
                ['slug' => \Illuminate\Support\Str::slug($m['name'])],
                [
                    'category_id' => $catId($m['c']),
                    'name' => $m['name'],
                    'description' => $m['desc'],
                    'ingredients' => $m['ing'],
                    'price' => $m['price'],
                    'is_available' => true,
                    'is_featured' => $m['featured'] ?? false,
                    'is_popular' => $m['popular'] ?? false,
                    'is_new' => $m['new'] ?? false,
                    'is_vegetarian' => $m['veg'] ?? false,
                    'is_spicy' => $m['spicy'] ?? false,
                    'stock' => 100,
                    'sold_count' => rand(20, 400),
                ]
            );

            if (in_array($m['c'], ['main-course', 'appetizer'])) {
                MenuAddon::updateOrCreate(
                    ['menu_id' => $menu->id, 'name' => 'Extra Cheese'],
                    ['price' => 10000, 'is_active' => true]
                );
                MenuAddon::updateOrCreate(
                    ['menu_id' => $menu->id, 'name' => 'Extra Egg'],
                    ['price' => 8000, 'is_active' => true]
                );
                MenuAddon::updateOrCreate(
                    ['menu_id' => $menu->id, 'name' => 'Extra Sauce'],
                    ['price' => 5000, 'is_active' => true]
                );
            }
        }

        // ---- Branches (Jakarta coordinates) ----
        $branches = [
            [
                'name' => 'Saveur Downtown', 'slug' => 'downtown',
                'address' => 'Jl. Sudirman Kav. 52-53, SCBD', 'city' => 'Jakarta Selatan',
                'phone' => '021-50801234', 'latitude' => -6.2247, 'longitude' => 106.8094,
                'opening_hours' => 'Mon–Sun 10:00–22:00',
                'description' => 'Our flagship fine-dining house in the heart of SCBD.',
                'facilities' => 'Private Dining, Valet Parking, WiFi, Live Music, Prayer Room',
            ],
            [
                'name' => 'Saveur Central', 'slug' => 'central',
                'address' => 'Jl. M.H. Thamrin No. 59, Grand Indonesia', 'city' => 'Jakarta Pusat',
                'phone' => '021-50805678', 'latitude' => -6.1954, 'longitude' => 106.8227,
                'opening_hours' => 'Mon–Sun 10:00–21:30',
                'description' => 'A cozy central spot perfect for business lunches.',
                'facilities' => 'Meeting Room, WiFi, Kids Corner, Takeaway Counter',
            ],
            [
                'name' => 'Saveur Mall Galeria', 'slug' => 'mall-galeria',
                'address' => 'Jl. Pondok Indah Raya, Mall Galeria Lt. 2', 'city' => 'Jakarta Selatan',
                'phone' => '021-50809012', 'latitude' => -6.2667, 'longitude' => 106.7831,
                'opening_hours' => 'Mon–Sun 10:00–22:00',
                'description' => 'Family-friendly dining with a view of the atrium.',
                'facilities' => 'Kids Playground, Outdoor Terrace, WiFi, Baby Chair',
            ],
        ];
        foreach ($branches as $b) {
            $branch = Branch::updateOrCreate(['slug' => $b['slug']], $b + ['is_active' => true]);
            $branch->menus()->syncWithoutDetaching(Menu::pluck('id')->toArray());
        }

        // ---- Payment methods (dummy) ----
        $methods = [
            ['code' => 'qris', 'name' => 'QRIS', 'type' => 'qris', 'account_name' => 'SAVEUR RESTAURANT DEMO', 'instructions' => 'Scan the QR code with any e-wallet or mobile banking app.'],
            ['code' => 'bank_bca', 'name' => 'Bank BCA', 'type' => 'bank_transfer', 'account_number' => '1234567890', 'account_name' => 'RESTAURANT DEMO', 'instructions' => 'Transfer to the BCA virtual account above.'],
            ['code' => 'bank_bni', 'name' => 'Bank BNI', 'type' => 'bank_transfer', 'account_number' => '0987654321', 'account_name' => 'RESTAURANT DEMO', 'instructions' => 'Transfer to the BNI virtual account above.'],
            ['code' => 'bank_bri', 'name' => 'Bank BRI', 'type' => 'bank_transfer', 'account_number' => '1122334455', 'account_name' => 'RESTAURANT DEMO', 'instructions' => 'Transfer to the BRI virtual account above.'],
            ['code' => 'bank_mandiri', 'name' => 'Bank Mandiri', 'type' => 'bank_transfer', 'account_number' => '5566778899', 'account_name' => 'RESTAURANT DEMO', 'instructions' => 'Transfer to the Mandiri virtual account above.'],
        ];
        foreach ($methods as $pm) {
            PaymentMethod::updateOrCreate(['code' => $pm['code']], $pm + ['is_active' => true]);
        }

        // ---- Promos ----
        $promos = [
            ['code' => 'WELCOME15', 'title' => 'Welcome 15% Off', 'description' => '15% off your first order, up to Rp 30.000.', 'discount_type' => 'percent', 'discount_value' => 15, 'min_order' => 50000, 'max_discount' => 30000],
            ['code' => 'WEEKEND20', 'title' => 'Weekend Treat 20K', 'description' => 'Flat Rp 20.000 off for orders above Rp 150.000.', 'discount_type' => 'fixed', 'discount_value' => 20000, 'min_order' => 150000, 'max_discount' => 20000],
        ];
        foreach ($promos as $p) {
            Promo::updateOrCreate(['code' => $p['code']], $p + [
                'starts_at' => now()->subMonth(), 'ends_at' => now()->addMonths(3), 'is_active' => true,
            ]);
        }

        // ---- Reviews ----
        $reviews = [
            ['customer_name' => 'Budi Santoso', 'rating' => 5, 'comment' => 'The wagyu steak was incredible — best fine dining experience in Jakarta!'],
            ['customer_name' => 'Siti Rahayu', 'rating' => 5, 'comment' => 'Elegant atmosphere, truffle pasta is a must-try. Service was flawless.'],
            ['customer_name' => 'Andi Pratama', 'rating' => 4, 'comment' => 'Great coffee and desserts. The lava cake with gelato is heavenly.'],
        ];
        foreach ($reviews as $r) {
            Review::firstOrCreate(
                ['customer_name' => $r['customer_name'], 'comment' => $r['comment']],
                $r + ['user_id' => $customer->id, 'is_featured' => true, 'is_approved' => true]
            );
        }
    }
}
