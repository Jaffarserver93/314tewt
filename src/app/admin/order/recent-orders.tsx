
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Order } from '@/lib/database';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => {
            setMatches(media.matches);
        };
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);

    return matches;
};

interface RecentOrdersTableProps {
  orders: Order[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const ordersPerPage = isDesktop ? 10 : 5;

  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    return orders.slice(startIndex, endIndex);
  }, [orders, currentPage, ordersPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if(currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
    }
  }, [totalPages, currentPage]);
  
  if(orders.length === 0) return null;

  return (
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>A list of all orders placed.</CardDescription>
        </div>
        <Button size="sm" variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length > 0 ? paginatedOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">{order.customer_info.firstName} {order.customer_info.lastName}</div>
                    <div className="text-sm text-muted-foreground hidden md:inline">{order.customer_info.email}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell capitalize">{order.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("capitalize", statusColors[order.status])}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{format(new Date(order.created_at), 'yyyy-MM-dd')}</TableCell>
                  <TableCell className="text-right">{order.price}</TableCell>
                </TableRow>
              )) : (
                 <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        No orders found.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
            <div className="flex items-center justify-center sm:justify-end gap-4 mt-6">
                <Button onClick={handlePrevPage} disabled={currentPage === 1} variant="outline">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </Button>
                <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </span>
                <Button onClick={handleNextPage} disabled={currentPage === totalPages} variant="outline">
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
