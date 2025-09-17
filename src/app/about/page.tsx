
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, BookOpen, Dot, Gift, Music, Gamepad2, ShieldCheck, Users } from "lucide-react";

const infoPoints = [
  {
    icon: <Gamepad2 className="w-6 h-6 text-primary" />,
    text: "This server offers free and paid services for game hosting, and you can buy our paid services at an affordable price."
  },
  {
    icon: <Gift className="w-6 h-6 text-primary" />,
    text: "We regularly host Giveaways and engaging Talkshows with exciting prizes up for grabs."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    text: "Our community is known for its friendliness, non-toxic environment, anti-spam measures, and dedicated moderation by the JXFRCloud Staff Team."
  },
  {
    icon: <Music className="w-6 h-6 text-primary" />,
    text: "Dive into the fun with various entertaining Activities and groove to the beats in our Music channels. Interact with bots tailored for your enjoyment!"
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    text: "You'll find all essential information about our community and services here."
  }
]

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          About JXFRCloud™
        </h1>
        <Card className="max-w-3xl mx-auto glassmorphism p-6 mt-6">
            <div className="flex items-center justify-center gap-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <p className="text-lg text-foreground/90">
                    Welcome to the official community of JXFRCloud! We organize regular events and special offers for our members to enjoy.
                </p>
            </div>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="glassmorphism">
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                </div>
                <CardTitle className="text-2xl">Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {infoPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-primary/10 hover:bg-primary/5 transition-colors">
                        <div className="flex-shrink-0 mt-1">
                            {point.icon}
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            {point.text}
                        </p>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
