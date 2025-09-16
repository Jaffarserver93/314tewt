"use client";

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SaveDataPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user && !isSaving) {
      const saveUserData = async () => {
        setIsSaving(true);
        try {
          const user = session.user as any;

          if (!user.id) {
            throw new Error("User ID is missing from session.");
          }

          const { error: dbError } = await supabase
            .from('users')
            .upsert(
              {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar_url: user.image,
                role: 'user', // Default role for new users
                status: 'active',
                updated_at: new Date().toISOString(),
              },
              {
                onConflict: 'id',
              }
            )
            .select()
            .single();

          if (dbError) {
            throw dbError;
          }

          router.push('/');
        } catch (e: any) {
          console.error('Error saving user data:', e);
          setError(e.message || 'An unexpected error occurred while saving your data.');
          setIsSaving(false);
        }
      };

      saveUserData();
    } else if (status === 'unauthenticated') {
      setError('Authentication failed. Please try logging in again.');
    }
  }, [session, status, router, isSaving]);

  if (error) {
    return (
       <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-destructive">
              <AlertTriangle />
              Login Failed
            </CardTitle>
            <CardDescription>
              There was a problem saving your information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => signIn('discord')} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Finalizing your login, please wait...</p>
      </div>
    </div>
  );
}
