

export interface Order {
  id: string;
  planName: string;
  type: 'hosting' | 'vps' | 'domain';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  price: string;
  userId: string;
  customerInfo?: any;
  // new fields from latest change
  plan_name: string;
  created_at: string;
  customer_info: {
    firstName: string;
    lastName: string;
    email: string;
    discordUsername: string;
    serverPurpose?: string;
  }
}
