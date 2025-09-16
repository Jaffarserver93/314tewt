'use client';

import { Button } from '@/components/ui/button';
import { Gamepad2 } from 'lucide-react';

export default function ScrollToPlansButton() {
  const scrollToPlans = () => {
    document.getElementById('hosting-plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Button
      onClick={scrollToPlans}
      size="lg"
      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto group"
    >
      <Gamepad2 className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
      Choose Your Plan
    </Button>
  );
}
