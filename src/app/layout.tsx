
"use client";
import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Toaster as ShadToaster } from '@/components/ui/toaster';
import './globals.css';
import AnimatedBackground from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'react-hot-toast';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <title>JXFRCloud™ - Power Your Digital Dreams</title>
        <meta name="description" content="Premium domain registration, blazing-fast Minecraft hosting, and enterprise VPS solutions for Indian users." />
      </head>
      <body className="font-body antialiased overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <AnimatedBackground />
            <Header />
            {children}
            <Footer />
            <ShadToaster />
            <Toaster position="bottom-center" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
