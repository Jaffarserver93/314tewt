
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Tag, Star, TrendingUp, Flame } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { addTldAction, updateTldAction, deleteTldAction } from './actions';
import type { TLD } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const tldSchema = z.object({
  name: z.string().startsWith('.', { message: 'TLD must start with a dot.' }).min(2, "TLD name is required."),
  price: z.preprocess(
    (a) => (a === '' || a === undefined ? undefined : parseInt(String(a), 10)),
    z.number({ required_error: 'Price is required.', invalid_type_error: 'Price must be a number' }).positive("Price must be a positive number.")
  ),
  originalPrice: z.preprocess(
    (a) => (a === '' || a === undefined ? null : parseInt(String(a), 10)),
    z.number().positive("Original price must be a positive number.").optional().nullable()
  ),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  discount: z.boolean().default(false),
  premium: z.boolean().default(false),
});

type TldFormValues = z.infer<typeof tldSchema>;

interface DomainsClientPageProps {
  initialTlds: TLD[];
}

export default function DomainsClientPage({ initialTlds }: DomainsClientPageProps) {
  const [tlds, setTlds] = useState(initialTlds);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTld, setSelectedTld] = useState<TLD | null>(null);
  const [tldToDelete, setTldToDelete] = useState<TLD | null>(null);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<TldFormValues>({
    resolver: zodResolver(tldSchema),
    defaultValues: {
        name: '',
        price: undefined,
        originalPrice: undefined,
        featured: false,
        trending: false,
        discount: false,
        premium: false,
    }
  });

  const { watch, setValue } = form;
  const watchDiscount = watch('discount');
  const watchFeatured = watch('featured');
  const watchTrending = watch('trending');
  const watchPremium = watch('premium');

  useEffect(() => {
    if (watchDiscount) {
      setValue('featured', false);
      setValue('trending', false);
      setValue('premium', false);
    }
  }, [watchDiscount, setValue]);

  useEffect(() => {
    if (watchFeatured) {
      setValue('discount', false);
      setValue('trending', false);
      setValue('premium', false);
    }
  }, [watchFeatured, setValue]);

  useEffect(() => {
    if (watchTrending) {
      setValue('discount', false);
      setValue('featured', false);
      setValue('premium', false);
    }
  }, [watchTrending, setValue]);

  useEffect(() => {
    if (watchPremium) {
      setValue('discount', false);
      setValue('featured', false);
      setValue('trending', false);
    }
  }, [watchPremium, setValue]);


  const handleOpenForm = (tld: TLD | null = null) => {
    setSelectedTld(tld);
    if (tld) {
      form.reset({
        ...tld,
        price: tld.price,
        originalPrice: tld.originalPrice,
      });
    } else {
      form.reset({
        name: '',
        price: undefined,
        originalPrice: undefined,
        featured: false,
        trending: false,
        discount: false,
        premium: false,
      });
    }
    setIsFormOpen(true);
  };

  const handleOpenDeleteConfirm = (tld: TLD) => {
    setTldToDelete(tld);
    setIsDeleteConfirmOpen(true);
  };

  const onSubmit = async (values: TldFormValues) => {
    setIsSaving(true);
    try {
        const action = selectedTld ? updateTldAction : addTldAction;
        const payload = selectedTld ? { id: selectedTld.id, ...values } : values;
        const result = await action(payload as any);

        if (result.success) {
            setTlds(result.tlds || []);
            toast({ title: "Success", description: result.message });
            setIsFormOpen(false);
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
    } finally {
        setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!tldToDelete) return;
    setIsSaving(true);
    const result = await deleteTldAction({id: tldToDelete.id});
    if (result.success) {
      setTlds(result.tlds || []);
      toast({ title: "Success", description: result.message });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setIsSaving(false);
    setIsDeleteConfirmOpen(false);
  };

  const getTag = (tld: TLD) => {
    if (tld.featured) return <Badge className="bg-yellow-400 text-black gap-1"><Star className="w-3 h-3"/> Popular</Badge>;
    if (tld.trending) return <Badge className="bg-green-500 text-white gap-1"><TrendingUp className="w-3 h-3"/> Trending</Badge>;
    if (tld.discount) return <Badge className="bg-red-500 text-white gap-1"><Tag className="w-3 h-3"/> Discount</Badge>;
    if (tld.premium) return <Badge className="bg-purple-500 text-white gap-1"><Flame className="w-3 h-3"/> Premium</Badge>;
    return <Badge variant="outline">Standard</Badge>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Domain TLD Management</h1>
          <p className="text-muted-foreground">Manage your domain extensions and pricing.</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New TLD
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All TLDs</CardTitle>
          <CardDescription>A list of all available top-level domains.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Extension</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Original Price</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tlds.map((tld) => (
                <TableRow key={tld.id}>
                  <TableCell className="font-medium font-mono">{tld.name}</TableCell>
                  <TableCell>₹{tld.price}/year</TableCell>
                  <TableCell>{tld.originalPrice ? `₹${tld.originalPrice}/year` : '-'}</TableCell>
                  <TableCell>{getTag(tld)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenForm(tld)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/20 focus:text-destructive" onClick={() => handleOpenDeleteConfirm(tld)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTld ? 'Edit TLD' : 'Add New TLD'}</DialogTitle>
            <DialogDescription>
              {selectedTld ? 'Update the details for this TLD.' : 'Fill out the form to create a new TLD.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>TLD Name</FormLabel><FormControl><Input placeholder=".com" {...field} readOnly={!!selectedTld} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price (₹/year)</FormLabel><FormControl><Input type="number" placeholder="999" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value)} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              
              <div className="space-y-4 rounded-md border p-4">
                  <FormField control={form.control} name="discount" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between"><div className="space-y-0.5"><FormLabel>Discount</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                  {watchDiscount && (
                    <FormField control={form.control} name="originalPrice" render={({ field }) => (<FormItem><FormLabel>Original Price (₹/year)</FormLabel><FormControl><Input type="number" placeholder="1299" {...field} value={field.value ?? ''} onChange={e => field.onChange(e.target.value)} /></FormControl><FormMessage /></FormItem>)} />
                  )}
                  <FormField control={form.control} name="featured" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between"><div className="space-y-0.5"><FormLabel>Featured</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                  <FormField control={form.control} name="trending" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between"><div className="space-y-0.5"><FormLabel>Trending</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
                  <FormField control={form.control} name="premium" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between"><div className="space-y-0.5"><FormLabel>Premium</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
              </div>

              <DialogFooter className="pt-4">
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save TLD'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the TLD &quot;{tldToDelete?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90" disabled={isSaving}>
              {isSaving ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    