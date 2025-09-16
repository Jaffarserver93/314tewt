"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldAlert, Users, LayoutDashboard, Menu, Search, Settings, Home, ArrowLeft, Gamepad2, Server, User, ShoppingCart, Globe, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { GlobalSearch } from "./GlobalSearch";


function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user as any;
  const userRole = user?.role;

  const navItems = useMemo(() => [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ['super admin', 'admin'] },
    { href: "/admin/order", label: "Orders", icon: ShoppingCart, roles: ['super admin', 'admin', 'manager', 'staff'] },
    { href: "/admin/users", label: "Users", icon: Users, roles: ['super admin', 'admin', 'manager'] },
    { href: "/admin/support", label: "Support", icon: LifeBuoy, roles: ['super admin', 'admin', 'manager', 'staff'] },
    { href: "/profile", label: "Profile", icon: User, roles: ['super admin', 'admin', 'manager', 'staff'] },
    { href: "/admin/domains", label: "Domains", icon: Globe, roles: ['super admin', 'admin', 'manager'] },
    { href: "/admin/minecraft", label: "Minecraft", icon: Gamepad2, roles: ['super admin', 'admin', 'manager'] },
    { href: "/admin/vps", label: "VPS", icon: Server, roles: ['super admin', 'admin', 'manager'] },
    { href: "/admin/settings", label: "Settings", icon: Settings, roles: ['super admin', 'admin'] },
  ].filter(item => userRole && item.roles.includes(userRole)), [userRole]);

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 border-r bg-background/80 backdrop-blur-xl z-40">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <Image
                  src="https://cdn.discordapp.com/attachments/1388084142595637291/1416149705779445862/05b5bc0e84997d92e62826cfce30b63a.webp?ex=68cb11b0&is=68c9c030&hm=acec0436cdbde593389ebfd757308ba83bb84bfff24b7f57b53e59e75eee1428&"
                  alt="JXFRCloud Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">JXFRCloud™</h1>
                <p className="text-sm text-muted-foreground">Admin Panel</p>
              </div>
            </Link>
          </div>
          <nav className="flex flex-col gap-2 p-4 flex-grow">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3",
                    pathname.startsWith(item.href) && item.href !== '/profile' && "bg-primary text-primary-foreground",
                    pathname === item.href && item.href === '/profile' && "bg-primary text-primary-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>
           <div className="p-4 border-t">
              <Link href="/">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Home</span>
                </Button>
              </Link>
           </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1 lg:ml-64 w-full lg:w-[calc(100%-16rem)]">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-xl shrink-0 sm:px-6">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="lg:hidden p-0 w-64 bg-background/80 backdrop-blur-xl">
              <SheetTitle className="sr-only">Admin Menu</SheetTitle>
              <div className="flex flex-col h-full">
                <div className="p-4 border-b flex justify-between items-center">
                  <Link href="/" className="flex items-center space-x-3 cursor-pointer">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                      <Image
                        src="https://cdn.discordapp.com/attachments/1388084142595637291/1416149705779445862/05b5bc0e84997d92e62826cfce30b63a.webp?ex=68cb11b0&is=68c9c030&hm=acec0436cdbde593389ebfd757308ba83bb84bfff24b7f57b53e59e75eee1428&"
                        alt="JXFRCloud Logo"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">JXFRCloud™</h1>
                    </div>
                  </Link>
                </div>
                <nav className="flex flex-col gap-2 p-4 flex-grow">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3",
                          pathname.startsWith(item.href) && item.href !== '/profile' && "bg-primary text-primary-foreground",
                          pathname === item.href && item.href === '/profile' && "bg-primary text-primary-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                </nav>
                 <div className="p-4 border-t">
                    <Link href="/">
                        <Button variant="outline" className="w-full justify-start gap-3">
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Home</span>
                        </Button>
                    </Link>
                 </div>
              </div>
            </SheetContent>
          </Sheet>
           <div className="w-full flex-1">
             <GlobalSearch />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="mx-auto w-full max-w-full">
             {children}
            </div>
        </main>
      </div>
    </div>
  );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession({
     required: true,
     onUnauthenticated() {
        // This can be a redirect to a login page
     }
  });

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading session...</p>
        </div>
      </div>
    );
  }
  
  const user = session?.user as any;
  const allowedRoles: (string | undefined)[] = ['staff', 'manager', 'admin', 'super admin'];

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md text-center glassmorphism p-8">
                <CardHeader>
                    <div className="mx-auto bg-red-500/20 rounded-full p-4 w-fit">
                        <ShieldAlert className="h-12 w-12 text-red-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold mt-4">Access Denied</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        You do not have the required permissions to view this page.
                        Please contact an administrator if you believe this is an error.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center mt-6">
                    <Button asChild variant="outline">
                      <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Home
                      </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground">
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </div>
  );
}
