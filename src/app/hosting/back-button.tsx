
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      onClick={() => router.push('/')}
      className="flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Back to Home
    </Button>
  );
}
