"use client";

import {
  Award,
  Cpu,
  Gamepad2,
  Gem,
  HardDrive,
  IndianRupee,
  Rocket,
  Server,
  Star,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import type { MinecraftPlan } from '@/lib/types';

const PlanCard = ({ plan, onPlanSelect }: { plan: MinecraftPlan, onPlanSelect: (plan: MinecraftPlan) => void }) => (
  <Card
    className={cn(
      'glassmorphism flex flex-col rounded-2xl transition-all duration-300 w-full',
      plan.is_popular
        ? 'border-primary/50 shadow-primary/20 shadow-lg scale-105'
        : 'hover:border-primary/30'
    )}
  >
    {plan.is_popular && (
      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground gap-1">
        <Award className="w-3 h-3" /> Most Popular
      </Badge>
    )}
    <CardHeader className="text-center">
      <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow space-y-6">
      <div className="text-center">
        <span className="text-5xl font-bold">
          <IndianRupee className="inline-block h-10 w-10 -mt-2" />
          {plan.price}
        </span>
        <span className="text-muted-foreground">/mo</span>
      </div>
      <ul className="space-y-3 text-muted-foreground">
        <li className="flex items-center gap-3">
          <Gamepad2 className="w-5 h-5 text-primary" />{' '}
          <strong>{plan.ram}</strong> RAM
        </li>
        <li className="flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-primary" />{' '}
          <strong>{plan.storage}</strong> Storage
        </li>
        <li className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-primary" /> <strong>{plan.cpu}</strong>
        </li>
        <li className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />{' '}
          <strong>{plan.slots}</strong>
        </li>
      </ul>
    </CardContent>
    <CardFooter>
      <Button
        onClick={() => onPlanSelect(plan)}
        className={cn('w-full', plan.is_popular && 'bg-primary hover:bg-primary/90')}
      >
        Choose Plan
      </Button>
    </CardFooter>
  </Card>
);

interface PlanTabsProps {
  plans: MinecraftPlan[];
  onPlanSelect: (plan: MinecraftPlan) => void;
}

export default function PlanTabs({ plans, onPlanSelect }: PlanTabsProps) {
  const budgetPlans = plans.filter((p) => p.category === 'budget');
  const poweredPlans = plans.filter((p) => p.category === 'powered');
  const premiumPlans = plans.filter((p) => p.category === 'premium');

  return (
    <section id="pricing" className="mb-20">
      <Tabs defaultValue="powered" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto h-auto">
          <TabsTrigger value="budget" className="py-3 text-lg items-center gap-2">
            <Gem className="w-5 h-5" />
            Budget
          </TabsTrigger>
          <TabsTrigger value="powered" className="py-3 text-lg items-center gap-2">
            <Rocket className="w-5 h-5" />
            Powered
          </TabsTrigger>
          <TabsTrigger value="premium" className="py-3 text-lg items-center gap-2">
            <Star className="w-5 h-5" />
            Premium
          </TabsTrigger>
        </TabsList>
        <TabsContent value="budget" className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {budgetPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onPlanSelect={onPlanSelect} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="powered" className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {poweredPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onPlanSelect={onPlanSelect} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="premium" className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {premiumPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onPlanSelect={onPlanSelect} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
