
import { supabase } from '@/lib/supabase';
import type { TLD, DomainFeature } from '@/lib/types';
import DomainsClientPage from './domains-client-page';

async function getData(): Promise<{ tlds: TLD[], features: DomainFeature[] }> {
    const tldsPromise = supabase
        .from('tlds')
        .select('tld, price, originalPrice:original_price');
        
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

    return {
        tlds: (tlds as TLD[]) || [],
        features: (features as DomainFeature[]) || []
    };
}


export default async function DomainsPage() {
    const { tlds, features } = await getData();

    return <DomainsClientPage initialTlds={tlds} features={features} />;
}
