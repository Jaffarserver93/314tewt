
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, MessageCircle, ExternalLink, User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/hosting", label: "Hosting" },
  { href: "#", label: "VPS" },
  { href: "/support", label: "Support" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user as any;
  const loading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  const allowedAdminRoles = ['super admin', 'admin', 'manager'];
  const canAccessAdminPanel = user?.role && allowedAdminRoles.includes(user.role);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdminPage = pathname.startsWith('/admin');
  if (isAdminPage) {
    return null;
  }
  
  const AuthSection = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      )
    }

    if (user) {
       return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  {user.image && <AvatarImage src={user.image} alt={user.name || 'User'} />}
                  <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {canAccessAdminPanel && (
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
       )
    }

    return (
        <Button onClick={() => signIn('discord')} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2">
            <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThB1rWhRIveKHqi53wxpOQYDcQbaDqACNJstelPWVktR2AQUEvWGIZ-DxP&s=10" alt="Discord Logo" width={16} height={16} />
            <span>Login</span>
        </Button>
    )
  }

  const MobileAuthSection = () => {
    if (loading) {
        return <Skeleton className="h-8 w-full" />
    }
    if (user) {
      return (
        <div className="flex items-center justify-between py-2">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {user.image && <AvatarImage src={user.image} alt={user.name || 'User'} />}
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground font-medium">{user.name}</span>
              </div>
              <span className="text-xs text-muted-foreground/80 pl-10">{user.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { signOut({ callbackUrl: '/' }); setIsOpen(false); }}>Logout</Button>
        </div>
      );
    }

    return (
         <Button onClick={() => {signIn('discord'); setIsOpen(false)}} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 w-full">
            <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThB1rWhRIveKHqi53wxpOQYDcQbaDqACNJstelPWVktR2AQUEvWGIZ-DxP&s=10" alt="Discord Logo" width={16} height={16} />
            <span>Login with Discord</span>
        </Button>
    )
  }

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
       (isScrolled || isOpen) ? "header-glass border-b border-border/10" : "bg-transparent"
    )}>
      <div className="px-4 sm:px-6 lg:px-8 container max-w-7xl mx-auto">
        <div className="flex justify-between items-center py-4">
        
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <Image   
                  src="https://cdn.discordapp.com/attachments/1388084142595637291/1416149705779445862/05b5bc0e84997d92e62826cfce30b63a.webp?ex=68cb11b0&is=68c9c030&hm=acec0436cdbde593389ebfd757308ba83bb84bfff24b7f57b53e59e75eee1428&"   
                  alt="JXFRCloud Logo"   
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-foreground">JXFRCloud™</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Premium Hosting Solutions</p>
              </div>
          </Link>
        
           <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "hover:text-primary transition-colors font-medium",
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
             {isAuthenticated && (
              <Link
                href="/profile"
                className={cn(
                  "hover:text-primary transition-colors font-medium",
                  pathname === "/profile" ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                Profile
              </Link>
            )}
            <a href="https://discord.gg/1388084142075547680" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              Discord
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
            
            <AuthSection />

            <ThemeToggle />
          </nav>

          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg"
            >
              {isOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </div>
        
        {isOpen && (
           <div className={cn(
             "lg:hidden -mx-4 -mb-4 px-4",
             (isScrolled || isOpen) && "bg-transparent"
           )}>
             <nav className="flex flex-col space-y-4 py-4">
              {navLinks.map((link) => (
                 <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "hover:text-primary transition-colors font-medium text-left py-2",
                     pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "hover:text-primary transition-colors font-medium text-left py-2",
                      pathname === "/profile" ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    Profile
                  </Link>
              )}
               <a href="https://discord.gg/1388084142075547680" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center py-2" onClick={() => setIsOpen(false)}>
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Discord
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>

                {canAccessAdminPanel && (
                <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center py-2">
                  <Shield className="w-4 h-4 mr-1" />
                  Admin Panel
                </Link>
                )}

                <MobileAuthSection />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
