
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import type { TLD } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DomainsClientPage({ initialTlds }: { initialTlds: TLD[] }) {
  const [tlds, setTlds] = useState<TLD[]>(initialTlds);

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '-';
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Domain Extensions</h1>
          <p className="text-muted-foreground">Manage TLDs and their pricing.</p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add TLD
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All TLDs</CardTitle>
          <CardDescription>A list of all configurable top-level domains.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Extension</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Original Price</TableHead>
                <TableHead>Badges</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tlds.length > 0 ? tlds.map(tld => (
                <TableRow key={tld.id}>
                  <TableCell className="font-medium">{tld.name}</TableCell>
                  <TableCell>{formatCurrency(tld.price)}</TableCell>
                  <TableCell>{formatCurrency(tld.originalPrice)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      {tld.featured && <Badge variant="outline">Featured</Badge>}
                      {tld.trending && <Badge variant="outline">Trending</Badge>}
                      {tld.discount && <Badge variant="secondary">Discount</Badge>}
                      {tld.premium && <Badge>Premium</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No TLDs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
