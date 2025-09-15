import { Rocket } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-center gap-4 h-24 md:h-28 md:flex-row max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 px-8 md:px-0">
          <div className="flex items-center gap-2">
             <Rocket className="h-6 w-6 text-primary" />
             <p className="text-center text-sm leading-loose md:text-left font-headline font-bold">JXFRCloud™</p>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} JXFRCloud. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
