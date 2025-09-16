
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/lib/database';
import ProfileClientPage from './profile-client-page';
import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';

async function getOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  
  // Map Supabase data to Order type
  return data.map((order: any) => ({
      id: order.id,
      plan_name: order.plan_name,
      planName: order.plan_name,
      type: order.type,
      status: order.status,
      created_at: order.created_at,
      createdAt: order.created_at,
      price: order.price,
      userId: order.user_id,
      customer_info: order.customer_info,
      customerInfo: order.customer_info,
  }));
}

async function getUser(userId: string) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return null;
    }
    return data;
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect('/');
  }

  const userWithDetails = await getUser((session.user as any).id);

  if (!userWithDetails) {
     redirect('/');
  }

  const orders = await getOrders((session.user as any).id);

  // We need to construct a user object that matches what the client page expects.
  const profileUser: Session['user'] & { role: string; status: string; createdAt: string; id: string; } = {
      id: userWithDetails.id,
      name: userWithDetails.username,
      email: userWithDetails.email,
      image: userWithDetails.avatar_url,
      role: userWithDetails.role,
      status: userWithDetails.status,
      createdAt: userWithDetails.created_at,
  }

  return <ProfileClientPage user={profileUser} orders={orders} />;
}
