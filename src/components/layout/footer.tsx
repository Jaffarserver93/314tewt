"use client";

import Link from "next/link";
import { Heart, MessageCircle, ExternalLink } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return null;
  }
  
  return (
    <footer className="glassmorphism border-t border-border/10 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                 <Image   
                  src="https://cdn.discordapp.com/attachments/1388084142595637291/1416149705779445862/05b5bc0e84997d92e62826cfce30b63a.webp?ex=68cb11b0&is=68c9c030&hm=acec0436cdbde593389ebfd757308ba83bb84bfff24b7f57b53e59e75eee1428&"
                  alt="JXFRCloud Logo"   
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"  
                />
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">JXFRCloud™</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Premium hosting solutions designed for Indian gamers and businesses.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Services</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors"><Link href="/domains">Domain Registration</Link></li>
              <li className="hover:text-primary transition-colors"><Link href="/hosting">Minecraft Hosting</Link></li>
              <li className="hover:text-primary transition-colors"><Link href="#">VPS Hosting</Link></li>
              <li className="hover:text-primary transition-colors"><Link href="/support">24/7 Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors"><Link href="/about">About Us</Link></li>
              <li className="hover:text-primary transition-colors"><Link href="/contact">Contact</Link></li>
              <li className="hover:text-primary transition-colors"><Link href="/terms">Terms of Service</Link></li>
              <li className="hover:text-primary transition-colors"><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Connect</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <a href="https://discord.gg/1388084142075547680" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center">
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Discord Server
                  <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3 ml-1" />
                </a>
              </li>
              <li className="hover:text-primary transition-colors"><Link href="/status">Status Page</Link></li>
              <li className="hover:text-primary transition-colors"><Link href="/support">Support Tickets</Link></li>
              <li className="hover:text-primary transition-colors"><Link href="#">Documentation</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/10 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} JXFRCloud™. All rights reserved. Made with <Heart className="w-3 h-3 sm:w-4 sm:h-4 inline text-red-400" /> for Indian Gamers.</p>
          <p className="text-sm">Powered By JXFR</p>
        </div>
      </div>
    </footer>
  );
}
