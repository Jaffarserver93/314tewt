
export interface TLD {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  featured: boolean;
  trending: boolean;
  discount: boolean;
  premium: boolean;
}

export interface DomainFeature {
    icon: string;
    title: string;
    description: string;
}
