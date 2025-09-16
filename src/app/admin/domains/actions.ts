
'use server';

import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import type { TLD } from '@/lib/types';

const tldSchema = z.object({
  name: z.string().startsWith('.', { message: 'TLD must start with a dot.' }).min(2),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional().nullable(),
  featured: z.boolean(),
  trending: z.boolean(),
  discount: z.boolean(),
  premium: z.boolean(),
  discountPercentage: z.number().min(1).max(100).optional().nullable(),
});

const tldUpdateSchema = tldSchema.extend({
  id: z.number(),
});

const tldDeleteSchema = z.object({
  id: z.number(),
});

async function getAllTlds(): Promise<TLD[]> {
    const { data, error } = await supabase
        .from('tlds')
        .select('id, name, price, original_price, featured, trending, discount, premium, discount_percentage')
        .order('name');
        
    if (error) {
        console.error("Failed to read TLDs data from Supabase:", error);
        throw new Error("Failed to fetch TLDs.");
    }
    
    return data.map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
        featured: item.featured,
        trending: item.trending,
        discount: item.discount,
        premium: item.premium,
        discountPercentage: item.discount_percentage ? Number(item.discount_percentage) : undefined,
    })) || [];
}

export async function addTldAction(values: z.infer<typeof tldSchema>) {
  try {
    const parsedValues = tldSchema.parse(values);
    const { error } = await supabase.from('tlds').insert({ 
        name: parsedValues.name,
        price: parsedValues.price,
        original_price: parsedValues.originalPrice,
        featured: parsedValues.featured,
        trending: parsedValues.trending,
        discount: parsedValues.discount,
        premium: parsedValues.premium,
        discount_percentage: parsedValues.discountPercentage
    });
    if (error) throw error;
    
    revalidatePath('/admin/domains');
    const tlds = await getAllTlds();
    return { success: true, message: 'TLD added successfully.', tlds };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to add TLD." };
  }
}

export async function updateTldAction(values: z.infer<typeof tldUpdateSchema>) {
    try {
        const parsedValues = tldUpdateSchema.parse(values);
        const { error } = await supabase
            .from('tlds')
            .update({
                price: parsedValues.price,
                original_price: parsedValues.originalPrice,
                featured: parsedValues.featured,
                trending: parsedValues.trending,
                discount: parsedValues.discount,
                premium: parsedValues.premium,
                discount_percentage: parsedValues.discountPercentage,
            })
            .eq('id', parsedValues.id);

        if (error) throw error;

        revalidatePath('/admin/domains');
        const tlds = await getAllTlds();
        return { success: true, message: 'TLD updated successfully.', tlds };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update TLD." };
    }
}


export async function deleteTldAction(values: z.infer<typeof tldDeleteSchema>) {
    try {
        const parsedValues = tldDeleteSchema.parse(values);
        const { error } = await supabase.from('tlds').delete().eq('id', parsedValues.id);
        if (error) throw error;

        revalidatePath('/admin/domains');
        const tlds = await getAllTlds();
        return { success: true, message: 'TLD deleted successfully.', tlds };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to delete TLD." };
    }
}
