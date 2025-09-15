import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Globe, Server, ToyBrick, TicketPercent } from "lucide-react";

const services = [
  {
    title: "Domain Registration",
    icon: Globe,
    gradient: "from-pink-500 to-rose-500",
    description: "Secure your online identity with a perfect domain name. Easy registration and management.",
    features: ["Free WHOIS Privacy", "DNS Management", "Domain Forwarding"],
    buttonText: "Find Your Domain"
  },
  {
    title: "Minecraft Hosting",
    icon: ToyBrick,
    gradient: "from-green-500 to-teal-500",
    description: "Experience lag-free gaming with our high-performance Minecraft servers.",
    features: ["DDoS Protection", "One-Click Modpacks", "24/7 Support"],
    buttonText: "Start Your Server"
  },
  {
    title: "VPS Hosting",
    icon: Server,
    gradient: "from-blue-500 to-cyan-500",
    description: "Powerful and scalable virtual private servers for your demanding projects.",
    features: ["Full Root Access", "SSD Storage", "99.9% Uptime SLA"],
    buttonText: "Configure VPS"
  },
  {
    title: "Special Offers",
    icon: TicketPercent,
    gradient: "from-orange-500 to-amber-500",
    description: "Check out our latest deals and get the best value for your money.",
    features: ["Student Discounts", "First-Time Offers", "Bundle Deals"],
    buttonText: "View Offers"
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-background/50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold">Our Services</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Everything you need to build your online presence.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <CardHeader className="p-0">
                <div className={`p-8 bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
                  <service.icon className="h-16 w-16 text-white/90" />
                </div>
              </CardHeader>
              <div className="p-6 flex flex-col flex-grow">
                <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                <CardDescription className="mt-2 flex-grow">{service.description}</CardDescription>
                <ul className="mt-6 space-y-2 text-sm text-foreground/80 flex-grow">
                  {service.features.map(feature => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <CardFooter className="p-6 mt-auto">
                <Button className="w-full" variant="outline">{service.buttonText}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
