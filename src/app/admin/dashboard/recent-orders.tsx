
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

const demoOrders = [
    {
    customer: {
      name: "Liam Johnson",
      email: "liam@example.com",
    },
    type: "Minecraft",
    status: "Confirmed",
    date: "2025-09-15",
    amount: "₹260/mo",
  },
  {
    customer: {
      name: "Olivia Smith",
      email: "olivia@example.com",
    },
    type: "Vps",
    status: "Pending",
    date: "2025-09-14",
    amount: "₹520/mo",
  },
    {
    customer: {
      name: "Noah Williams",
      email: "noah@example.com",
    },
    type: "Domain",
    status: "Cancelled",
    date: "2025-09-13",
    amount: "₹199/year",
  },
  {
    customer: {
      name: "Emma Brown",
      email: "emma@example.com",
    },
    type: "Minecraft",
    status: "Confirmed",
    date: "2025-09-12",
    amount: "₹260/mo",
  },
  {
    customer: {
      name: "James Jones",
      email: "james@example.com",
    },
    type: "Vps",
    status: "Pending",
    date: "2025-09-11",
    amount: "₹520/mo",
  },
]

export default function RecentOrders() {
    const statusColors: { [key: string]: string } = {
        Pending: 'border-yellow-500/30 bg-yellow-500/20 text-yellow-400',
        Confirmed: 'border-green-500/30 bg-green-500/20 text-green-400',
        Cancelled: 'border-red-500/30 bg-red-500/20 text-red-400',
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
            {demoOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-medium">{order.customer.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.customer.email}
                  </div>
                </TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>
                  <Badge className={cn("text-xs capitalize", statusColors[order.status])} variant="outline">{order.status}</Badge>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell className="text-right">{order.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
