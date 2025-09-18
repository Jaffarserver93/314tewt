
import { supabase } from '@/lib/supabase';
import UsersClientPage from './users-client-page';
import type { AppUser } from '@/types/next-auth';
import { UsersProvider } from './users-context';

export const revalidate = 0;

async function getUsers(): Promise<AppUser[]> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching users:', error);
        return [];
    }

    return data.map(user => ({
        id: user.id,
        discordUsername: user.username,
        email: user.email,
        image: user.avatar_url,
        role: user.role,
        status: user.status,
        createdAt: user.created_at,
    }));
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <UsersProvider initialUsers={users}>
      <UsersClientPage />
    </UsersProvider>
  );
}
