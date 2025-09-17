
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { CouponWithRedemptions } from './types';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const couponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discount_percentage: z.number().min(1).max(100),
  max_uses: z.number().min(1),
});

export async function getCoupons(): Promise<CouponWithRedemptions[]> {
    const supabase = await createSupabaseServerClient(true);
    const { data, error } = await supabase
        .from('coupons')
        .select(`
            *,
            redemptions:coupon_redemptions (
                id,
                created_at,
                users (
                    id,
                    username,
                    email,
                    avatar_url
                )
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Failed to fetch coupons:", error);
        throw new Error("Failed to fetch coupons.");
    }
    
    return data as CouponWithRedemptions[];
}


export async function createCouponAction(values: z.infer<typeof couponSchema>) {
  try {
    const supabase = await createSupabaseServerClient(true);
    const parsedValues = couponSchema.parse(values);
    
    // Check if coupon code already exists
    const { data: existingCoupon, error: existingError } = await supabase
        .from('coupons')
        .select('code')
        .eq('code', parsedValues.code)
        .single();
        
    if (existingCoupon) {
        return { success: false, message: 'A coupon with this code already exists.' };
    }
    if (existingError && existingError.code !== 'PGRST116') { // PGRST116 is "No rows found"
        throw existingError;
    }

    const { error } = await supabase.from('coupons').insert({ 
        ...parsedValues,
        code: parsedValues.code.toUpperCase(),
        usage_count: 0,
        is_active: true,
    });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || "An unknown error occurred with Supabase.");
    }
    
    revalidatePath('/admin/coupons');
    const coupons = await getCoupons();
    return { success: true, message: 'Coupon created successfully.', coupons };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
        return { success: false, message: error.errors.map(e => e.message).join(', ') };
    }
    console.error("Caught exception in createCouponAction:", error);
    return { success: false, message: error.message || "Failed to create coupon." };
  }
}
