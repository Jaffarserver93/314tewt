
import { supabase } from '@/lib/supabase';
import type { MinecraftPlan } from '@/lib/types';
import HostingClientPage from './hosting-client-page';

async function getMinecraftPlans(): Promise<MinecraftPlan[]> {
  const { data, error } = await supabase
    .from('minecraft_plans')
    .select('*')
    .order('price');

  if (error) {
    console.error('Failed to fetch minecraft plans:', error);
    return [];
  }
  return data;
}

export default async function MinecraftHostingPage() {
  const plans = await getMinecraftPlans();

  return <HostingClientPage plans={plans} />;
}
