"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, IndianRupee } from 'lucide-react';
import type { MinecraftPlan } from '@/lib/types';

interface PaymentFormProps {
  selectedPlan: MinecraftPlan;
  onBack: () => void;
}

export default function PaymentForm({ selectedPlan, onBack }: PaymentFormProps) {
  
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
             <Button variant="ghost" onClick={onBack} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Plans
            </Button>
            <Card className="glassmorphism">
                <CardHeader>
                    <CardTitle>Complete Your Purchase</CardTitle>
                    <CardDescription>You are about to purchase the {selectedPlan.name} plan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="p-4 border rounded-lg bg-background/50">
                        <p className="text-lg font-bold">{selectedPlan.name} Plan</p>
                        <p className="text-2xl font-bold text-primary flex items-center">
                            <IndianRupee className="w-6 h-6 mr-1" />
                            {selectedPlan.price}/month
                        </p>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                            <li>{selectedPlan.ram} RAM</li>
                            <li>{selectedPlan.storage} Storage</li>
                            <li>{selectedPlan.cpu}</li>
                            <li>{selectedPlan.slots}</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                        <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">Payment form placeholder</p>
                        </div>
                    </div>
                    <Button size="lg" className="w-full">
                        Pay ₹{selectedPlan.price} and Start Server
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
