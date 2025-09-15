"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Flame, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { DiscordIcon } from "@/components/icons/discord";

type HeroProps = {
  headline: string;
  subtext: string;
};

export function Hero({ headline, subtext }: HeroProps) {
  const { isLoggedIn, login } = useAuth();

  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-2xl max-h-2xl bg-primary/10 rounded-full blur-3xl" aria-hidden="true"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[50vw] h-[50vw] max-w-2xl max-h-2xl bg-accent/10 rounded-full blur-3xl" aria-hidden="true"></div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 gap-12 items-center">
          <div className="text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-br from-primary via-purple-400 to-accent bg-clip-text text-transparent text-glow pb-4">
              {headline}
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-foreground/80 sm:text-xl">
              {subtext}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-300">
                <Flame className="mr-2 h-5 w-5" />
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {!isLoggedIn && (
              <div className="mt-12 flex justify-center">
                 <Card className="max-w-sm bg-background/50 backdrop-blur-sm border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2">
                            <DiscordIcon className="h-6 w-6" /> Join our Community
                        </CardTitle>
                        <CardDescription>Login with Discord to get started.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={login} className="w-full" variant="outline">
                            <DiscordIcon className="mr-2 h-5 w-5" />
                            Login with Discord
                        </Button>
                    </CardContent>
                 </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
