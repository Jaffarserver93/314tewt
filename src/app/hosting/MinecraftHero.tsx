
'use client';

import { Flame, ArrowRight, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollToPlansButton from './ScrollToPlansButton';

export default function MinecraftHero() {

  return (
    <section className="relative py-20 md:py-32 lg:py-40 overflow-hidden text-center">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/50 rounded-full px-6 py-3 mb-8 animate-fade-in-up">
          <Gamepad2 className="w-5 h-5 text-green-300" />
          <span className="text-sm font-semibold text-white">High-Performance Minecraft Hosting</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
          Lag-Free Minecraft{' '}
          <span
            className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
            style={{ filter: 'drop-shadow(0 0 1.5rem rgba(132, 252, 132, 0.4))' }}
          >
            Servers
          </span>
        </h1>
          
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed px-4">
          Experience blazing-fast, reliable Minecraft hosting with Indian locations, DDoS protection, and 24/7 support.
        </p>
          
        <div className="flex justify-center items-center px-4">
          <ScrollToPlansButton />
        </div>
      </div>
    </section>
  );
}
