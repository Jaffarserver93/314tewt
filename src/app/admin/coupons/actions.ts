
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { CouponWithRedemptions, Coupon } from './types';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase';

const couponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discount_percentage: z.number().min(1).max(100),
  max_uses: z.number().min(1),
});

export async function getCoupons(): Promise<CouponWithRedemptions[]> {
    const supabaseAdmin = await createSupabaseServerClient(true);
    const { data, error } = await supabaseAdmin
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
    const supabaseAdmin = await createSupabaseServerClient(true);
    const parsedValues = couponSchema.parse(values);
    
    const { data: existingCoupon, error: existingError } = await supabaseAdmin
        .from('coupons')
        .select('code')
        .eq('code', parsedValues.code)
        .single();
        
    if (existingCoupon) {
        return { success: false, message: 'A coupon with this code already exists.' };
    }
    if (existingError && existingError.code !== 'PGRST116') {
        throw existingError;
    }

    const { error } = await supabaseAdmin.from('coupons').insert({ 
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

export async function validateCouponAction(code: string, userId: string): Promise<{ success: boolean; message: string; coupon?: Coupon }> {
    try {
        const { data: coupon, error: couponError } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', code.toUpperCase())
            .single();

        if (couponError || !coupon) {
            return { success: false, message: 'Invalid coupon code.' };
        }

        if (!coupon.is_active) {
            return { success: false, message: 'This coupon is no longer active.' };
        }

        if (coupon.usage_count >= coupon.max_uses) {
            return { success: false, message: 'This coupon has reached its usage limit.' };
        }

        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
            return { success: false, message: 'This coupon has expired.' };
        }
        
        const { data: redemption, error: redemptionError } = await supabase
            .from('coupon_redemptions')
            .select('id')
            .eq('coupon_id', coupon.id)
            .eq('user_id', userId)
            .single();

        if (redemption) {
            return { success: false, message: 'You have already redeemed this coupon.' };
        }
         if (redemptionError && redemptionError.code !== 'PGRST116') {
            throw redemptionError;
        }

        return { success: true, message: 'Coupon applied successfully!', coupon };

    } catch (error: any) {
        console.error("Error validating coupon:", error);
        return { success: false, message: error.message || "An unexpected error occurred." };
    }
}

export async function redeemCoupon(couponId: string, userId: string) {
    const supabaseAdmin = await createSupabaseServerClient(true);
    
    const { error: redemptionError } = await supabaseAdmin
        .from('coupon_redemptions')
        .insert({ coupon_id: couponId, user_id: userId });

    if (redemptionError) {
        console.error(`Failed to redeem coupon ${couponId} for user ${userId}:`, redemptionError);
        // Don't throw, just log. The order is more important.
    } else {
        // This is a stored procedure that increments the usage_count
        const { error: rpcError } = await supabaseAdmin.rpc('increment_coupon_usage', {
            coupon_id_arg: couponId
        });
        if (rpcError) {
            console.error(`Failed to increment usage for coupon ${couponId}:`, rpcError);
        }
    }
}
