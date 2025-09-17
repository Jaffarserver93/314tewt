
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Fingerprint, Database, GitBranch, Cookie, UserCheck, Baby, FileText, Scale } from "lucide-react";
import { useState, useEffect } from "react";

const policySections = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Introduction",
    content: "This Privacy Policy details how JXFRCloud™ ('we', 'us', 'our') collects, uses, protects, and handles your personal information when you use our website and services. Your privacy is of utmost importance to us, and we are committed to safeguarding it. By using our services, you agree to the collection and use of information in accordance with this policy."
  },
  {
    icon: <Fingerprint className="w-6 h-6" />,
    title: "Information We Collect",
    content: "We collect several types of information for various purposes to provide and improve our services. This includes: Personal Identification Information (name, email address, Discord username) collected via Discord OAuth, order forms, and contact submissions. We also gather Usage Data, such as your IP address and browser type, and use Cookies to track activity on our site."
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "How We Use Your Information",
    content: "Your information is used to: provide and maintain our services, process your transactions and manage orders, communicate with you regarding your account or for support purposes, improve our website and service offerings, and to monitor for and prevent fraudulent activity."
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: "Information Sharing and Disclosure",
    content: "We do not sell your personal information. We may share your information with trusted third-party service providers to facilitate our services (e.g., payment processors, domain registrars) or to comply with legal obligations. These third parties are obligated to protect your information and use it only for the purposes for which it was disclosed."
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Data Security",
    content: "We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee its absolute security."
  },
  {
    icon: <Cookie className="w-6 h-6" />,
    title: "Cookies and Tracking",
    content: "We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
  },
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: "Your Data Protection Rights",
    content: "Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, or delete the information we hold about you. Please contact us to exercise these rights."
  },
    {
    icon: <Scale className="w-6 h-6" />,
    title: "Data Retention",
    content: "We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies."
  },
  {
    icon: <Baby className="w-6 h-6" />,
    title: "Children's Privacy",
    content: "Our services are not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you become aware that a child has provided us with personal information, please contact us."
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Changes to This Privacy Policy",
    content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes."
  }
];


export default function PrivacyPolicyPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);


  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-lg text-foreground/80">
          Last updated: {lastUpdated}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {policySections.map((section, index) => (
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
                If you have any questions about this Privacy Policy, you can contact us at <a href="mailto:info@jxfrcloud.xyz" className="text-primary hover:underline">info@jxfrcloud.xyz</a>.
              </p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
