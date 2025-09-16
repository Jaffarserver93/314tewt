
"use client";
import { ArrowLeft, CheckCircle, Cpu, HardDrive, HelpCircle, Server, ShieldCheck, Users, Zap, IndianRupee, Gamepad2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';


const plans = [
  {
    name: 'Budget Plan',
    price: '49',
    ram: '2GB',
    storage: '10GB NVMe',
    cpu: '2 vCores',
    slots: '20 Players',
    description: 'Perfect for starting a small server with friends.',
    features: ['Basic DDoS Protection', 'Instant Setup', 'Full FTP Access'],
    isPopular: false,
  },
  {
    name: 'Powered Plan',
    price: '149',
    ram: '4GB',
    storage: '30GB NVMe',
    cpu: '4 vCores',
    slots: '40 Players',
    description: 'The ideal balance of power and affordability for growing communities.',
    features: ['Advanced DDoS Protection', 'Dedicated IP Included', '1-Click Modpack Installer', 'Daily Backups'],
    isPopular: true,
  },
  {
    name: 'Premium Plan',
    price: '299',
    ram: '8GB',
    storage: '60GB NVMe',
    cpu: '4 Unlocked vCores',
    slots: 'Unlimited Players',
    description: 'For large communities and heavily modded servers that demand the best performance.',
    features: ['Premium DDoS Protection', 'Premium Support', 'MySQL Database', 'All Powered Plan features'],
    isPopular: false,
  },
];

const features = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: 'Instant Setup',
    description: 'Your server is up and running within minutes of your purchase. No waiting, just playing.',
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: 'DDoS Protection',
    description: 'We provide robust protection against DDoS attacks to keep your server online and secure.',
  },
  {
    icon: <Server className="w-8 h-8 text-primary" />,
    title: 'Indian Locations',
    description: 'Get the lowest latency with our servers located in India, ensuring a smooth gaming experience.',
  },
  {
    icon: <HelpCircle className="w-8 h-8 text-primary" />,
    title: '24/7 Support',
    description: 'Our expert support team is always available to help you with any issues or questions.',
  },
];

const faqs = [
  {
    question: 'Can I upgrade my plan later?',
    answer: 'Yes, you can easily upgrade your plan at any time from your client area. Your files and settings will be preserved.',
  },
  {
    question: 'Do you offer a money-back guarantee?',
    answer: 'We offer a 48-hour money-back guarantee. If you are not satisfied with our service, you can request a full refund within 48 hours of your purchase.',
  },
  {
    question: 'Can I use a custom JAR file?',
    answer: 'Absolutely! You have full control to upload and use your own custom server JAR files.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept a wide variety of payment methods, including UPI, credit/debit cards, net banking, and major wallets.',
  },
];

export default function MinecraftHostingPage() {
    const router = useRouter();
  return (
    <div className="text-foreground">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
        </Button>
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Minecraft Hosting</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            High-performance, lag-free Minecraft server hosting with Indian locations for the ultimate gaming experience.
          </p>
        </header>

        <section id="pricing" className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  'glassmorphism flex flex-col rounded-2xl transition-all duration-300',
                  plan.isPopular ? 'border-primary/50 shadow-primary/20 shadow-lg scale-105' : 'hover:border-primary/30'
                )}
              >
                 {plan.isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground gap-1"><Award className="w-3 h-3"/> Most Popular</Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
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
                    <li className="flex items-center gap-3"><Gamepad2 className="w-5 h-5 text-primary" /> <strong>{plan.ram}</strong> RAM</li>
                    <li className="flex items-center gap-3"><HardDrive className="w-5 h-5 text-primary" /> <strong>{plan.storage}</strong> Storage</li>
                    <li className="flex items-center gap-3"><Cpu className="w-5 h-5 text-primary" /> <strong>{plan.cpu}</strong></li>
                    <li className="flex items-center gap-3"><Users className="w-5 h-5 text-primary" /> <strong>{plan.slots}</strong></li>
                  </ul>
                  <div className="border-t border-border/20 pt-4">
                     <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            {feature}
                        </li>
                        ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className={cn('w-full', plan.isPopular && 'bg-primary hover:bg-primary/90')}>
                    Choose Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Core Features</h2>
            <p className="text-lg text-muted-foreground mt-2">Everything you get with every plan.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glassmorphism p-6 text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="faq">
           <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </div>
  );
}

    