
import { supabase } from '@/lib/supabase';
import type { TLD, DomainFeature } from '@/lib/types';
import DomainsClientPage from './domains-client-page';

async function getData(): Promise<{ tlds: TLD[], features: DomainFeature[] }> {
    const tldsPromise = supabase
        .from('tlds')
        .select('id, name, price, original_price, featured, trending, discount, premium');
        
    const featuresPromise = supabase
        .from('domain_features')
        .select('icon, title, description');

    const [{ data: tlds, error: tldsError }, { data: features, error: featuresError }] = await Promise.all([
        tldsPromise,
        featuresPromise
    ]);

    if (tldsError) {
        console.error("Failed to read TLDs data from Supabase:", tldsError);
    }
    if (featuresError) {
        console.error("Failed to read features data from Supabase:", featuresError);
    }

    const formattedTlds = (tlds as any[]).map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
        featured: item.featured,
        trending: item.trending,
        discount: item.discount,
        premium: item.premium,
    })) || [];


    return {
        tlds: formattedTlds,
        features: (features as DomainFeature[]) || []
    };
}


export default async function DomainsPage() {
    const { tlds, features } = await getData();

    return <DomainsClientPage initialTlds={tlds} features={features} />;
}

