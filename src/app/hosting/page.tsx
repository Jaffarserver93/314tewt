
import { supabase } from '@/lib/supabase';
import type { MinecraftPlan } from '@/lib/types';
import HostingClientPage from './hosting-client-page';
import BackButton from './back-button';
import ScrollToPlansButton from './ScrollToPlansButton';
import {
  Zap,
  ShieldCheck,
  Server,
  HelpCircle,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';


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

const features = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: 'Instant Setup',
    description:
      'Your server is up and running within minutes of your purchase. No waiting, just playing.',
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: 'DDoS Protection',
    description:
      'We provide robust protection against DDoS attacks to keep your server online and secure.',
  },
  {
    icon: <Server className="w-8 h-8 text-primary" />,
    title: 'Indian Locations',
    description:
      'Get the lowest latency with our servers located in India, ensuring a smooth gaming experience.',
  },
  {
    icon: <HelpCircle className="w-8 h-8 text-primary" />,
    title: '24/7 Support',
    description:
      'Our expert support team is always available to help you with any issues or questions.',
  },
];

const faqs = [
  {
    question: 'Can I upgrade my plan later?',
    answer:
      'Yes, you can easily upgrade your plan at any time from your client area. Your files and settings will be preserved.',
  },
  {
    question: 'Do you offer a money-back guarantee?',
    answer:
      'We offer a 48-hour money-back guarantee. If you are not satisfied with our service, you can request a full refund within 48 hours of your purchase.',
  },
  {
    question: 'Can I use a custom JAR file?',
    answer:
      'Absolutely! You have full control to upload and use your own custom server JAR files.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept a wide variety of payment methods, including UPI, credit/debit cards, net banking, and major wallets.',
  },
];

const StaticContent = () => (
  <div className="container mx-auto py-12 px-4 md:px-6">
    <BackButton />
    <header className="text-center mb-16">
      <h1 className="text-5xl md:text-6xl font-bold mb-4">
        Minecraft Hosting
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        High-performance, lag-free Minecraft server hosting with Indian
        locations for the ultimate gaming experience.
      </p>
    </header>
  </div>
);

export default async function MinecraftHostingPage() {
  const plans = await getMinecraftPlans();

  return (
    <HostingClientPage
      initialPlans={plans}
      staticContent={<StaticContent />}
    >
      <ScrollToPlansButton />
    </HostingClientPage>
  );
}
