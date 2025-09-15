"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function SaveDataPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const saveUserData = async () => {
        const user = session.user as any;
        
        // The user object from the session contains the Discord profile data.
        // We need to map it correctly to our 'users' table columns.
        const { data, error } = await supabase
          .from('users')
          .upsert({
            id: user.id, // This is the Discord user ID
            username: user.username,
            email: user.email,
            avatar_url: user.image,
            role: 'user',
            status: 'active',
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          })
          .select()
          .single();

        if (error) {
          console.error('Error saving user data to Supabase:', error);
        }
        
        // Whether it succeeds or fails, redirect to home.
        router.push('/');
      };

      saveUserData();
    } else if (status === 'unauthenticated') {
      // If user is not authenticated for some reason, redirect to home
      router.push('/');
    }
    // The dependency array includes session, status, and router.
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Saving your data and redirecting...</p>
      </div>
    </div>
  );
}
