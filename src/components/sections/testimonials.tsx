import Image from "next/image";
import { Star } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const testimonials = [
  {
    id: "testimonial-1",
    name: "Priya Sharma",
    role: "Indie Game Developer",
    review: "JXFRCloud's Minecraft hosting is a game-changer. The performance is incredible, and their support team is always ready to help, even with complex modpack issues. Truly the best for Indian gamers!"
  },
  {
    id: "testimonial-2",
    name: "Rohan Patel",
    role: "Startup Founder",
    review: "The VPS solutions from JXFRCloud are both powerful and affordable. We scaled our operations seamlessly without any downtime. Their 99.9% uptime is not just a promise, it's a reality."
  },
  {
    id: "testimonial-3",
    name: "Anjali Singh",
    role: "Blogger & Entrepreneur",
    review: "Registering my domain was a breeze. I love the free WHOIS privacy, and the control panel is so intuitive. JXFRCloud has my highest recommendation for anyone starting their online journey."
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold">Loved by users worldwide</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Don't just take our word for it. Here's what our customers have to say.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => {
            const imageData = PlaceHolderImages.find(img => img.id === testimonial.id);
            return (
              <div 
                key={testimonial.id}
                className="rounded-3xl p-6 bg-white/5 dark:bg-white/10 backdrop-blur-lg border border-white/10 dark:border-white/20 shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-primary/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground/90 italic">"{testimonial.review}"</p>
                <div className="mt-6 flex items-center gap-4">
                  {imageData && (
                    <Image
                      src={imageData.imageUrl}
                      alt={`Avatar of ${testimonial.name}`}
                      width={48}
                      height={48}
                      className="rounded-full"
                      data-ai-hint={imageData.imageHint}
                    />
                  )}
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
