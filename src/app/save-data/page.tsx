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
        const user = session.user;
        const { error } = await supabase.from('users').upsert({
          id: user.id,
          username: user.username,
          email: user.email,
          avatar_url: user.image,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.error('Error saving user data to Supabase:', error);
          // Optionally, handle the error in the UI
        }
        
        router.push('/');
      };

      saveUserData();
    } else if (status === 'unauthenticated') {
      // If user is not authenticated, redirect to home
      router.push('/');
    }
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
