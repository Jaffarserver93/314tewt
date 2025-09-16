
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Globe, Star, TrendingUp, Tag, Flame, MessageCircle, ExternalLink, ShieldCheck, LifeBuoy, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { TLD, DomainFeature } from '@/lib/types';
import DomainPaymentForm from './DomainPaymentForm';
import { Card } from '@/components/ui/card';

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
  const router = useRouter();
  const { theme } = useTheme();
  const { data: session, status } = useSession();
  
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{domain: string, tld: string, price: number, originalPrice?: number, available: boolean}[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<{domain: string, tld: TLD} | null>(null);

  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDomainSelect = (domain: {domain: string, tld: string, price: number, originalPrice?: number, available: boolean}) => {
    if (!isAuthenticated) {
        signIn('discord');
        return;
    }
    const fullTld = initialTlds.find(t => t.name === domain.tld);
    if(fullTld){
        setSelectedDomain({domain: domain.domain, tld: fullTld});
    }
  };

  const handleBackFromPayment = () => {
    setSelectedDomain(null);
  };
  
  const getThemeClasses = () => {
    const currentTheme = mounted ? theme : 'dark';
    switch (currentTheme) {
      case 'light':
        return {
          bg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
          card: 'bg-white/80 backdrop-blur-xl border-white/40',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          pinkButton: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
          searchBg: 'bg-white/90',
          searchBorder: 'border-gray-300',
          domainCard: 'bg-pink-50/80 backdrop-blur-xl border-pink-200',
          domainBorder: 'border-pink-300',
          shadow: 'shadow-lg shadow-pink-200/50 hover:shadow-pink-300/60'
        };
      case 'glass':
        return {
          bg: 'bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          button: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 backdrop-blur-sm',
          pinkButton: 'bg-gradient-to-r from-pink-500/80 to-rose-500/80 hover:from-pink-600/80 hover:to-rose-600/80',
          searchBg: 'bg-white/5',
          searchBorder: 'border-white/20',
          domainCard: 'bg-pink-500/5 backdrop-blur-xl border-pink-500/20',
          domainBorder: 'border-pink-500/30',
          shadow: 'shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40'
        };
      default: // dark
        return {
          bg: 'bg-background',
          card: 'glassmorphism',
          text: 'text-foreground',
          textSecondary: 'text-muted-foreground',
          textMuted: 'text-muted-foreground',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          pinkButton: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
          searchBg: 'bg-white/10',
          searchBorder: 'border-border',
          domainCard: 'glassmorphism hover:border-primary/50',
          domainBorder: 'border-border',
          shadow: 'shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40'
        };
    }
  };

  const themeStyles = getThemeClasses();
  
  const filteredTLDs = useMemo(() => {
    return initialTlds.filter(tld =>
      tld.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, initialTlds]);

  const getTagInfo = (tld: TLD) => {
    if (tld.featured) {
      return {
        icon: <Star className="w-3 h-3" />,
        text: "Popular",
        bgClass: "bg-gradient-to-r from-yellow-500 to-orange-500",
        pulseClass: "animate-pulse"
      };
    }
    if (tld.trending) {
      return {
        icon: <TrendingUp className="w-3 h-3" />,
        text: "Trending",
        bgClass: "bg-gradient-to-r from-green-500 to-emerald-500",
        pulseClass: "animate-pulse"
      };
    }
    if (tld.discount) {
      return {
        icon: <Tag className="w-3 h-3" />,
        text: "Discount",
        bgClass: "bg-gradient-to-r from-red-500 to-pink-500",
        pulseClass: "animate-pulse"
      };
    }
    if (tld.premium) {
      return {
        icon: <Flame className="w-3 h-3" />,
        text: "Premium",
        bgClass: "bg-gradient-to-r from-purple-500 to-indigo-500",
        pulseClass: "animate-pulse"
      };
    }
    return null;
  };

  const handleDomainSearch = () => {
    if (!searchQuery.trim()) {
        alert("Please enter a domain name to search.");
        return;
    };
    
    const results = initialTlds.map(ext => ({
      domain: searchQuery.toLowerCase().replace(/\s+/g, ''),
      tld: ext.name,
      price: ext.price,
      originalPrice: ext.originalPrice,
      available: Math.random() > 0.3 // Simulating availability check
    }));
    
    setSearchResults(results);
  };
  
  const AuthSection = () => {
    return (
       <div className={`${themeStyles.card} text-center py-12 border rounded-2xl`}>
          <div className={`text-6xl mb-4`}>🔐</div>
          <h3 className={`text-xl font-semibold ${themeStyles.text} mb-2`}>Please Log In</h3>
          <p className={`${themeStyles.textMuted} mb-4`}>
              Log in with Discord to search for and register domains.
          </p>
          <Button onClick={() => signIn('discord')} className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center space-x-2">
              <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThB1rWhRIveKHqi53wxpOQYDcQbaDqACNJstelPWVktR2AQUEvWGIZ-DxP&s=10" alt="Discord Logo" width={16} height={16} />
              <span>Login with Discord</span>
          </Button>
      </div>
    );
  };

  if (!mounted) {
    return null;
  }
  
  if (selectedDomain) {
    return <DomainPaymentForm selectedDomain={selectedDomain} onBack={handleBackFromPayment} />;
  }

  return (
    <div className={`${themeStyles.bg} font-sans text-foreground`}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className={`flex items-center ${themeStyles.textSecondary} hover:text-primary transition-colors mb-8`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center mb-16">
            <h1 className={`text-5xl md:text-6xl font-bold ${themeStyles.text} mb-6`}>
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Domain
              </span>
            </h1>
            <p className={`text-xl ${themeStyles.textSecondary} mb-12 max-w-3xl mx-auto`}>
              Secure your digital identity with premium domain extensions. Instant activation, competitive pricing, and full DNS control.
            </p>
          </div>
          
          {status === "loading" ? null : !isAuthenticated ? (
            <AuthSection />
          ) : (
            <>
            {/* Domain Search */}
            <div className={`${themeStyles.card} max-w-2xl mx-auto p-6 rounded-2xl border ${themeStyles.shadow} mb-12`}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeStyles.textMuted} w-5 h-5`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter your domain name..."
                    className={`w-full pl-12 pr-4 py-4 ${themeStyles.searchBg} ${themeStyles.searchBorder} border rounded-xl ${themeStyles.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300`}
                    onKeyPress={(e) => e.key === 'Enter' && handleDomainSearch()}
                  />
                </div>
                <Button
                  onClick={handleDomainSearch}
                  className={`${themeStyles.pinkButton} text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center`}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className={`${themeStyles.card} max-w-4xl mx-auto p-6 rounded-2xl border mb-12`}>
                <h3 className={`text-2xl font-bold ${themeStyles.text} mb-6`}>Search Results for "{searchQuery}"</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((result, index) => (
                    <div key={index} className={`${themeStyles.domainCard} p-4 rounded-xl border flex items-center justify-between`}>
                      <div className="flex items-center">
                        <Globe className="w-6 h-6 text-primary mr-3" />
                        <div>
                          <div className={`font-semibold ${themeStyles.text}`}>{result.domain}{result.tld}</div>
                          <div className={`text-sm ${result.available ? 'text-green-400' : 'text-red-400'}`}>
                            {result.available ? 'Available' : 'Taken'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${themeStyles.text}`}>₹{result.price}/year</div>
                        {result.available && (
                          <Button
                            variant="link"
                            onClick={() => handleDomainSelect(result)}
                            className="text-primary hover:text-primary/80 h-auto p-0 text-sm font-semibold"
                          >
                            Select
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <section className="py-20 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                      <h2 className={`text-4xl md:text-5xl font-bold ${themeStyles.text} mb-6`}>
                      Domain Extensions
                      </h2>
                      <p className={`text-xl ${themeStyles.textSecondary} max-w-3xl mx-auto`}>
                      Choose from our wide selection of domain extensions with competitive pricing and instant activation
                      </p>
                  </div>

                  <div className={`max-w-2xl mx-auto mb-12 ${themeStyles.card} ${themeStyles.domainBorder} border rounded-2xl p-6 ${themeStyles.shadow} transition-all duration-300`}>
                      <div className="relative">
                      <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeStyles.textMuted} w-5 h-5`} />
                      <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search domain extensions..."
                          className={`w-full pl-12 pr-4 py-4 ${themeStyles.searchBg} ${themeStyles.searchBorder} border rounded-xl ${themeStyles.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300`}
                      />
                      </div>
                      {searchTerm && (
                      <div className={`mt-4 text-sm ${themeStyles.textMuted}`}>
                          Found {filteredTLDs.length} extension{filteredTLDs.length !== 1 ? 's' : ''} matching "{searchTerm}"
                      </div>
                      )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {filteredTLDs.map((tld, index) => {
                      const tagInfo = getTagInfo(tld);
                      
                      return (
                          <div
                          key={tld.name}
                          className={`group relative ${themeStyles.domainCard} border rounded-xl p-6 text-center hover:scale-105 transition-all duration-500 ${themeStyles.shadow} cursor-pointer overflow-hidden`}
                          style={{ animationDelay: `${index * 50}ms` }}
                          >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {tagInfo && (
                              <div className={`absolute top-2 right-2 ${tagInfo.bgClass} text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${tagInfo.pulseClass} shadow-lg`}>
                              {tagInfo.icon}
                              <span className="font-semibold">{tagInfo.text}</span>
                              </div>
                          )}

                          <div className={`relative text-2xl font-bold ${themeStyles.text} mb-3 group-hover:text-primary transition-colors duration-300`}>
                              {tld.name}
                          </div>

                          <div className={`relative text-lg font-semibold ${themeStyles.textSecondary} mb-4`}>
                            {tld.discount && tld.originalPrice ? (
                              <span className="flex items-center justify-center gap-2">
                                <span className="line-through text-base">₹{tld.originalPrice}</span>
                                <span className="text-xl">₹{tld.price}</span>
                              </span>
                            ) : (
                              <span>₹{tld.price}</span>
                            )}
                            <span className="text-sm">/year</span>
                          </div>

                          <div className={`relative text-xs ${themeStyles.textMuted} space-y-1`}>
                              <div>✓ Free DNS Management</div>
                              <div>✓ Privacy Protection</div>
                              <div>✓ 24/7 Support</div>
                          </div>

                          <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/30 transition-all duration-500"></div>
                          
                          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg shadow-primary/20"></div>
                          </div>
                      );
                      })}
                  </div>

                  {filteredTLDs.length === 0 && searchTerm && (
                      <div className={`text-center py-12 ${themeStyles.card} ${themeStyles.domainBorder} border rounded-2xl`}>
                      <div className={`text-6xl mb-4`}>🔍</div>
                      <h3 className={`text-xl font-semibold ${themeStyles.text} mb-2`}>No extensions found</h3>
                      <p className={`${themeStyles.textMuted}`}>
                          Try searching for a different extension or clear your search to see all available options.
                      </p>
                      <Button
                          onClick={() => setSearchTerm('')}
                          className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
                      >
                          Show All Extensions
                      </Button>
                      </div>
                  )}
                </div>
            </section>
            
            <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className={`text-3xl sm:text-4xl font-bold ${themeStyles.text}`}>Everything You Need</h2>
                  <p className={`text-lg ${themeStyles.textMuted} mt-2`}>All our domain registrations come with these premium features at no extra cost.</p>
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
            </>
          )}

          <div className={`mt-16 text-center ${themeStyles.card} ${themeStyles.domainBorder} border rounded-2xl p-8 ${themeStyles.shadow}`}>
            <h3 className={`text-2xl font-bold ${themeStyles.text} mb-4`}>
              Can't find the perfect extension?
            </h3>
            <p className={`${themeStyles.textSecondary} mb-6`}>
              Contact our domain experts for personalized recommendations and bulk pricing options.
            </p>
            <Button
              asChild
              className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/25"
            >
               <a 
                href="https://discord.gg/1388084142075547680"
                target="_blank"
                rel="noopener noreferrer"
               >
                 <MessageCircle className="w-5 h-5 mr-2" />
                 Contact Domain Expert
                 <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
