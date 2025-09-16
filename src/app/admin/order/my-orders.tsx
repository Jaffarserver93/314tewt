
"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import type { Order } from '@/lib/database';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { confirmOrderAction, cancelOrderAction, deleteOrderAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface OrdersTableProps {
  orders: Order[];
  title: string;
  description: string;
}

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

export function OrdersTable({ orders: initialOrders, title, description }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const ordersPerPage = isDesktop ? 10 : 5;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);


  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;

    return orders.filter(order => {
      const lowercasedTerm = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(lowercasedTerm) ||
        (order.customer_info.email && order.customer_info.email.toLowerCase().includes(lowercasedTerm)) ||
        (order.customer_info.discordUsername && order.customer_info.discordUsername.toLowerCase().includes(lowercasedTerm))
      );
    });
  }, [orders, searchTerm]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ordersPerPage;
    return filteredOrders.slice(startIndex, startIndex + ordersPerPage);
  }, [filteredOrders, currentPage, ordersPerPage]);
  
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);
  
  useEffect(() => {
    if(currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

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


  const handleConfirm = async (orderId: string) => {
    const result = await confirmOrderAction(orderId);
    if (result.success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'confirmed' } : o));
      toast({ title: "Success", description: result.message });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const handleCancel = async (orderId: string) => {
    const result = await cancelOrderAction(orderId);
    if (result.success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
      toast({ title: "Success", description: result.message });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const openDeleteDialog = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;
    const result = await deleteOrderAction(orderToDelete);
    if (result.success) {
      setOrders(orders.filter(o => o.id !== orderToDelete));
      toast({ title: "Success", description: result.message });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setIsDeleteDialogOpen(false);
    setOrderToDelete(null);
  };
  
  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    confirmed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  
  if(initialOrders.length === 0) return null;

  return (
    <>
      <Card className="glassmorphism">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                      type="text"
                      placeholder="Search by Order ID, email, or Discord..."
                      className="pl-10 w-full"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                  />
              </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{order.customer_info.firstName} {order.customer_info.lastName}</div>
                      <div className="text-sm text-muted-foreground">{order.customer_info.email}</div>
                      <div className="text-sm text-muted-foreground font-mono">@{order.customer_info.discordUsername}</div>
                    </TableCell>
                    <TableCell>{order.customer_info.serverPurpose || 'N/A'}</TableCell>
                    <TableCell>{order.plan_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("capitalize", statusColors[order.status])}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {order.status === 'pending' && (
                            <>
                              <DropdownMenuItem onClick={() => handleConfirm(order.id)}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                <span>Confirm Order</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCancel(order.id)}>
                                <XCircle className="mr-2 h-4 w-4 text-yellow-500" />
                                <span>Cancel Order</span>
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openDeleteDialog(order.id)} className="text-destructive focus:bg-destructive/20 focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedOrders.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
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
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOrderToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
