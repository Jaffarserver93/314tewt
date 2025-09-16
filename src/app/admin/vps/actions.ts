
'use server';

import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import type { VpsPlan } from '@/lib/types';

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

const planUpdateSchema = planSchema.extend({
  id: z.number(),
});

const planDeleteSchema = z.object({
  id: z.number(),
});

async function getAllPlans(): Promise<VpsPlan[]> {
    const { data, error } = await supabase
        .from('vps_plans')
        .select('*')
        .order('price');
        
    if (error) {
        console.error("Failed to read VPS plans from Supabase:", error);
        throw new Error("Failed to fetch plans.");
    }
    
    return data || [];
}

export async function addPlanAction(values: z.infer<typeof planSchema>) {
  try {
    const parsedValues = planSchema.parse(values);
    const { error } = await supabase.from('vps_plans').insert(parsedValues);
    if (error) throw error;
    
    revalidatePath('/admin/vps');
    const plans = await getAllPlans();
    return { success: true, message: 'Plan added successfully.', plans };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to add plan." };
  }
}

export async function updatePlanAction(values: z.infer<typeof planUpdateSchema>) {
    try {
        const { id, ...updateData } = planUpdateSchema.parse(values);
        const { error } = await supabase
            .from('vps_plans')
            .update(updateData)
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/admin/vps');
        const plans = await getAllPlans();
        return { success: true, message: 'Plan updated successfully.', plans };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update plan." };
    }
}


export async function deletePlanAction(values: z.infer<typeof planDeleteSchema>) {
    try {
        const parsedValues = planDeleteSchema.parse(values);
        const { error } = await supabase.from('vps_plans').delete().eq('id', parsedValues.id);
        if (error) throw error;

        revalidatePath('/admin/vps');
        const plans = await getAllPlans();
        return { success: true, message: 'Plan deleted successfully.', plans };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to delete plan." };
    }
}
