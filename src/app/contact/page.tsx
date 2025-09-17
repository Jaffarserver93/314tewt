
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Send, ExternalLink, Info, Users } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Get in Touch
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          We're here to help with any questions you may have. Reach out to us and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Info className="w-6 h-6 text-primary" />
                Contact Information
            </CardTitle>
            <CardDescription>
              Reach out to us via email or join our Discord community for faster support.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary"/>
                </div>
                <div>
                    <h3 className="font-semibold">General Inquiries</h3>
                    <a href="mailto:info@jxfrcloud.xyz" className="text-muted-foreground hover:text-primary transition-colors">info@jxfrcloud.xyz</a>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary"/>
                </div>
                <div>
                    <h3 className="font-semibold">Support & Billing</h3>
                    <a href="mailto:contact@jxfrcloud.xyz" className="text-muted-foreground hover:text-primary transition-colors">contact@jxfrcloud.xyz</a>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary"/>
                </div>
                <div>
                    <h3 className="font-semibold">Discord Community</h3>
                    <a href="https://discord.gg/1388084142075547680" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                        Join our Discord Server <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Send className="w-6 h-6 text-primary" />
                Send us a Message
            </CardTitle>
             <CardDescription>
              Fill out the form below and we'll get back to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input placeholder="First Name" />
                    <Input placeholder="Last Name" />
                </div>
                <Input type="email" placeholder="Your Email Address" />
                <Input placeholder="Subject" />
                <Textarea placeholder="Your message..." rows={5} />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2" disabled>
                    Send Message (Soon) <Send className="w-4 h-4" />
                </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
