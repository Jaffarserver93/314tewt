
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileText, UserCheck, Server, Ban, Shield, Handshake } from "lucide-react";
import { useState, useEffect } from "react";

const termsSections = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "1. Acceptance of Terms",
    content: "By accessing and using the services provided by JXFRCloud™, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services."
  },
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: "2. User Account",
    content: "You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password."
  },
  {
    icon: <Server className="w-6 h-6" />,
    title: "3. Service Provision",
    content: "We provide various hosting and domain registration services. We reserve the right to suspend or terminate services at any time for any reason, including but not limited to, violation of our Acceptable Use Policy."
  },
  {
    icon: <Ban className="w-6 h-6" />,
    title: "4. Prohibited Uses",
    content: "You are prohibited from using our services for any illegal or unauthorized purpose. This includes, but is not limited to, distributing malware, hosting phishing sites, sending spam, or engaging in any activity that disrupts our services or other users."
  },
  {
    icon: <Scale className="w-6 h-6" />,
    title: "5. Limitation of Liability",
    content: "In no event shall JXFRCloud™, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "6. Indemnification",
    content: "You agree to defend, indemnify and hold harmless JXFRCloud™ and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses."
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "7. Changes to Terms",
    content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms of Service on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms."
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
