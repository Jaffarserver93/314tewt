


export interface Plan {
  id: number;
  name: string;
  price: number;
  ram: string;
  cpu: string;
  slots: string;
  storage: string;
  databases: string;
  backups: string;
  ports: string;
  is_popular: boolean;
  category: 'budget' | 'powered' | 'premium';
}

export interface PlansData {
  plans: {
    budget: Plan[];
    powered: Plan[];
    premium: Plan[];
  };
}


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
  databases: string;
  backups: string;
  ports: string;
  is_popular: boolean;
}

export interface VpsPlan {
  id: number;
  name: string;
  category: 'standard' | 'performance' | 'enterprise';
  price: number;
  vcpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  is_popular: boolean;
  country: 'India' | 'Germany';
  cpu: 'AMD Ryzen 7 7700' | 'Intel Xeon';
}
