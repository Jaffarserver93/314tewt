
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface RevenueChartProps {
    data: { name: string; total: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>A chart showing revenue over the past months.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
                cursor={false}
                contentStyle={{ 
                    background: "hsl(var(--background))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
