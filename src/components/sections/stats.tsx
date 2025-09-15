"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Gauge, LifeBuoy, Star } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const stats = [
  {
    value: 12000,
    label: "Happy Customers",
    icon: Users,
    gradient: "from-pink-500 to-rose-500",
    suffix: "+"
  },
  {
    value: 99.9,
    label: "Uptime",
    icon: Gauge,
    gradient: "from-green-500 to-teal-500",
    suffix: "%"
  },
  {
    value: 24,
    label: "Support",
    icon: LifeBuoy,
    gradient: "from-blue-500 to-cyan-500",
    suffix: "/7"
  },
  {
    value: 4.9,
    label: "Rating",
    icon: Star,
    gradient: "from-orange-500 to-amber-500",
    suffix: "/5"
  },
];

function AnimatedCounter({ to, isFloat = false }: { to: number, isFloat?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const end = to;
          if (start === end) return;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentVal = progress * end;
            setCount(isFloat ? parseFloat(currentVal.toFixed(1)) : Math.floor(currentVal));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
               setCount(end);
            }
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [to, isFloat]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function Stats() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center p-6 rounded-3xl">
              <CardContent className="p-0 flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full bg-gradient-to-br ${stat.gradient}`}>
                  <stat.icon className="h-8 w-8 text-white/90" />
                </div>
                <div className="text-4xl font-bold font-headline">
                  <AnimatedCounter to={stat.value} isFloat={!Number.isInteger(stat.value)} />
                  <span>{stat.suffix}</span>
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
