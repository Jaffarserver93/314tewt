
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Eye, Trash2, TicketPercent, Tag, Users, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createCouponAction } from './actions';
import { CouponWithRedemptions } from './types';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters.").max(20).transform(val => val.toUpperCase()),
  discount_percentage: z.preprocess(
    (a) => (a === '' || a === undefined ? undefined : parseInt(String(a), 10)),
    z.number({ required_error: 'Discount is required.'}).min(1, "Discount must be at least 1%").max(100, "Discount cannot exceed 100%")
  ),
  max_uses: z.preprocess(
    (a) => (a === '' || a === undefined ? undefined : parseInt(String(a), 10)),
    z.number({ required_error: 'Max uses is required.'}).min(1, "Must be at least 1 use.")
  ),
});

type CouponFormValues = z.infer<typeof couponSchema>;

interface CouponsClientPageProps {
  initialCoupons: CouponWithRedemptions[];
}

export default function CouponsClientPage({ initialCoupons }: CouponsClientPageProps) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewingRedemptions, setIsViewingRedemptions] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponWithRedemptions | null>(null);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
        code: '',
        discount_percentage: undefined,
        max_uses: undefined,
    }
  });

  const handleOpenForm = () => {
    form.reset({
        code: '',
        discount_percentage: undefined,
        max_uses: undefined,
    });
    setIsFormOpen(true);
  };
  
  const handleViewRedemptions = (coupon: CouponWithRedemptions) => {
    setSelectedCoupon(coupon);
    setIsViewingRedemptions(true);
  };

  const onSubmit = async (values: CouponFormValues) => {
    setIsSaving(true);
    const result = await createCouponAction(values);
    if (result.success && result.coupons) {
      setCoupons(result.coupons);
      toast({ title: "Success", description: result.message });
      setIsFormOpen(false);
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setIsSaving(false);
  };
  
  const generateRandomCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    form.setValue('code', randomCode);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Coupon Management</h1>
          <p className="text-muted-foreground">Create and manage discount coupons.</p>
        </div>
        <Button onClick={handleOpenForm}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Coupon
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
          <CardDescription>A list of all available coupons.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium font-mono">{coupon.code}</TableCell>
                  <TableCell>{coupon.discount_percentage}%</TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <span>{coupon.usage_count} / {coupon.max_uses}</span>
                        <Progress value={(coupon.usage_count / coupon.max_uses) * 100} className="w-24 h-2" />
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(coupon.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewRedemptions(coupon)} disabled={coupon.redemptions.length === 0}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Redemptions</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/20 focus:text-destructive" disabled>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete (soon)</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {coupons.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">No coupons found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Create Coupon Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Coupon</DialogTitle>
            <DialogDescription>
              Fill out the form to create a new discount coupon.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="code" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Coupon Code</FormLabel>
                      <div className="flex gap-2">
                          <FormControl><Input placeholder="SAVE20" {...field} style={{textTransform: 'uppercase'}} /></FormControl>
                          <Button type="button" variant="outline" onClick={generateRandomCode}>Generate</Button>
                      </div>
                      <FormMessage />
                  </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="discount_percentage" render={({ field }) => (<FormItem><FormLabel>Discount (%)</FormLabel><FormControl><Input type="number" placeholder="20" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="max_uses" render={({ field }) => (<FormItem><FormLabel>Max Uses</FormLabel><FormControl><Input type="number" placeholder="100" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <DialogFooter className="pt-4">
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Creating...' : 'Create Coupon'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Redemptions Dialog */}
       <Dialog open={isViewingRedemptions} onOpenChange={setIsViewingRedemptions}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Redemptions for <span className="font-mono text-primary">{selectedCoupon?.code}</span></DialogTitle>
            <DialogDescription>
              Users who have successfully redeemed this coupon.
            </DialogDescription>
          </DialogHeader>
           <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedCoupon?.redemptions.map(redemption => (
                                <TableRow key={redemption.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={redemption.users.avatar_url} alt={redemption.users.username} />
                                                <AvatarFallback>{redemption.users.username.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{redemption.users.username}</span>
                                                <span className="text-xs text-muted-foreground">{redemption.users.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(redemption.created_at), 'MMM d, yyyy, h:mm a')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
           </Card>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewingRedemptions(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
