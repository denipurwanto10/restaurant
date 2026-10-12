# Saveur Restaurant — Website & Ordering System

Professional, premium, responsive restaurant website with a full online ordering
system. **Vue 3 + Tailwind CSS** frontend served by **Laravel 13 API** with
**Sanctum** authentication, **MySQL** database, **OpenStreetMap + Leaflet**
branch maps, and a **dummy (simulated) payment system** — no real payment
gateway, no API keys required.
 
> “Crafted with Passion, Served with Soul.”

---

## 1. Requirements

| Tool | Version |
|------|---------|
| PHP | ^8.3 (Laragon `php-8.3.x` works) |
| Composer | ^2.x |
| Node.js | ^20+ with npm |
| MySQL | ^8.x (Laragon MySQL works) |

---

## 2. Installation

```bash
# 1. Install PHP dependencies
composer install

# 2. Install JS dependencies
npm install

# 3. Environment
cp .env.example .env
php artisan key:generate
```

## 3. Environment configuration (`.env`)

```env
APP_NAME="Saveur Restaurant"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=restaurant
DB_USERNAME=root
DB_PASSWORD=
```

Create the database first:

```sql
CREATE DATABASE restaurant CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 4. Database setup

```bash
php artisan migrate --seed
php artisan storage:link
```

The seeder creates everything needed for an instant demo:

- 5 categories, **24 menus** (with add-ons on mains/appetizers)
- 3 branches (Jakarta coordinates for the Leaflet map)
- 5 dummy payment methods (QRIS + BCA/BNI/BRI/Mandiri)
- 2 promos (`WELCOME15`, `WEEKEND20`), featured reviews, demo orders + payments

## 5. Running the app

```bash
# Build frontend assets (pure-JS builder: compiles Vue SFCs, Tailwind CSS,
# copies vendor ESM + emits an import map — no native binaries required)
npm run build

# Serve Laravel (serves API + SPA)
php artisan serve
```

Open **http://127.0.0.1:8000**.

> Re-run `npm run build` after changing anything in `resources/js` or
> `resources/css`. Optional verification gates:
> `npm run verify` (module-graph resolution),
> `npm run smoke` (runtime import test),
> `npm run http-gate` (needs `php artisan serve` running).

## 6. Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@restaurant.test` | `password` |
| Customer | `customer@restaurant.test` | `password` |

---

## 7. API documentation

Base URL: `/api`. JSON responses, Laravel pagination on lists.

### Public

```text
GET    /api/menu?search=&category=&sort=popular|price_asc|price_desc|newest&vegetarian=1&spicy=1&featured=1
GET    /api/menu/featured
GET    /api/menu/{slug}
GET    /api/categories
GET    /api/branches
GET    /api/branches/{slug}
GET    /api/promos
GET    /api/reviews
GET    /api/payment-methods

POST   /api/register            {name, email, password, password_confirmation, phone?}
POST   /api/login               {email, password}            → {user, token}
POST   /api/forgot-password     {email}
POST   /api/orders              create order + dummy payment (guest or token)
GET    /api/orders/lookup/{orderNumber}
GET    /api/orders/lookup-by-invoice/{invoice}
POST   /api/payments/by-invoice/{invoice}/simulate   {result: paid|failed}
```

> Guest payment simulation is keyed by the unguessable invoice number
> (e.g. `INV-20260912-X7KQ2M9P4A`), never by sequential IDs — payments
> cannot be enumerated.

### Authenticated (`Authorization: Bearer <token>`)

```text
POST   /api/logout
GET    /api/me
GET    /api/orders
GET    /api/orders/{id}
GET    /api/payments/{id}
```

### Admin (`role = admin`)

```text
GET    /api/admin/dashboard
GET    /api/admin/menus            POST /api/admin/menus
PUT    /api/admin/menus/{id}       DELETE /api/admin/menus/{id}
GET    /api/admin/categories       POST /api/admin/categories
PUT    /api/admin/categories/{id}  DELETE /api/admin/categories/{id}
POST   /api/admin/categories/reorder   {ids: [...]}
GET    /api/admin/orders           PUT /api/admin/orders/{id}/status
GET    /api/admin/payments
GET|POST /api/admin/branches  (+ PUT, DELETE)
GET|POST /api/admin/promos    (+ PUT, DELETE)
GET    /api/admin/customers
GET    /api/admin/reviews      POST /api/admin/reviews/{id}/toggle
```

---

## 8. Dummy payment flow

No real money is ever charged. Every payment screen shows the label:

> **“Demo Payment — No real money will be charged.”**

```text
Checkout → select QRIS / Bank Transfer → order created (pending)
  → payment created (pending, unguessable invoice no., expiry)
  → /payment/{invoice}: dummy QR or bank account shown
  → “Simulate Payment” → payment paid → order confirmed
  → customer tracks timeline: placed → confirmed → preparing → ready → completed
```

QRIS uses a static dummy QR image; bank transfer shows demo account numbers
(`1234567890` etc. under “RESTAURANT DEMO”). Admins can advance order statuses
from `/admin/orders`.

---

## 8b. Light / dark mode

The UI supports **light and dark themes**:

- Toggle via the sun/moon button in the navbar (customer), admin header,
  or footer. Choice persists in `localStorage` (`saveur_theme`); first visit
  follows the OS `prefers-color-scheme` setting.
- Implemented with Tailwind's `class` dark-mode strategy: the theme store
  (`resources/js/stores/theme.js`) toggles `.dark` on `<html>`, and a
  pre-paint inline script in `resources/views/app.blade.php` prevents flashing.
- After editing templates, re-run `node scripts/dark-mode.mjs` to propagate
  `dark:` variants for new color classes, then `npm run build`.

---

## 9. Project structure

```text
app/
├── Console/Commands/BuildFrontend.php
├── Http/
│   ├── Controllers/Api/          Auth, Menu, Branch, Content, Order, Payment
│   ├── Controllers/Api/Admin/    Dashboard, Menu/Category/Order/Resource mgmt
│   ├── Middleware/EnsureAdmin.php
│   ├── Requests/                 Register, Login, StoreOrder, StoreMenu, ...
│   └── Resources/                Menu, Order, Payment, Branch, Category, ...
├── Models/                       User, Category, Menu, MenuAddon, Branch,
│                                 Order, OrderItem, Payment, PaymentMethod, Promo, Review
database/
├── migrations/                   restaurant schema + sanctum tokens
└── seeders/                      RestaurantSeeder, OrderSeeder
resources/js/
├── App.vue  main entry (Pinia + Router)
├── components/  Navbar, Footer, MenuCard, CartDrawer, ToastHost, ...
├── layouts/     CustomerLayout, AdminLayout
├── pages/       Home, Menu, MenuDetail, Checkout, Payment, Orders,
│                OrderDetail, Branches, BranchDetail, Login, Register, About
├── admin/       Dashboard, Order/Menu/Category/Payment mgmt, ManageResources
├── stores/      cart, auth, toast, theme (Pinia)
├── services/api.js   (Axios + token handling)
└── router/index.js   (customer + admin guards)
scripts/
├── build.mjs        pure-JS production builder (SFC + Tailwind + import map)
├── dark-mode.mjs    propagates dark: variants across templates
└── verify-build.mjs / smoke.mjs / http-gate.mjs (verification gates)
```

---

## 10. Security notes

Sanctum bearer tokens, `EnsureAdmin` middleware + Vue router guards, Form
Request validation everywhere, hashed passwords, throttle rate-limiting on
auth/order endpoints, JSON 401/403 handling, mass-assignment `$fillable`
whitelists, and Eloquent parameter binding throughout.
