
export interface Order {
  id: string;
  planName: string;
  type: 'hosting' | 'vps' | 'domain';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  price: string;
  userId: string;
}
