
import { supabase } from '@/lib/supabase';
import type { TLD } from '@/lib/types';
import DomainsClientPage from './domains-client-page';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

async function getTlds(): Promise<TLD[]> {
    const { data, error } = await supabase
        .from('tlds')
        .select('id, name, price, original_price, featured, trending, discount, premium')
        .order('name');
        
    if (error) {
        console.error("Failed to read TLDs data from Supabase:", error);
        return [];
    }

    return (data as any[]).map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
        featured: item.featured,
        trending: item.trending,
        discount: item.discount,
        premium: item.premium,
    })) || [];
}

export default async function DomainsAdminPage() {
    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role;
    
    // Corrected 'superadmin' to 'super admin'
    if (!userRole || !['super admin', 'admin', 'manager'].includes(userRole)) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
            </div>
        );
    }
    
    const tlds = await getTlds();

    return <DomainsClientPage initialTlds={tlds} />;
}
