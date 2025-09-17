
'use server';

import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import type { AppUser } from '@/types/next-auth';
import type { Order } from '@/lib/database';
import { redeemCoupon } from '@/app/admin/coupons/actions';


const addUserFormSchema = z.object({
  discordUsername: z.string().min(2, "Username must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  role: z.enum(['user', 'staff', 'manager', 'admin', 'super admin']),
});

function toAppUser(dbUser: any): AppUser {
    return {
        id: dbUser.id,
        discordUsername: dbUser.username,
        email: dbUser.email,
        image: dbUser.avatar_url,
        role: dbUser.role,
        status: dbUser.status,
        createdAt: dbUser.created_at,
    };
}


export async function addUserAction(values: z.infer<typeof addUserFormSchema>) {
  try {
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        // A real implementation would generate a real Discord ID or use a different auth method
        id: `demo-${Math.random().toString(36).substring(2, 9)}`, 
        username: values.discordUsername,
        email: values.email,
        role: values.role,
        status: 'active',
        avatar_url: `https://i.pravatar.cc/150?u=${values.email}`,
      })
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/admin/users');
    return { success: true, message: 'User added successfully.', user: toAppUser(newUser) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}


export async function toggleUserStatusAction(userId: string) {
  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('status')
      .eq('id', userId)
      .single();

    if (fetchError || !user) throw new Error("User not found.");

    const newStatus = user.status === 'active' ? 'banned' : 'active';
    const { error: updateError } = await supabase
      .from('users')
      .update({ status: newStatus })
      .eq('id', userId);

    if (updateError) throw updateError;
    
    revalidatePath('/admin/users');
    return { success: true, message: `User status updated to ${newStatus}.` };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    
    revalidatePath('/admin/users');
    return { success: true, message: 'User deleted successfully.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}


export async function updateUserRoleAction(userId: string, role: AppUser['role']) {
  try {
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath('/admin/users');
    return { success: true, message: 'User role updated.', user: toAppUser(updatedUser) };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

const createOrderSchema = z.object({
    userId: z.string(),
    planName: z.string(),
    type: z.enum(['hosting', 'vps', 'domain']),
    status: z.enum(['pending', 'confirmed', 'cancelled']),
    price: z.string(),
    customerInfo: z.record(z.any()),
    couponId: z.string().optional(),
});

export async function createOrderAction(values: z.infer<typeof createOrderSchema>) {
    try {
        let prefix = 'ord';
        if (values.type === 'hosting') {
          prefix = 'mc';
        } else if (values.type === 'vps') {
          prefix = 'vps';
        } else if (values.type === 'domain') {
          prefix = 'dom';
        }
        const orderId = `${prefix}-${Math.random().toString(36).substring(2, 10)}`;

        const { data: newOrder, error } = await supabase
            .from('orders')
            .insert({
                id: orderId,
                user_id: values.userId,
                plan_name: values.planName,
                type: values.type,
                status: values.status,
                price: values.price,
                customer_info: values.customerInfo,
            })
            .select()
            .single();

        if (error) throw error;

        if (values.couponId) {
            await redeemCoupon(values.couponId, values.userId);
        }
        
        return { success: true, message: 'Order created successfully.', order: newOrder as Order };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to create order." };
    }
}


export async function confirmOrderAction(orderId: string) {
    try {
        const { error } = await supabase
            .from('orders')
            .update({ status: 'confirmed' })
            .eq('id', orderId);
        if (error) throw error;
        revalidatePath('/admin/order');
        return { success: true, message: 'Order confirmed successfully.' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to confirm order.' };
    }
}

export async function cancelOrderAction(orderId: string) {
    try {
        const { error } = await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', orderId);
        if (error) throw error;
        revalidatePath('/admin/order');
        return { success: true, message: 'Order cancelled successfully.' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to cancel order.' };
    }
}

export async function deleteOrderAction(orderId: string) {
    try {
        const { error } = await supabase.from('orders').delete().eq('id', orderId);
        if (error) throw error;
        revalidatePath('/admin/order');
        return { success: true, message: 'Order deleted successfully.' };
    } catch (error: any) {
        return { success: false, message: error.message || 'Failed to delete order.' };
    }
}
