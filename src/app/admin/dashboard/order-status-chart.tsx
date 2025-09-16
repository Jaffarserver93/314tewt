"use client"

import * as React from "react"
import { Pie, PieChart, Sector } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

const chartData = [
  { status: "Confirmed", value: 275, fill: "var(--color-confirmed)" },
  { status: "Pending", value: 200, fill: "var(--color-pending)" },
  { status: "Cancelled", value: 100, fill: "var(--color-cancelled)" },
]

const chartConfig = {
  value: {
    label: "Orders",
  },
  confirmed: {
    label: "Confirmed",
    color: "hsl(var(--chart-1))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-2))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-3))",
  },
}

export default function OrderStatusChart() {
  const [activeStatus, setActiveStatus] =
    React.useState<keyof typeof chartConfig>("confirmed")

  return (
    <Card className="glassmorphism flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Order Status</CardTitle>
        <CardDescription>Distribution of confirmed, pending, and cancelled orders.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            />
            <ChartLegend content={<ChartLegendContent nameKey="status" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
