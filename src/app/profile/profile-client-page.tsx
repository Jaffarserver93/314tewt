
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Shield, User, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import type { Order } from '@/lib/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { Session } from 'next-auth';

function OrderHistoryTable({ orders }: { orders: Order[] }) {
  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <Card className="glassmorphism mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Order History
        </CardTitle>
        <CardDescription>A list of all your recent orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? orders.map(order => (
                <TableRow key={order.id}>
                   <TableCell className="font-mono">{order.id}</TableCell>
                   <TableCell>
                      <div className="font-medium">{order.planName}</div>
                      <div className="text-sm text-muted-foreground capitalize">{order.type}</div>
                   </TableCell>
                   <TableCell>
                    <Badge variant="outline" className={cn("capitalize", statusColors[order.status])}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{format(new Date(order.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right font-medium">{order.price}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        You haven't placed any orders yet.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProfileClientPageProps {
    user: Session['user'] & { role: string; status: string; createdAt: string; id: string; };
    orders: Order[];
}

export default function ProfileClientPage({ user, orders }: ProfileClientPageProps) {
    const [joinDate, setJoinDate] = useState('N/A');

    useEffect(() => {
        if (user?.createdAt) {
            setJoinDate(format(new Date(user.createdAt), 'MMMM d, yyyy'));
        }
    }, [user?.createdAt]);

    if (!user) return null;
    
    const roleBadgeColors: { [key: string]: string } = {
        user: "bg-primary/80 text-primary-foreground border-primary",
        staff: "bg-blue-500/80 text-white border-blue-500",
        manager: "bg-yellow-500/80 text-white border-yellow-500",
        admin: "bg-orange-500/80 text-white border-orange-500",
        "super admin": "bg-pink-500/80 text-white border-pink-500",
    };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <Card className="glassmorphism relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-primary/0"></div>
          <div className="relative p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-lg">
                <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
                <AvatarFallback className="text-4xl">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold break-words">{user.name}</h1>
                <p className="text-muted-foreground font-mono text-sm">{user.email}</p>
                <div className="flex items-center flex-wrap gap-2 mt-3">
                  <Badge className={cn(roleBadgeColors[user.role] || roleBadgeColors.user, "capitalize text-sm py-1 px-3")}>{user.role}</Badge>
                  <Badge variant={user.status === 'active' ? 'default' : 'destructive'} className={cn(user.status === 'active' ? 'bg-green-500/80' : 'bg-red-500/80', "capitalize text-sm py-1 px-3")}>
                    {user.status}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                {user.role !== 'user' && (
                    <Link href="/admin/dashboard" className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                        <Shield className="mr-2 h-4 w-4" /> Admin Panel
                    </Button>
                    </Link>
                )}
              </div>
            </div>
            <div className="border-t border-border/20 mt-6 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                    <User className="w-5 h-5 mr-3 text-primary/80" />
                    <span>User ID: <span className="font-mono">{user.id}</span></span>
                </div>
                {user.createdAt && (
                    <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-5 h-5 mr-3 text-primary/80" />
                        <span>Joined on {joinDate}</span>
                    </div>
                )}
            </div>
          </div>
        </Card>
        
        <OrderHistoryTable orders={orders} />

      </div>
    </div>
  );
}
