
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, MemoryStick, HardDrive, IndianRupee, Users, Shield, Server, Sparkles, Database, History, Share2, Zap, Crown } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
import type { Plan, PlansData } from '@/lib/types';
import { useSession, signIn } from 'next-auth/react';


interface PlanTabsProps {
  plans: PlansData['plans'];
  onPlanSelect?: (plan: any) => void;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  budget: <Shield className="w-8 h-8" />,
  powered: <Zap className="w-8 h-8" />,
  premium: <Crown className="w-8 h-8" />,
};

const categoryStyles: { [key: string]: { bg: string; text: string; shadow: string; } } = {
  budget: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    shadow: 'shadow-green-500/30'
  },
  powered: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    shadow: 'shadow-yellow-500/30'
  },
  premium: {
    bg: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10',
    text: 'text-purple-400',
    shadow: 'shadow-purple-500/30'
  }
};


const PlanCard: React.FC<{ plan: Plan; category: string; onPlanSelect?: (plan: any) => void }> = ({ plan, category, onPlanSelect }) => {
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
          <li className="flex items-center"><MemoryStick className="w-5 h-5 mr-3 text-emerald-400" /><span>{plan.ram}</span></li>
          <li className="flex items-center"><Cpu className="w-5 h-5 mr-3 text-emerald-400" /><span>{plan.cpu}</span></li>
          <li className="flex items-center"><Users className="w-5 h-5 mr-3 text-emerald-400" /><span>{plan.slots}</span></li>
          <li className="flex items-center"><HardDrive className="w-5 h-5 mr-3 text-emerald-400" /><span>{plan.storage} Storage</span></li>
          <li className="flex items-center"><Database className="w-5 h-5 mr-3 text-emerald-400" /><span>{plan.databases} Databases</span></li>
          <li className="flex items-center"><History className="w-5 h-5 mr-3 text-emerald-400" /><span>{plan.backups} Backups</span></li>
          <li className="flex items-center"><Share2 className="w-5 h-5 mr-3 text-emerald-400" /><span>{plan.ports} Ports</span></li>
          <li className="flex items-center"><Shield className="w-5 h-5 mr-3 text-emerald-400" /><span>DDoS Protection</span></li>
          <li className="flex items-center"><Server className="w-5 h-5 mr-3 text-emerald-400" /><span>Indian Servers</span></li>
      </ul>

    </div>

    <Button onClick={handleSelect} size="lg" className="w-full mt-auto bg-gradient-to-r from-slate-800 to-emerald-900 hover:from-slate-700 hover:to-emerald-800 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95">
        {isAuthenticated ? 'Select Plan' : 'Sign in to Order'}
    </Button>
  </Card>
  );
};

const PlanTabs: React.FC<PlanTabsProps> = ({ plans, onPlanSelect }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Find Your Perfect Plan
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Choose from a range of affordable and powerful plans to fit any server size.
        </p>
      </div>

      <Tabs defaultValue="powered" className="w-full">
        <div className="flex justify-center mb-10">
          <div className="p-2 rounded-2xl glassmorphism">
            <TabsList className="p-0 rounded-xl h-auto flex flex-col md:flex-row gap-2 bg-transparent">
              <TabsTrigger value="budget" className="w-full md:w-auto text-base gap-2 px-6 py-3 rounded-xl justify-center data-[state=active]:text-primary-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-800 data-[state=active]:to-emerald-900 data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/20 data-[state=inactive]:glassmorphism data-[state=inactive]:text-muted-foreground">
                <Shield className="w-5 h-5" />
                Budget Plans
              </TabsTrigger>
              <TabsTrigger value="powered" className="w-full md:w-auto text-base gap-2 px-6 py-3 rounded-xl justify-center data-[state=active]:text-primary-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-800 data-[state=active]:to-emerald-900 data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/20 data-[state=inactive]:glassmorphism data-[state=inactive]:text-muted-foreground">
                <Zap className="w-5 h-5" />
                Powered Plans
              </TabsTrigger>
              <TabsTrigger value="premium" className="w-full md:w-auto text-base gap-2 px-6 py-3 rounded-xl justify-center data-[state=active]:text-primary-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-800 data-[state=active]:to-emerald-900 data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/20 data-[state=inactive]:glassmorphism data-[state=inactive]:text-muted-foreground">
                <Crown className="w-5 h-5" />
                Premium Plans
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="budget">
          {plans.budget.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.budget.map(p => <PlanCard key={p.name} plan={p} category="budget" onPlanSelect={onPlanSelect} />)}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
                <p>Plans for this category are not available at the moment.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="powered">
          {plans.powered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.powered.map(p => <PlanCard key={p.name} plan={p} category="powered" onPlanSelect={onPlanSelect} />)}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
                <p>Plans for this category are not available at the moment.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="premium">
          {plans.premium.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.premium.map(p => <PlanCard key={p.name} plan={p} category="premium" onPlanSelect={onPlanSelect} />)}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
                <p>Plans for this category are not available at the moment.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanTabs;
