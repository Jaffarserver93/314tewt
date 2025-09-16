
import React from 'react';
import { ArrowLeft, Zap, Shield, Users, CheckCircle, Cpu, Server, HardDrive } from 'lucide-react';
import VPSHero from './VPSHero';
import VpsClientPage from './vps-client-page';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { VpsPlan } from '@/lib/types';
import BackButton from '@/app/hosting/back-button';
import { supabase } from '@/lib/supabase';


const features = [
  {
    icon: <Zap className="w-8 h-8 text-white" />,
    title: "V4 Processors",
    description: "Experience unparalleled speed with the latest generation V4 processors for all your demanding applications.",
    points: ["High Clock Speeds", "Improved IPC", "Faster Computation"],
    color: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/25",
    hoverBorder: "hover:border-blue-500/30",
  },
  {
    icon: <HardDrive className="w-8 h-8 text-white" />,
    title: "NVMe SSD Storage",
    description: "Blazing-fast NVMe SSDs provide lightning-quick read/write speeds, reducing latency for your projects.",
    points: ["Low Latency Storage", "High Throughput", "Quick Boot Times"],
    color: "from-indigo-500 to-purple-500",
    shadow: "shadow-indigo-500/25",
    hoverBorder: "hover:border-indigo-500/30",
  },
  {
    icon: <Users className="w-8 h-8 text-white" />,
    title: "24/7 Expert Support",
    description: "Our team of experts is available around the clock to assist you with any issues or questions.",
    points: ["24/7 Live Chat", "Ticketing System", "Knowledge Base"],
    color: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/25",
    hoverBorder: "hover:border-purple-500/30",
  },
  {
    icon: <Shield className="w-8 h-8 text-white" />,
    title: "DDoS Protection",
    description: "Stay secure with our robust DDoS protection, safeguarding your server from malicious attacks.",
    points: ["Network-level Mitigation", "Always-On Protection", "Real-time Monitoring"],
    color: "from-green-500 to-emerald-500",
    shadow: "shadow-green-500/25",
    hoverBorder: "hover:border-green-500/30",
  },
  {
    icon: <Cpu className="w-8 h-8 text-white" />,
    title: "Full Root Access",
    description: "Take complete control of your server environment with full root access for maximum customization.",
    points: ["Install Custom Software", "Fine-tune Settings", "Total Control"],
    color: "from-orange-500 to-yellow-500",
    shadow: "shadow-orange-500/25",
    hoverBorder: "hover:border-orange-500/30",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-white" />,
    title: "99.9% Uptime",
    description: "We guarantee a 99.9% uptime, ensuring your projects are always online and accessible.",
    points: ["Redundant Power", "Network Resiliency", "SLA Guarantee"],
    color: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-500/25",
    hoverBorder: "hover:border-pink-500/30",
  }
];


async function getVpsPlans(): Promise<VpsPlan[]> {
    const { data, error } = await supabase
        .from('vps_plans')
        .select('*')
        .order('price');
        
    if (error) {
        console.error("Failed to read VPS plans data from Supabase:", error);
        return [];
    }

    return (data || []) as VpsPlan[];
}


export default async function VpsPage() {
  const initialPlans = await getVpsPlans();

  const staticContent = (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900/20 text-foreground font-sans">
        <div className="relative">
            <div className="absolute top-8 left-4 sm:left-6 lg:left-8 z-20">
               <BackButton />
            </div>
            <VPSHero />
        </div>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Why Our VPS Stands Out
                </h2>
                <p className="text-xl dark:text-muted-foreground max-w-3xl mx-auto">
                  Discover the features that make our VPS hosting the best choice for your projects.
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

        <div id="vps-plans"></div>
    </div>
  );

  return (
     <VpsClientPage initialPlans={initialPlans} staticContent={staticContent}>
        <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 group">
          Choose Your VPS Plan
        </Button>
     </VpsClientPage>
  );
};
