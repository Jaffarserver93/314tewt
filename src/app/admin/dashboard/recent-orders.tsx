
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Order } from "@/lib/database";
import { format } from "date-fns";

interface RecentOrdersProps {
    orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
    const statusColors: { [key: string]: string } = {
        pending: 'border-yellow-500/30 bg-yellow-500/20 text-yellow-400',
        confirmed: 'border-green-500/30 bg-green-500/20 text-green-400',
        cancelled: 'border-red-500/30 bg-red-500/20 text-red-400',
    };

  return (
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>A list of the most recent orders.</CardDescription>
        </div>
        <Button size="sm" variant="outline" className="ml-auto gap-1">
          <FileDown className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.customer_info.firstName} {order.customer_info.lastName}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.customer_info.email}
                  </div>
                </TableCell>
                <TableCell className="capitalize">{order.type}</TableCell>
                <TableCell>
                  <Badge className={cn("text-xs capitalize", statusColors[order.status])} variant="outline">{order.status}</Badge>
                </TableCell>
                <TableCell>{format(new Date(order.created_at), "yyyy-MM-dd")}</TableCell>
                <TableCell className="text-right">{order.price}</TableCell>
              </TableRow>
            )) : (
               <TableRow>
                 <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No recent orders found.
                 </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
