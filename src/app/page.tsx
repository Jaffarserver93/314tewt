import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';
import { Stats } from '@/components/sections/stats';
import { Testimonials } from '@/components/sections/testimonials';
import { Cta } from '@/components/sections/cta';
import { generateDynamicHeroText } from '@/ai/flows/generate-dynamic-hero-text';

export default async function Home() {
  const heroTextData = await generateDynamicHeroText({
    currentTrends: 'fast hosting India, cheap domains, Indian gamers, secure VPS',
    userData: ''
  }).catch(err => {
    console.error("AI call failed, using fallback text.", err);
    return {
      headline: 'Power Your Digital Dreams',
      subtext: 'Premium domain registration, blazing-fast Minecraft hosting, and enterprise VPS solutions designed for Indian users.',
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero headline={heroTextData.headline} subtext={heroTextData.subtext} />
        <Services />
        <Stats />
        <Testimonials />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
