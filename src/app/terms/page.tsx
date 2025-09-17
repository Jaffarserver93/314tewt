"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileText, UserCheck, Server, Ban, Shield, Handshake, CreditCard, Tag, BarChart, UserX, MessageSquare, AlertTriangle, Lock } from "lucide-react";
import { useState, useEffect } from "react";

const termsSections = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "1. Acceptable Use",
    content: "Servers must not be used for illegal, harmful, or unethical activities, including hosting prohibited content, resource abuse, or hate speech. Violations will lead to suspension or termination without refunds."
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "2. Account Security",
    content: "Keep your account safe and secure. Any actions taken under your account are your responsibility."
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "3. Payments and Refunds",
    content: "Payments are required for all paid services. All sales are final, and no refunds will be issued."
  },
  {
    icon: <Tag className="w-6 h-6" />,
    title: "4. Pricing and Negotiations",
    content: "Please avoid excessive bargaining, especially on VPS plans. Our pricing ensures quality and sustainability."
  },
  {
    icon: <BarChart className="w-6 h-6" />,
    title: "5. Service Uptime",
    content: "While we strive for 99% uptime, uninterrupted service cannot be guaranteed."
  },
  {
    icon: <Server className="w-6 h-6" />,
    title: "6. Data Responsibility and Backups",
    content: "You are responsible for backing up your data. Backup services are not guaranteed for free servers."
  },
  {
    icon: <UserX className="w-6 h-6" />,
    title: "7. Account Suspension and Termination",
    content: "We reserve the right to suspend or terminate your account for violations of our terms or failure to make payments."
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "8. Support Policy",
    content: "We provide support for active services only. Support queries must be submitted through approved channels, and response times may vary based on the nature of the request."
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: "9. Fraud Prevention",
    content: "We actively monitor for fraudulent activity. Any detected fraud will result in immediate termination of services."
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Terms of Service Updates",
    content: "We may revise these terms occasionally. Users will be notified of any significant updates."
  }
];


export default function TermsOfServicePage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);


  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          Last updated: {lastUpdated}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {termsSections.map((section, index) => (
          <Card key={index} className="glassmorphism">
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    {section.icon}
                </div>
                <CardTitle className="text-xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </CardContent>
          </Card>
        ))}
         <Card className="glassmorphism">
            <CardHeader>
                 <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at <a href="mailto:info@jxfrcloud.xyz" className="text-primary hover:underline">info@jxfrcloud.xyz</a>.
              </p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
