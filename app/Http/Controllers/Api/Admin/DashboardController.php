<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Menu;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->startOfDay();

        $totalRevenue = Order::where('payment_status', 'paid')->sum('total');
        $monthRevenue = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', now()->startOfMonth())
            ->sum('total');

        $revenueByDay = Order::selectRaw('DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders')
            ->where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subDays(13)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $ordersByStatus = Order::selectRaw('status, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('status')
            ->pluck('count', 'status');

        $popularMenus = Menu::orderByDesc('sold_count')->take(5)
            ->get(['id', 'name', 'price', 'sold_count']);

        return response()->json([
            'stats' => [
                'total_orders' => Order::count(),
                'today_orders' => Order::where('created_at', '>=', $today)->count(),
                'total_revenue' => (int) $totalRevenue,
                'month_revenue' => (int) $monthRevenue,
                'pending_orders' => Order::where('status', 'pending')->count(),
                'total_customers' => User::where('role', 'customer')->count(),
                'total_menus' => Menu::count(),
            ],
            'revenue_chart' => $revenueByDay,
            'orders_by_status' => $ordersByStatus,
            'popular_menus' => $popularMenus,
            'recent_orders' => OrderResource::collection(
                Order::with(['branch', 'items'])->orderByDesc('created_at')->take(8)->get()
            ),
        ]);
    }
}
