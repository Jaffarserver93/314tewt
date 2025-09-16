"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function GlobalSearch() {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="w-full bg-background pl-10"
      />
    </div>
  );
}
