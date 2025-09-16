
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, Hourglass, Server, IndianRupee, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import RevenueChart from './revenue-chart';
import OrderStatusChart from "./order-status-chart";
import RecentOrders from "./recent-orders";
import type { Order } from "@/lib/database";

async function getTotalUsers() {
    const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error fetching total users:', error);
        return 0;
    }

    return count || 0;
}

async function getTotalOrders() {
    const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error fetching total orders:', error);
        return 0;
    }

    return count || 0;
}

async function getPendingOrders() {
    const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

    if (error) {
        console.error('Error fetching pending orders:', error);
        return 0;
    }

    return count || 0;
}

async function getTotalRevenue() {
    const { data, error } = await supabase
        .from('orders')
        .select('price, status')
        .eq('status', 'confirmed');
    
    if (error) {
        console.error('Error fetching revenue:', error);
        return 0;
    }

    const totalRevenue = data.reduce((sum, order) => {
        const priceString = order.price || '0';
        const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ''));
        return sum + (isNaN(numericPrice) ? 0 : numericPrice);
    }, 0);
    
    return totalRevenue;
}

async function getOrderStats() {
    const { data, error } = await supabase
        .from('orders')
        .select('status');

    if (error) {
        console.error('Error fetching order stats:', error);
        return { confirmed: 0, pending: 0, cancelled: 0 };
    }

    return data.reduce((acc, order) => {
        if (order.status) {
            acc[order.status as keyof typeof acc]++;
        }
        return acc;
    }, { confirmed: 0, pending: 0, cancelled: 0 });
}

async function getRecentOrders(): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching recent orders:', error);
        return [];
    }

    return data as Order[];
}


export default async function AdminDashboard() {
  const totalUsers = await getTotalUsers();
  const totalOrders = await getTotalOrders();
  const pendingOrders = await getPendingOrders();
  const totalRevenue = await getTotalRevenue();
  const orderStats = await getOrderStats();
  const recentOrders = await getRecentOrders();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin! Here's an overview of your platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glassmorphism hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
        </Card>

        <Card className="glassmorphism hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Currently registered users</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">+50 since yesterday</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <OrderStatusChart data={orderStats} />
      </div>
      <RecentOrders orders={recentOrders} />
    </div>
  );
}
