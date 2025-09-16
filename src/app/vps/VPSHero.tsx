
'use client';

import { Button } from '@/components/ui/button';
import { Server, ArrowDown } from 'lucide-react';
import React from 'react';

const VPSHero: React.FC = () => {
  const onScrollToPlans = () => {
    document.getElementById('vps-plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-blue-900/10 blur-3xl"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center space-x-2 bg-secondary/20 border border-secondary/50 rounded-full px-6 py-3 mb-8 animate-fade-in-up">
              <Server className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-white">Enterprise-Grade Infrastructure</span>
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Powerful VPS Hosting
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-2xl mx-auto lg:mx-0">
              High-performance Virtual Private Servers with V4 processors and NVMe SSDs for ultimate speed and reliability.
            </p>
            <Button
              onClick={onScrollToPlans}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto lg:mx-0 group"
            >
              <ArrowDown className="w-6 h-6 mr-3 group-hover:translate-y-1 transition-transform" />
              View VPS Plans
            </Button>
          </div>
          
          <div className="hidden lg:flex items-center justify-center">
             <div className="relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-full blur-2xl"></div>
                <Server className="relative w-72 h-72 text-white/90" style={{ filter: 'drop-shadow(0 0 2rem rgba(59, 130, 246, 0.4))' }} />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VPSHero;

    