"use client";

import { Rocket } from "lucide-react";
import Link from 'next/link';
import { usePathname } from "next/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith('/admin');
  if (isAdminPage) {
    return null;
  }

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 h-24 md:h-28 md:flex-row max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 px-8 md:px-0">
          <div className="flex items-center gap-2">
             <Rocket className="h-6 w-6 text-primary" />
             <p className="text-center text-sm leading-loose md:text-left font-headline font-bold">JXFRCloud™</p>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} JXFRCloud. All rights reserved.
          </p>
        </div>
        <nav className="flex gap-4">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
