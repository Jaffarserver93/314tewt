
export interface TLD {
  tld: string;
  price: string;
  originalPrice: string;
}

export interface TLDsData {
    tlds: TLD[];
}

export interface DomainFeature {
    icon: string;
    title: string;
    description: string;
}

export interface FeaturesData {
    features: DomainFeature[];
}
