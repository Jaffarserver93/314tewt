import 'next-auth';

export type AppUser = {
  id: string;
  discordUsername: string;
  email: string;
  image: string;
  role: 'user' | 'staff' | 'manager' | 'admin' | 'super admin';
  status: 'active' | 'banned' | 'suspended';
  createdAt: string;
};

declare module 'next-auth' {
  interface Session {
    user?: AppUser;
  }
  interface User {
      role?: 'user' | 'staff' | 'manager' | 'admin' | 'super admin';
  }
}
