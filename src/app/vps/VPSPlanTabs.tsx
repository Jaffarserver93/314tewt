
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, MemoryStick, HardDrive, IndianRupee, Shield, Zap, Crown, SlidersHorizontal, Sparkles, Filter, CheckCircle } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { VpsPlan } from '@/lib/types';
import { useSession, signIn } from 'next-auth/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VPSPlanTabsProps {
  plans: {
    standard: VpsPlan[];
    performance: VpsPlan[];
    enterprise: VpsPlan[];
  };
  onPlanSelect?: (plan: VpsPlan) => void;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  standard: <Shield className="w-8 h-8" />,
  performance: <Zap className="w-8 h-8" />,
  enterprise: <Crown className="w-8 h-8" />,
};

const categoryStyles: { [key: string]: { bg: string; text: string; shadow: string; } } = {
  standard: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    shadow: 'shadow-blue-500/30'
  },
  performance: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    shadow: 'shadow-yellow-500/30'
  },
  enterprise: {
    bg: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10',
    text: 'text-purple-400',
    shadow: 'shadow-purple-500/30'
  }
};


const PlanCard: React.FC<{ plan: VpsPlan; onPlanSelect?: (plan: VpsPlan) => void }> = ({ plan, onPlanSelect }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const handleSelect = () => {
    if (!onPlanSelect) return;
    
    if (!isAuthenticated) {
      signIn('discord');
    } else {
      onPlanSelect(plan);
    }
  };
  
  return (
  <Card className={cn("glassmorphism p-8 rounded-2xl group transition-all duration-500 transform-gpu hover:scale-105 active:scale-[1.02] relative overflow-hidden flex flex-col", plan.is_popular ? 'border-2 border-primary/80' : 'border-border')}>
    <div className="flex-grow">
      <div className="text-center mb-6">
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-pulse", categoryStyles[plan.category].bg, categoryStyles[plan.category].text, categoryStyles[plan.category].shadow)}>
            {categoryIcons[plan.category]}
          </div>
           <h3 className="text-3xl font-bold text-foreground mt-4 mb-2 text-center">{plan.name}</h3>
      </div>

      {plan.is_popular && (
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/90 text-black px-4 py-1.5 text-sm font-semibold shadow-md">
            <Sparkles className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-center text-4xl font-bold text-primary mb-2">
        <IndianRupee className="w-7 h-7 mr-1" />
        {plan.price}
        <span className="text-lg text-muted-foreground ml-2">/ month</span>
      </div>
      
      <ul className="space-y-4 mb-8 dark:text-muted-foreground">
          <li className="flex items-center"><Cpu className="w-5 h-5 mr-3 text-blue-400" /><span>{plan.vcpu}</span></li>
          <li className="flex items-center"><MemoryStick className="w-5 h-5 mr-3 text-blue-400" /><span>{plan.ram} RAM</span></li>
          <li className="flex items-center"><HardDrive className="w-5 h-5 mr-3 text-blue-400" /><span>{plan.storage} Storage</span></li>
          <li className="flex items-center"><SlidersHorizontal className="w-5 h-5 mr-3 text-blue-400" /><span>{plan.bandwidth} Bandwidth</span></li>
          <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-blue-400" /><span>{plan.cpu}</span></li>
          <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-blue-400" /><span>{plan.country}</span></li>
      </ul>

    </div>

    <Button onClick={handleSelect} size="lg" className="w-full mt-auto bg-gradient-to-r from-slate-800 to-blue-900 hover:from-slate-700 hover:to-blue-800 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95">
        {isAuthenticated ? 'Select Plan' : 'Sign in to Order'}
    </Button>
  </Card>
  );
};

const VPSPlanTabs: React.FC<VPSPlanTabsProps> = ({ plans, onPlanSelect }) => {
  const [countryFilter, setCountryFilter] = useState('all');
  const [cpuFilter, setCpuFilter] = useState('all');

  const allPlans = useMemo(() => [...plans.standard, ...plans.performance, ...plans.enterprise], [plans]);

  const filteredPlans = useMemo(() => {
    return allPlans.filter(plan => {
      const countryMatch = countryFilter === 'all' || plan.country === countryFilter;
      const cpuMatch = cpuFilter === 'all' || plan.cpu === cpuFilter;
      return countryMatch && cpuMatch;
    });
  }, [allPlans, countryFilter, cpuFilter]);

  const sortedPlans = useMemo(() => {
    return filteredPlans.sort((a, b) => a.price - b.price);
  }, [filteredPlans]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Choose Your VPS Plan
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Scalable, powerful, and reliable plans to fit your needs, from small projects to large-scale applications.
        </p>
      </div>

      <div className="flex justify-center mb-10">
          <div className="p-2 rounded-2xl glassmorphism flex items-center gap-4">
             <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="w-5 h-5" />
                <span className="font-medium">Filter by</span>
             </div>
             <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-[180px] bg-gradient-to-r from-blue-500/80 to-cyan-500/80 text-white border-cyan-400/50">
                    <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="India">🇮🇳 India</SelectItem>
                    <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                </SelectContent>
             </Select>
             <Select value={cpuFilter} onValueChange={setCpuFilter}>
                <SelectTrigger className="w-[280px] bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white border-pink-400/50">
                    <SelectValue placeholder="Select CPU/GPU" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All CPUs</SelectItem>
                    <SelectItem value="AMD Ryzen 7 7700">
                        <div className="flex items-center gap-2">
                            <Cpu className="w-4 h-4"/>
                            AMD Ryzen 7 7700 Premium
                        </div>
                    </SelectItem>
                    <SelectItem value="Intel Xeon">
                        <div className="flex items-center gap-2">
                           <Cpu className="w-4 h-4"/>
                           Intel Xeon - Standard
                        </div>
                    </SelectItem>
                </SelectContent>
             </Select>
          </div>
        </div>
        
        {sortedPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedPlans.map(p => <PlanCard key={p.id} plan={p} onPlanSelect={onPlanSelect} />)}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
                <p>No plans match the selected filters.</p>
            </div>
          )}

    </div>
  );
};

export default VPSPlanTabs;
