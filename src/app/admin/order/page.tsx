
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart, Clock } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/lib/database';
import OrderStatusChart from "../dashboard/order-status-chart";
import { RecentOrdersTable } from "./recent-orders";
import { OrdersTable } from "./my-orders";


async function getOrderAnalytics() {
    const { data: orders, error } = await supabase
        .from('orders')
        .select('*');

    if (error) {
        console.error('Error reading data for order page:', error);
        return {
            totalOrders: 0,
            orderStats: { confirmed: 0, pending: 0, cancelled: 0 },
            allOrders: [],
            minecraftOrders: [],
            vpsOrders: [],
            domainOrders: [],
        };
    }
    
    const totalOrders = orders.length;
    const orderStats = orders.reduce((acc, order) => {
        if (order.status) {
            acc[order.status as keyof typeof acc]++;
        }
        return acc;
    }, { confirmed: 0, pending: 0, cancelled: 0 });


    const minecraftOrders = orders.filter(o => o.type === 'hosting');
    const vpsOrders = orders.filter(o => o.type === 'vps');
    const domainOrders = orders.filter(o => o.type === 'domain');
    
    return {
        totalOrders,
        orderStats,
        allOrders: orders as Order[],
        minecraftOrders: minecraftOrders as Order[],
        vpsOrders: vpsOrders as Order[],
        domainOrders: domainOrders as Order[],
    };
}


export default async function OrderPage() {
    const session = await getServerSession(authOptions);
    const analytics = await getOrderAnalytics();
    
    const userRole = session?.user?.role;
    if (!userRole || !['super admin', 'admin', 'manager', 'staff'].includes(userRole)) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Orders Overview</h1>
                    <p className="text-muted-foreground">An overview of all orders.</p>
                </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <Card className="glassmorphism">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalOrders}</div>
                        <p className="text-xs text-muted-foreground">All time order count</p>
                    </CardContent>
                </Card>
                <Card className="glassmorphism">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        <Clock className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.orderStats.pending}</div>
                        <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
                    </CardContent>
                </Card>
            </div>

             <OrdersTable orders={analytics.minecraftOrders} title="Minecraft Orders" description="A list of all Minecraft hosting orders." />
             <OrdersTable orders={analytics.vpsOrders} title="VPS Orders" description="A list of all VPS hosting orders." />
             <OrdersTable orders={analytics.domainOrders} title="Domain Orders" description="A list of all domain registration orders." />

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <Card className="glassmorphism">
                    <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                        <CardDescription>Distribution of confirmed, pending, and cancelled orders.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                         <OrderStatusChart data={analytics.orderStats} />
                    </CardContent>
                </Card>
            </div>

            <RecentOrdersTable orders={analytics.allOrders} />
        </div>
    );
}
