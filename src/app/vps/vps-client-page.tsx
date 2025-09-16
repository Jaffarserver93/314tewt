
'use client';

import React, { useState } from 'react';
import VPSPaymentForm from './VPSPaymentForm';
import type { VpsPlan } from '@/lib/types';
import VPSPlanTabs from './VPSPlanTabs';
import { Card } from '@/components/ui/card';

interface VpsClientPageProps {
  initialPlans: VpsPlan[];
  staticContent: React.ReactNode;
  children: React.ReactNode;
}

export default function VpsClientPage({ initialPlans, staticContent, children }: VpsClientPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<VpsPlan | null>(null);

  const handlePlanSelect = (plan: VpsPlan) => {
    setSelectedPlan(plan);
  };

  const handleBack = () => {
    setSelectedPlan(null);
  };
  
  if (selectedPlan) {
    return <VPSPaymentForm selectedPlan={selectedPlan} onBack={handleBack} />;
  }

  return (
    <>
      {staticContent}
      <div>
        <section className="py-12 sm:py-20">
          <VPSPlanTabs plans={initialPlans} onPlanSelect={handlePlanSelect} />
        </section>
        
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="glassmorphism p-12 rounded-3xl border hover:border-primary/30 transition-all duration-300">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to Deploy Your VPS?</h2>
              <p className="text-xl dark:text-muted-foreground mb-10 leading-relaxed">
                Join developers and businesses who trust JXFRCloud™ for their high-performance hosting needs.
              </p>
              {children}
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
