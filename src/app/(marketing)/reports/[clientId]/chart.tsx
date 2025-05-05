"use client";

import {TrendingUp} from "lucide-react";
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function Chart({
  chartData,
  title,
  description,
  label,
}: {
  chartData: any;
  title: string;
  description: string;
  label: string;
}) {
  const chartConfig = {
    data: {
      label: label,
      color: "white",
    },
  } satisfies ChartConfig;

  return (
    <Card className="bg-white/5 border-0 p-0  mt-4">
      <CardHeader className="p-4">
        <CardTitle className="text-[rgba(52,244,175)]">{title}</CardTitle>
        <CardDescription className="text-white">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            height={200}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
            key={JSON.stringify(chartData)}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
              className="text-white"
              padding={{left: 10, right: 10}}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="data"
              type="natural"
              fill="rgba(52,244,175)"
              fillOpacity={0.2}
              stroke="rgba(52,244,175)"
              animationDuration={2000}
              animationBegin={0}
              isAnimationActive={true}
              animationEasing="linear"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
