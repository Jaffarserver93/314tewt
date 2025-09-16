
'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, MemoryStick, HardDrive, IndianRupee, Wifi, Database, Server, Shield, Star, Filter, Zap, Sparkles } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { VpsPlan } from '@/lib/types';
import { useSession, signIn } from 'next-auth/react';


interface VPSPlanTabsProps {
  plans: VpsPlan[];
  onPlanSelect: (plan: any) => void;
}

const PlanCard: React.FC<{ plan: VpsPlan; onPlanSelect: (plan: any) => void }> = ({ plan, onPlanSelect }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const handleSelect = () => {
    if (!isAuthenticated) {
      signIn('discord');
    } else {
      onPlanSelect(plan);
    }
  };

  return (
    <Card className={cn("glassmorphism p-8 rounded-2xl group transition-all duration-500 transform-gpu hover:scale-105 active:scale-[1.02] relative overflow-hidden flex flex-col", plan.is_popular ? 'border-2 border-yellow-400/80' : 'border-border')}>
      <div className="flex-grow">
        <div className="text-center mb-6">
            {plan.is_popular && (
              <div className="mb-4 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/90 text-black px-4 py-1.5 text-sm font-semibold shadow-md">
                  <Sparkles className="w-4 h-4" />
                  Most Popular
                </div>
              </div>
            )}
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-pulse", 
              'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/30'
            )}>
              {plan.cpu === 'AMD Ryzen 7 7700' ? <Zap className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
            </div>

            <div className="flex justify-center items-center gap-2 mt-4">
                <span className="text-sm font-medium capitalize flex items-center gap-1">
                    <span role="img" aria-label={plan.country}>
                        {plan.country === 'India' ? '🇮🇳' : '🇩🇪'}
                    </span>
                    {plan.country}
                </span>
                <span className="text-sm font-medium capitalize flex items-center gap-1">
                    <Cpu className="w-4 h-4" /> {plan.cpu.includes('AMD') ? 'AMD' : 'Intel'}
                </span>
            </div>

            <h3 className="text-3xl font-bold text-foreground mt-4 mb-2 text-center">{plan.name}</h3>
        </div>
        
        <div className="flex items-center justify-center text-4xl font-bold text-primary mb-2">
          <IndianRupee className="w-7 h-7 mr-1" />
          {plan.price}
          <span className="text-lg text-muted-foreground ml-2">/ month</span>
        </div>
        
        <ul className="space-y-4 mb-8">
            <li className="flex items-center"><Cpu className="w-5 h-5 mr-3 text-blue-400" /><span>{plan.vcpu}</span></li>
            <li className="flex items-center"><MemoryStick className="w-5 h-5 mr-3 text-blue-400" /><span>{plan.ram} RAM</span></li>
            <li className="flex items-center"><HardDrive className="w-5 h-5 mr-3 text-blue-400" /><span>{plan.storage} Storage</span></li>
            <li className="flex items-center"><Wifi className="w-5 h-5 mr-3 text-blue-400" /><span>{plan.bandwidth} Bandwidth</span></li>
            <li className="flex items-center"><Database className="w-5 h-5 mr-3 text-blue-400" /><span>Full Root Access</span></li>
            <li className="flex items-center"><Server className="w-5 h-5 mr-3 text-blue-400" /><span>{plan.country} Servers</span></li>
            <li className="flex items-center"><Shield className="w-5 h-5 mr-3 text-blue-400" /><span>DDoS Protection</span></li>
        </ul>
      </div>

      <Button onClick={handleSelect} size="lg" className="w-full mt-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95">
          {isAuthenticated ? 'Select Plan' : 'Sign in to Order'}
      </Button>
    </Card>
  );
};

const VPSPlanTabs: React.FC<VPSPlanTabsProps> = ({ plans, onPlanSelect }) => {
  const [country, setCountry] = useState<'all' | 'India' | 'Germany'>('all');
  const [cpu, setCpu] = useState<'all' | 'Intel Xeon' | 'AMD Ryzen 7 7700'>('all');

  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const countryMatch = country === 'all' || plan.country === country;
      const cpuMatch = cpu === 'all' || plan.cpu === cpu;
      return countryMatch && cpuMatch;
    });
  }, [plans, country, cpu]);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Find Your Perfect VPS Plan
        </h2>
        <p className="text-xl max-w-3xl mx-auto text-muted-foreground">
          Choose from a range of affordable and powerful plans to fit any need.
        </p>
      </div>

       <div className="mb-12">
        <Card className="glassmorphism p-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filter by</span>
            </div>
            
            <Select value={country} onValueChange={(value) => setCountry(value as any)}>
              <SelectTrigger className="w-auto min-w-[150px] bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 font-semibold">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="India">
                  <span role="img" aria-label="India">🇮🇳</span> India
                </SelectItem>
                <SelectItem value="Germany">
                  <span role="img" aria-label="Germany">🇩🇪</span> Germany
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={cpu} onValueChange={(value) => setCpu(value as any)}>
              <SelectTrigger className="w-auto min-w-[280px] bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 font-semibold">
                <SelectValue placeholder="Select CPU" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All CPU/GPUs</SelectItem>
                <SelectItem value="AMD Ryzen 7 7700">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> AMD Ryzen 7 7700 Premium
                  </div>
                </SelectItem>
                <SelectItem value="Intel Xeon">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> Intel Xeon - Standard
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>
      
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlans.map(p => <PlanCard key={p.id} plan={p} onPlanSelect={onPlanSelect} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
            <p>No plans available that match your filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default VPSPlanTabs;
