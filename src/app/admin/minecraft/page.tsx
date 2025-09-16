
import { supabase } from '@/lib/supabase';
import type { MinecraftPlan } from '@/lib/types';
import MinecraftClientPage from './minecraft-client-page';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

async function getMinecraftPlans(): Promise<MinecraftPlan[]> {
    const { data, error } = await supabase
        .from('minecraft_plans')
        .select('*')
        .order('price');
        
    if (error) {
        console.error("Failed to read Minecraft plans data from Supabase:", error);
        return [];
    }

    return data || [];
}

export default async function MinecraftAdminPage() {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role;
    
    if (!userRole || !['super admin', 'admin', 'manager'].includes(userRole)) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
            </div>
        );
    }
    
    const plans = await getMinecraftPlans();

    return <MinecraftClientPage initialPlans={plans} />;
}
