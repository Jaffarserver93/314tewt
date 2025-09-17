
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hourglass } from "lucide-react";

export default function OffersPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-20rem)] py-12 md:py-16">
      <Card className="glassmorphism text-center p-8 max-w-md w-full">
        <CardHeader>
          <div className="mx-auto w-fit bg-primary/10 p-4 rounded-full">
            <Hourglass className="h-12 w-12 text-primary animate-spin" />
          </div>
          <CardTitle className="text-3xl font-bold mt-6">
            Coming Soon!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">
            We're preparing some exciting offers and promotions for you. Please check back later!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
