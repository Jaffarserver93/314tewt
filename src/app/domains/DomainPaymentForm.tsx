
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import type { TLD } from '@/lib/types';

interface DomainPaymentFormProps {
  selectedDomain: {
    domain: string;
    tld: TLD;
  };
  onBack: () => void;
}

export default function DomainPaymentForm({ selectedDomain, onBack }: DomainPaymentFormProps) {
  const { domain, tld } = selectedDomain;

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
             <Button variant="ghost" onClick={onBack} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
            </Button>
            <Card className="glassmorphism">
                <CardHeader>
                    <CardTitle>Complete Your Purchase</CardTitle>
                    <CardDescription>You are about to register a new domain.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="p-4 border rounded-lg bg-background/50">
                        <p className="text-lg font-bold">{domain}{tld.name}</p>
                        <p className="text-2xl font-bold text-primary">₹{tld.price}/year</p>
                        {tld.originalPrice && (
                            <p className="text-sm text-muted-foreground">
                                Renews at <span className="line-through">₹{tld.originalPrice}</span>
                            </p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                        <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">Payment form placeholder</p>
                        </div>
                    </div>
                    <Button size="lg" className="w-full">
                        Pay ₹{tld.price} and Register
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

