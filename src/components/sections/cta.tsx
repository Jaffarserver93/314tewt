import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Cta() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden rounded-3xl border-primary/20 bg-primary/5">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" aria-hidden="true"></div>
           <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50" aria-hidden="true"></div>
          <CardContent className="relative p-10 sm:p-16 text-center">
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
              Join thousands of satisfied customers who trust JXFRCloud™ for their digital needs.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                className="h-14 px-10 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-300 rounded-full"
              >
                Start Hosting
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
