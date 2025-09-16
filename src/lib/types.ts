


export interface TLD {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  featured: boolean;
  trending: boolean;
  discount: boolean;
  premium: boolean;
  discountPercentage?: number;
}

export interface DomainFeature {
    icon: string;
    title: string;
    description: string;
}

export interface MinecraftPlan {
  id: number;
  name: string;
  category: 'budget' | 'powered' | 'premium';
  price: number;
  ram: string;
  storage: string;
  cpu: string;
  slots: string;
  is_popular: boolean;
}

export interface PlansData {
  plans: MinecraftPlan[];
}
