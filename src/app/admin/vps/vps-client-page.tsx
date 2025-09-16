
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Edit, Trash2, Cpu as CpuIcon, Award } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { addPlanAction, updatePlanAction, deletePlanAction } from './actions';
import type { VpsPlan } from '@/lib/types';
import { cn } from '@/lib/utils';

const planSchema = z.object({
  name: z.string().min(1, "Plan name is required."),
  price: z.preprocess((a) => (a === '' || a === undefined ? undefined : parseInt(String(a), 10)), z.number({invalid_type_error: "Price must be a number"}).positive("Price must be a positive number.")),
  vcpu: z.string().min(1, "vCPU is required."),
  ram: z.string().min(1, "RAM is required."),
  storage: z.string().min(1, "Storage is required."),
  bandwidth: z.string().min(1, "Bandwidth is required."),
  is_popular: z.boolean().default(false),
  country: z.enum(['India', 'Germany']),
  cpu: z.enum(['Intel Xeon', 'AMD Ryzen 7 7700']),
  category: z.enum(['standard', 'performance', 'enterprise']),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface VpsClientPageProps {
  initialPlans: VpsPlan[];
}

export default function VpsClientPage({ initialPlans }: VpsClientPageProps) {
  const [plans, setPlans] = useState(initialPlans);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<VpsPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<VpsPlan | null>(null);
  const { toast } = useToast();

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      price: undefined,
      vcpu: '',
      ram: '',
      storage: '',
      bandwidth: '',
      is_popular: false,
      country: 'India',
      cpu: 'Intel Xeon',
      category: 'standard'
    },
  });

  const handleOpenForm = (plan: VpsPlan | null = null) => {
    setSelectedPlan(plan);
    if (plan) {
      form.reset(plan);
    } else {
      form.reset({
        name: '',
        price: undefined,
        vcpu: '',
        ram: '',
        storage: '',
        bandwidth: '',
        is_popular: false,
        country: 'India',
        cpu: 'Intel Xeon',
        category: 'standard'
      });
    }
    setIsFormOpen(true);
  };
  
  const handleOpenDeleteConfirm = (plan: VpsPlan) => {
    setPlanToDelete(plan);
    setIsDeleteConfirmOpen(true);
  };

  const onSubmit = async (values: PlanFormValues) => {
    setIsSaving(true);
    try {
        const action = selectedPlan ? updatePlanAction : addPlanAction;
        const payload = selectedPlan ? { id: selectedPlan.id, ...values } : values;
        const result = await action(payload as any);

        if (result.success) {
            setPlans(result.plans || []);
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
    if (!planToDelete) return;
    setIsSaving(true);
    const result = await deletePlanAction({ id: planToDelete.id });
    if (result.success) {
      setPlans(result.plans || []);
      toast({ title: "Success", description: result.message });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setIsSaving(false);
    setIsDeleteConfirmOpen(false);
  };

  const categoryColors: { [key: string]: string } = {
    standard: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    performance: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    enterprise: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">VPS Hosting Plans</h1>
          <p className="text-muted-foreground">Manage your VPS hosting packages.</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Plan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All VPS Plans</CardTitle>
          <CardDescription>A list of all available VPS hosting plans.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>vCPU</TableHead>
                <TableHead>RAM</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>Popular</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                   <TableCell><Badge variant="outline" className={cn("capitalize", categoryColors[plan.category])}>{plan.category}</Badge></TableCell>
                  <TableCell>₹{plan.price}/mo</TableCell>
                  <TableCell>{plan.vcpu}</TableCell>
                  <TableCell>{plan.ram}</TableCell>
                  <TableCell>{plan.storage}</TableCell>
                  <TableCell>{plan.country}</TableCell>
                   <TableCell>{plan.cpu}</TableCell>
                  <TableCell>
                    {plan.is_popular && <Badge className="bg-primary text-primary-foreground gap-1"><Award className="w-3 h-3"/> Popular</Badge>}
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenForm(plan)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/20 focus:text-destructive" onClick={() => handleOpenDeleteConfirm(plan)}>
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPlan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
            <DialogDescription>
              {selectedPlan ? 'Update the details for this plan.' : 'Fill out the form to create a new hosting plan.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Plan Name</FormLabel><FormControl><Input placeholder="VPS Basic" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price (₹/mo)</FormLabel><FormControl><Input type="number" placeholder="270" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="vcpu" render={({ field }) => (<FormItem><FormLabel>vCPU</FormLabel><FormControl><Input placeholder="1 vCPU" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="ram" render={({ field }) => (<FormItem><FormLabel>RAM</FormLabel><FormControl><Input placeholder="2GB" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="storage" render={({ field }) => (<FormItem><FormLabel>Storage</FormLabel><FormControl><Input placeholder="40GB NVMe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="bandwidth" render={({ field }) => (<FormItem><FormLabel>Bandwidth</FormLabel><FormControl><Input placeholder="1TB" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="country" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="India">🇮🇳 India</SelectItem>
                        <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="cpu" render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPU/GPU</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a CPU/GPU" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Intel Xeon">
                            <div className="flex items-center gap-2">
                                <CpuIcon className="w-4 h-4" /> Intel Xeon
                            </div>
                        </SelectItem>
                        <SelectItem value="AMD Ryzen 7 7700">
                            <div className="flex items-center gap-2">
                                <CpuIcon className="w-4 h-4" /> AMD Ryzen 7 7700
                            </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="is_popular" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5"><FormLabel>Mark as Popular</FormLabel></div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <DialogFooter className="pt-4 sticky bottom-0 bg-background py-4">
                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Plan'}
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
              This action cannot be undone. This will permanently delete the plan &quot;{planToDelete?.name}&quot;.
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
