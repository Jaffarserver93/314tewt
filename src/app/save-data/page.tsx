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
        
        const { data, error } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            username: user.username,
            email: user.email,
            avatar_url: user.image,
            role: 'user', // Default role
            status: 'active', // Default status
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          })
          .select()
          .single();

        if (error && error.code !== '23505') { // 23505 is unique_violation, which we can ignore with upsert
          console.error('Error saving user data to Supabase:', error);
          // Optionally, handle the error in the UI
        } else if (data) {
           // if it's a new user, created_at is set by default in db.
           // if we are updating, we don't touch created_at.
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
