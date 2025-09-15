"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import { DiscordIcon } from "@/components/icons/discord";
import { LogOut, Rocket } from "lucide-react";

export function Header() {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline">JXFRCloud™</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={login}>
                <DiscordIcon className="mr-2 h-5 w-5" />
                Login with Discord
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
