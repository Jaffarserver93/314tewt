
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Gamepad2, Zap, Shield, Users, CheckCircle, Star, Server } from 'lucide-react';
import MinecraftHero from './MinecraftHero';
import HostingClientPage from './hosting-client-page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { MinecraftPlan } from '@/lib/types';
import ScrollToPlansButton from './ScrollToPlansButton';
import { supabase } from '@/lib/supabase';
import BackButton from './back-button';


const features = [
  {
    icon: <Zap className="w-8 h-8 text-white" />,
    title: "Lightning Fast Performance",
    description: "NVMe SSD storage and high-frequency CPUs ensure your server loads instantly and runs smoothly.",
    points: ["NVMe SSD Storage", "High-Frequency CPUs", "Instant World Loading"],
    color: "from-green-500 to-emerald-500",
    shadow: "shadow-green-500/25",
    hoverBorder: "hover:border-green-500/30",
  },
  {
    icon: <Shield className="w-8 h-8 text-white" />,
    title: "Enterprise Security",
    description: "Advanced DDoS protection and security measures keep your server safe from attacks.",
    points: ["DDoS Protection", "Firewall Security", "Regular Backups"],
    color: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/25",
    hoverBorder: "hover:border-blue-500/30",
  },
  {
    icon: <Users className="w-8 h-8 text-white" />,
    title: "24/7 Expert Support",
    description: "Our dedicated support team is always ready to help you with any issues or questions.",
    points: ["24/7 Live Support", "Discord Community", "Expert Assistance"],
    color: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/25",
    hoverBorder: "hover:border-purple-500/30",
  },
  {
    icon: <Gamepad2 className="w-8 h-8 text-white" />,
    title: "Indian Locations",
    description: "Servers located in India ensure the lowest latency for Indian players.",
    points: ["Mumbai Data Center", "Low Latency", "Optimized for India"],
    color: "from-orange-500 to-yellow-500",
    shadow: "shadow-orange-500/25",
    hoverBorder: "hover:border-orange-500/30",
  },
  {
    icon: <Star className="w-8 h-8 text-white" />,
    title: "Easy Management",
    description: "Intuitive control panel makes server management simple for beginners and experts alike.",
    points: ["One-Click Setup", "Plugin Manager", "File Manager"],
    color: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-500/25",
    hoverBorder: "hover:border-pink-500/30",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-white" />,
    title: "99.9% Uptime",
    description: "Reliable infrastructure ensures your server stays online when your players need it most.",
    points: ["Redundant Systems", "Monitoring 24/7", "SLA Guarantee"],
    color: "from-indigo-500 to-purple-500",
    shadow: "shadow-indigo-500/25",
    hoverBorder: "hover:border-indigo-500/30",
  }
];

async function getMinecraftPlans(): Promise<MinecraftPlan[]> {
  const { data, error } = await supabase
    .from('minecraft_plans')
    .select('*')
    .order('price');

  if (error) {
    console.error('Failed to fetch minecraft plans:', error);
    return [];
  }
  return data;
}

export default async function HostingPage() {
  const initialPlans = await getMinecraftPlans();

  const staticContent = (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-green-900/20 text-foreground font-sans">
        <div className="relative">
            <div className="absolute top-8 left-4 sm:left-6 lg:left-8 z-20">
               <BackButton />
            </div>
            <MinecraftHero />
        </div>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Why Choose JXFRCloud™?
                </h2>
                <p className="text-xl dark:text-muted-foreground max-w-3xl mx-auto">
                  Experience the difference with our premium Minecraft hosting infrastructure
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className={cn("glassmorphism p-8 rounded-2xl group transition-all duration-500 transform-gpu hover:scale-105 active:scale-[1.02]", feature.hoverBorder)}>
                      <div className={cn("w-16 h-16 bg-gradient-to-r rounded-2xl flex items-center justify-center mb-6 shadow-lg animate-pulse", feature.color, feature.shadow)}>
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                      <p className="dark:text-muted-foreground mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.points.map((point, i) => (
                           <li key={i} className="flex items-center dark:text-muted-foreground">
                            <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                            <span className="text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                  </Card>
                ))}
              </div>
            </div>
        </section>

        {/* This empty section is the anchor for scrolling */}
        <div id="pricing"></div>
    </div>
  );

  return (
     <HostingClientPage initialPlans={initialPlans} staticContent={staticContent}>
        <ScrollToPlansButton />
     </HostingClientPage>
  );
};
