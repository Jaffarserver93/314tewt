
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

const demoOrders = [
  {
    customer: {
      name: "jaffar.king King",
      email: "mohammedjaffar2288@gmail.com",
    },
    type: "Minecraft",
    status: "Pending",
    date: "2025-09-13",
    amount: "₹260/mo",
  },
  {
    customer: {
      name: "jaffar.king King",
      email: "mohammedjaffar2288@gmail.com",
    },
    type: "Vps",
    status: "Pending",
    date: "2025-09-13",
    amount: "₹520/mo",
  },
  {
    customer: {
      name: "jaffar.king King",
      email: "mohammedjaffar2288@gmail.com",
    },
    type: "Minecraft",
    status: "Pending",
    date: "2025-09-13",
    amount: "₹260/mo",
  },
  {
    customer: {
      name: "jaffar.king J",
      email: "mohammedjaffar2288@gmail.com",
    },
    type: "Domain",
    status: "Pending",
    date: "2025-09-13",
    amount: "₹199/year",
  },
]

export default function RecentOrders() {
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
                  <Badge className="text-xs" variant="outline">{order.status}</Badge>
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
