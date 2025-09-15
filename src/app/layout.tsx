"use client";
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import AnimatedBackground from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <title>JXFRCloud™ - Power Your Digital Dreams</title>
        <meta name="description" content="Premium domain registration, blazing-fast Minecraft hosting, and enterprise VPS solutions for Indian users." />
      </head>
      <body className="font-body antialiased overflow-x-hidden">
        <SessionProvider>
          <AnimatedBackground />
          <Header />
          {children}
          <Footer />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
