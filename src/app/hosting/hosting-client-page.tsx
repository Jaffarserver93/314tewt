'use client';

import React, { useState } from 'react';
import PaymentForm from './PaymentForm';
import type { MinecraftPlan } from '@/lib/types';
import PlanTabs from './PlanTabs';
import { Card } from '@/components/ui/card';
import ScrollToPlansButton from './ScrollToPlansButton';


interface HostingClientPageProps {
  initialPlans: MinecraftPlan[];
  staticContent: React.ReactNode;
  children: React.ReactNode;
}

export default function HostingClientPage({ initialPlans, staticContent, children }: HostingClientPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<MinecraftPlan | null>(null);

  const handlePlanSelect = (plan: MinecraftPlan) => {
    setSelectedPlan(plan);
  };

  const handleBack = () => {
    setSelectedPlan(null);
  };
  
  if (selectedPlan) {
    return <PaymentForm selectedPlan={selectedPlan} onBack={handleBack} />;
  }

  return (
    <>
      {staticContent}
      <div>
        <section className="py-12 sm:py-20">
          <PlanTabs plans={initialPlans} onPlanSelect={handlePlanSelect} />
        </section>
        
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="glassmorphism p-12 rounded-3xl border hover:border-primary/30 transition-all duration-300">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to Start Your Server?</h2>
              <p className="text-xl dark:text-muted-foreground mb-10 leading-relaxed">
                Join thousands of satisfied customers who trust JXFRCloud™ for their Minecraft hosting needs.
              </p>
              {children}
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
