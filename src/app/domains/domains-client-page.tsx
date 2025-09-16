
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, ShieldCheck, Globe, Zap, LifeBuoy } from "lucide-react";
import type { TLD, DomainFeature } from "@/lib/types";

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  ShieldCheck,
  Globe,
  Zap,
  LifeBuoy,
};

interface DomainsClientPageProps {
    initialTlds: TLD[];
    features: DomainFeature[];
}

export default function DomainsClientPage({ initialTlds, features }: DomainsClientPageProps) {
  return (
    <div className="flex flex-col font-sans text-foreground">
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
            Find Your Perfect Domain Name
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8">
            Your online journey starts with a great domain. We make it easy and affordable to get yours today.
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for your domain..."
                className="w-full h-14 pl-12 pr-32 rounded-full text-lg"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <Button size="lg" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-full px-6">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Popular Extensions</h2>
            <p className="text-lg text-muted-foreground mt-2">Special introductory pricing for your first year.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {initialTlds.map((tld) => (
              <Card key={tld.tld} className="glassmorphism text-center p-6 rounded-2xl hover:border-primary/50 transition-colors duration-300">
                <h3 className="text-2xl font-bold">{tld.tld}</h3>
                <p className="text-3xl font-bold text-primary my-2">{tld.price}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="line-through">{tld.originalPrice}</span> / year
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Everything You Need</h2>
            <p className="text-lg text-muted-foreground mt-2">All our domain registrations come with these premium features at no extra cost.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
                const Icon = iconMap[feature.icon];
                return (
                    <Card key={index} className="glassmorphism p-8 rounded-2xl flex items-start gap-6">
                        <div className="flex-shrink-0">
                        {Icon && <Icon className="h-8 w-8 text-primary" />}
                        </div>
                        <div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                    </Card>
                )
            })}
          </div>
        </div>
      </section>

       <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glassmorphism p-8 sm:p-12 rounded-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Ready to Claim Your Online Identity?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Millions of great domains are still available. Find yours before someone else does.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-300 h-14 px-10 text-lg rounded-full">
                Search For Your Domain Now
                <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        </div>
      </section>

    </div>
  );
}
