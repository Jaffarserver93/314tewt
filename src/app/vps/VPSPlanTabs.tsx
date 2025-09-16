
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, MemoryStick, HardDrive, IndianRupee, Shield, Zap, Crown, SlidersHorizontal, Sparkles } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import type { VpsPlan } from '@/lib/types';
import { useSession, signIn } from 'next-auth/react';


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


const PlanCard: React.FC<{ plan: VpsPlan; category: string; onPlanSelect?: (plan: VpsPlan) => void }> = ({ plan, category, onPlanSelect }) => {
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
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-pulse", categoryStyles[category].bg, categoryStyles[category].text, categoryStyles[category].shadow)}>
            {categoryIcons[category]}
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
      </ul>

    </div>

    <Button onClick={handleSelect} size="lg" className="w-full mt-auto bg-gradient-to-r from-slate-800 to-blue-900 hover:from-slate-700 hover:to-blue-800 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95">
        {isAuthenticated ? 'Select Plan' : 'Sign in to Order'}
    </Button>
  </Card>
  );
};

const VPSPlanTabs: React.FC<VPSPlanTabsProps> = ({ plans, onPlanSelect }) => {
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

      <Tabs defaultValue="performance" className="w-full">
        <div className="flex justify-center mb-10">
          <div className="p-2 rounded-2xl glassmorphism">
            <TabsList className="p-0 rounded-xl h-auto flex flex-col md:flex-row gap-2 bg-transparent">
              <TabsTrigger value="standard" className="w-full md:w-auto text-base gap-2 px-6 py-3 rounded-xl justify-center data-[state=active]:text-primary-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-800 data-[state=active]:to-blue-900 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 data-[state=inactive]:glassmorphism data-[state=inactive]:text-muted-foreground">
                <Shield className="w-5 h-5" />
                Standard
              </TabsTrigger>
              <TabsTrigger value="performance" className="w-full md:w-auto text-base gap-2 px-6 py-3 rounded-xl justify-center data-[state=active]:text-primary-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-800 data-[state=active]:to-blue-900 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 data-[state=inactive]:glassmorphism data-[state=inactive]:text-muted-foreground">
                <Zap className="w-5 h-5" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="enterprise" className="w-full md:w-auto text-base gap-2 px-6 py-3 rounded-xl justify-center data-[state=active]:text-primary-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-800 data-[state=active]:to-blue-900 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/20 data-[state=inactive]:glassmorphism data-[state=inactive]:text-muted-foreground">
                <Crown className="w-5 h-5" />
                Enterprise
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="standard">
          {plans.standard.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.standard.map(p => <PlanCard key={p.id} plan={p} category="standard" onPlanSelect={onPlanSelect} />)}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
                <p>Standard plans are not available at the moment.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="performance">
          {plans.performance.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.performance.map(p => <PlanCard key={p.id} plan={p} category="performance" onPlanSelect={onPlanSelect} />)}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
                <p>Performance plans are not available at the moment.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="enterprise">
          {plans.enterprise.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.enterprise.map(p => <PlanCard key={p.id} plan={p} category="enterprise" onPlanSelect={onPlanSelect} />)}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
                <p>Enterprise plans are not available at the moment.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VPSPlanTabs;

    