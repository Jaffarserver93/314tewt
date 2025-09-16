
"use client"

import { Pie, PieChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { ChartConfig } from "@/components/ui/chart"


interface OrderStatusDistributionChartProps {
  confirmed: number;
  pending: number;
  cancelled: number;
}

export function OrderStatusDistributionChart({ confirmed, pending, cancelled }: OrderStatusDistributionChartProps) {
  const chartData = [
    { status: "Confirmed", count: confirmed, fill: "hsl(var(--chart-2))" },
    { status: "Pending", count: pending, fill: "hsl(var(--chart-1))" },
    { status: "Cancelled", count: cancelled, fill: "hsl(0, 84.2%, 60.2%)" },
  ]

  const chartConfig = {
    count: {
      label: "Count",
    },
    Confirmed: {
      label: "Confirmed",
      color: "hsl(var(--chart-2))",
    },
    Pending: {
      label: "Pending",
      color: "hsl(var(--chart-1))",
    },
    Cancelled: {
        label: "Cancelled",
        color: "hsl(0, 84.2%, 60.2%)",
    },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="status"
          innerRadius={60}
          strokeWidth={5}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
         <ChartLegend
            content={<ChartLegendContent nameKey="status" />}
            className="-translate-y-[20px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
          />
      </PieChart>
    </ChartContainer>
  )
}
