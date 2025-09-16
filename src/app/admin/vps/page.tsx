
import { supabase } from '@/lib/supabase';
import type { VpsPlan } from '@/lib/types';
import VpsClientPage from './vps-client-page';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

async function getVpsPlans(): Promise<VpsPlan[]> {
    const { data, error } = await supabase
        .from('vps_plans')
        .select('*')
        .order('price');
        
    if (error) {
        console.error("Failed to read VPS plans data from Supabase:", error);
        return [];
    }

    return (data || []) as VpsPlan[];
}

export default async function VpsAdminPage() {
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
    
    const plans = await getVpsPlans();

    return <VpsClientPage initialPlans={plans} />;
}
