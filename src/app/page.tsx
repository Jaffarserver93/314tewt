"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Clock, Gamepad2, Globe, Heart, Server, Sparkles, Star, TrendingUp, Users, Flame, Tag } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useSession, signIn } from 'next-auth/react';

const services = [
    {
    icon: <Globe className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: 'Domain Registration',
    description: 'Secure your perfect domain with instant activation, premium extensions, and competitive pricing starting from ₹299.',
    features: ['Instant Domain Activation', 'Free DNS Management', 'Domain Privacy Protection'],
    buttonText: 'Get Domain',
    buttonLink: '/domains',
    buttonClass: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-700 shadow-pink-500/25 hover:shadow-pink-500/40',
    hoverGradient: 'bg-gradient-to-br from-pink-500/10 to-rose-500/10',
  },
  {
    icon: <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: 'Minecraft Hosting',
    description: 'High-performance Minecraft servers with Indian locations, 99.9% uptime, and plans starting from just ₹49/month.',
    features: ['Indian Server Locations', '99.9% Uptime Guarantee', '24/7 Premium Support'],
    buttonText: 'Choose Plan',
    buttonLink: '/hosting',
    buttonClass: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/25 hover:shadow-emerald-500/40',
    hoverGradient: 'bg-gradient-to-br from-emerald-500/10 to-green-600/10',
  },
  {
    icon: <Server className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: 'VPS Hosting',
    description: 'Enterprise-grade VPS with V4 processors, NVMe SSD storage, and instant deployment starting from ₹270/month.',
    features: ['V4 Processors', 'NVMe SSD Storage', 'Instant Deployment'],
    buttonText: 'Launch VPS',
    buttonLink: '/vps',
    buttonClass: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-blue-500/25 hover:shadow-blue-500/40',
    hoverGradient: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
  },
  {
    icon: <Tag className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: 'Special Offers',
    description: 'Check out our daily deals and special promotions on domains, hosting, and VPS services. Don\'t miss out!',
    features: ['Daily Deals', 'Limited-Time Promotions', 'Bundle Discounts'],
    buttonText: 'View Offers',
    buttonLink: '/offers',
    buttonClass: 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-orange-500/25 hover:shadow-orange-500/40',
    hoverGradient: 'bg-gradient-to-br from-orange-500/10 to-yellow-500/10',
  },
];

const stats = [
  { icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />, value: '10K+', label: 'Happy Customers', color: 'from-green-500 to-emerald-500' },
  { icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />, value: '99.9%', label: 'Uptime', color: 'from-blue-500 to-cyan-500' },
  { icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />, value: '24/7', label: 'Support', color: 'from-purple-500 to-pink-500' },
  { icon: <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />, value: '5★', label: 'Rating', color: 'from-yellow-500 to-orange-500' },
];

const testimonials = [
  {
    name: 'Arjun Sharma',
    role: 'Gaming Community Owner',
    review: 'JXFRCloud™ has been amazing! My server runs smoothly with zero downtime. Best hosting service I\'ve used.',
    avatar: 'https://picsum.photos/seed/arjun/100/100',
    avatarHint: 'man portrait',
    avatarColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
    initials: 'AS',
  },
  {
    name: 'Priya Patel',
    role: 'Content Creator',
    review: 'Best hosting service in India. Great support and affordable pricing! Highly recommend to all gamers.',
    avatar: 'https://picsum.photos/seed/priya/100/100',
    avatarHint: 'woman portrait',
    avatarColor: 'bg-gradient-to-r from-pink-500 to-rose-500',
    initials: 'PP'
  },
  {
    name: 'Rohit Kumar',
    role: 'Server Administrator',
    review: 'Domain registration was instant and the hosting is blazing fast. Perfect for my Minecraft server!',
    avatar: 'https://picsum.photos/seed/rohit/100/100',
    avatarHint: 'man portrait',
    avatarColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    initials: 'RK'
  },
];


export default function Home() {
  const { data: session } = useSession();
  
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col font-sans text-foreground">
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-secondary/20 border border-secondary/50 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            <span className="text-xs sm:text-sm font-semibold text-white">✨ Premium Services for Indian Gamers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            Power Your{' '}
            <span
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse"
              style={{ filter: 'drop-shadow(0 0 1.5rem rgba(192, 132, 252, 0.5))' }}
            >
              Digital Dreams
            </span>
          </h1>
            
          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Premium domain registration, blazing-fast Minecraft hosting, and enterprise VPS solutions designed specifically for Indian users.
          </p>
            
          <div className="flex justify-center items-center px-4">
            <Button 
              onClick={scrollToServices}
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30 text-secondary-foreground px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 transform hover:scale-105 group">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:animate-pulse" />
                Get Started
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
            
          {!session && (
            <div className="mt-8 glassmorphism p-4 rounded-xl border max-w-md mx-auto">
                <p className="text-center text-muted-foreground text-sm mb-3">
                  🔐 Login with Discord to place orders and access all features
                </p>
                <Button onClick={() => signIn('discord')} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 text-white py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm">
                    <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThB1rWhRIveKHqi53wxpOQYDcQbaDqACNJstelPWVktR2AQUEvWGIZ-DxP&s=10" alt="Discord Logo" width={16} height={16} />
                    <span>Login with Discord</span>
                </Button>
            </div>
          )}
        </div>
      </section>

      <section id="services" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group service-card p-6 sm:p-8 rounded-3xl transition-all duration-500 relative overflow-hidden transform-gpu hover:scale-105 active:scale-[1.02]">
              <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500", service.hoverGradient)}></div>
              <div className="relative z-10 transition-colors duration-300 dark:group-hover:text-white">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg ${service.buttonClass} animate-pulse`}>
                  {service.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{service.title}</h3>
                <p className="text-muted-foreground text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed dark:group-hover:text-white/80">{service.description}</p>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-muted-foreground text-sm sm:text-base dark:group-hover:text-white/80">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-emerald-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg" className={`w-full sm:w-auto ${service.buttonClass} text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 group text-sm sm:text-base`}>
                  <Link href={service.buttonLink}>
                    {service.buttonText}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="glassmorphism p-4 sm:p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300">
               <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse`}>
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-card-foreground mb-1 sm:mb-2">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-lg sm:text-xl text-muted-foreground">Join thousands of satisfied customers who trust us</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="glassmorphism p-6 sm:p-8 rounded-2xl group hover:scale-105 transition-all duration-300 hover:border-yellow-500/30">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">"{testimonial.review}"</p>
              <div className="flex items-center">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${testimonial.avatarColor} rounded-full flex items-center justify-center mr-3 sm:mr-4`}>
                  <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="rounded-full" data-ai-hint={testimonial.avatarHint} />
                </div>
                <div>
                  <div className="font-semibold text-card-foreground text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Card className="glassmorphism p-8 sm:p-12 rounded-3xl hover:border-secondary/50 transition-all duration-300">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">Ready to Get Started?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed">
              Join thousands of satisfied customers who trust JXFRCloud™ for their digital needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 shadow-lg shadow-purple-500/30 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 transform hover:scale-105 group">
                <Link href="/hosting">
                  <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform" />
                  Start Hosting
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
