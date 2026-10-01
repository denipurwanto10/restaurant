<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\Admin\CategoryManagementController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\MenuManagementController;
use App\Http\Controllers\Api\Admin\OrderManagementController;
use App\Http\Controllers\Api\Admin\ResourceManagementController;
use App\Http\Middleware\EnsureAdmin;
use Illuminate\Support\Facades\Route;

// ---- Public ----
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');

Route::get('/menu', [MenuController::class, 'index']);
Route::get('/menu/featured', [MenuController::class, 'featured']);
Route::get('/menu/{menu:slug}', [MenuController::class, 'show']);
Route::get('/categories', [MenuController::class, 'categories']);
Route::get('/branches', [BranchController::class, 'index']);
Route::get('/branches/{branch:slug}', [BranchController::class, 'show']);
Route::get('/promos', [ContentController::class, 'promos']);
Route::get('/reviews', [ContentController::class, 'reviews']);
Route::get('/payment-methods', [PaymentController::class, 'methods']);

// Guest order lookup / payment simulation via unguessable invoice number
Route::get('/orders/lookup/{orderNumber}', [OrderController::class, 'showByNumber']);
Route::get('/orders/lookup-by-invoice/{invoice}', [OrderController::class, 'showByInvoice']);
Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:20,1');
Route::post('/payments/by-invoice/{invoice}/simulate', [PaymentController::class, 'simulateByInvoice'])->middleware('throttle:30,1');

// ---- Authenticated ----
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::get('/payments/{payment}', [PaymentController::class, 'show']);

    // ---- Admin ----
    Route::middleware(EnsureAdmin::class)->prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);

        Route::get('/menus', [MenuManagementController::class, 'index']);
        Route::post('/menus', [MenuManagementController::class, 'store']);
        Route::get('/menus/{menu}', [MenuManagementController::class, 'show']);
        Route::put('/menus/{menu}', [MenuManagementController::class, 'update']);
        Route::post('/menus/{menu}', [MenuManagementController::class, 'update']); // multipart support
        Route::delete('/menus/{menu}', [MenuManagementController::class, 'destroy']);

        Route::get('/categories', [CategoryManagementController::class, 'index']);
        Route::post('/categories/reorder', [CategoryManagementController::class, 'reorder']);
        Route::post('/categories', [CategoryManagementController::class, 'store']);
        Route::put('/categories/{category}', [CategoryManagementController::class, 'update']);
        Route::post('/categories/{category}', [CategoryManagementController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryManagementController::class, 'destroy']);

        Route::get('/orders', [OrderManagementController::class, 'orders']);
        Route::get('/orders/{order}', [OrderManagementController::class, 'showOrder']);
        Route::put('/orders/{order}/status', [OrderManagementController::class, 'updateStatus']);

        Route::get('/payments', [OrderManagementController::class, 'payments']);

        Route::get('/branches', [ResourceManagementController::class, 'branches']);
        Route::post('/branches', [ResourceManagementController::class, 'storeBranch']);
        Route::put('/branches/{branch}', [ResourceManagementController::class, 'updateBranch']);
        Route::delete('/branches/{branch}', [ResourceManagementController::class, 'destroyBranch']);

        Route::get('/promos', [ResourceManagementController::class, 'promos']);
        Route::post('/promos', [ResourceManagementController::class, 'storePromo']);
        Route::put('/promos/{promo}', [ResourceManagementController::class, 'updatePromo']);
        Route::delete('/promos/{promo}', [ResourceManagementController::class, 'destroyPromo']);

        Route::get('/customers', [ResourceManagementController::class, 'customers']);
        Route::get('/reviews', [ResourceManagementController::class, 'reviews']);
        Route::post('/reviews/{review}/toggle', [ResourceManagementController::class, 'toggleReview']);
    });
});
