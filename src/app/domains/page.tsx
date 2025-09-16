
import fs from 'fs/promises';
import path from 'path';
import type { TLDsData, FeaturesData } from '@/lib/types';
import DomainsClientPage from './domains-client-page';

async function getData(): Promise<{ tlds: TLDsData['tlds'], features: FeaturesData['features'] }> {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'domains-data.json');
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return {
            tlds: data.tlds || [],
            features: data.features || []
        };
    } catch (error) {
        console.error("Failed to read domains data:", error);
        return { tlds: [], features: [] };
    }
}

export default async function DomainsPage() {
    const { tlds, features } = await getData();

    return <DomainsClientPage initialTlds={tlds} features={features} />;
}
