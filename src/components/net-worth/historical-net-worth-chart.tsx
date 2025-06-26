'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { NetWorthHistory } from '@/lib/types';
import { useCurrency } from '@/hooks/use-currency';

interface HistoricalNetWorthChartProps {
  history: NetWorthHistory[];
  currency: string;
}

export function HistoricalNetWorthChart({
  history,
  currency,
}: HistoricalNetWorthChartProps) {
  const { formatCurrency } = useCurrency(currency);

  const chartData = history.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
    netWorth: item.netWorth,
  }));

  const chartConfig = {
    netWorth: {
      label: 'Net Worth',
      color: 'hsl(var(--chart-1))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Worth Over Time</CardTitle>
        <CardDescription>
          A chart showing the progression of your net worth.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(value as number)}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="netWorth"
                type="natural"
                fill="var(--color-netWorth)"
                fillOpacity={0.4}
                stroke="var(--color-netWorth)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-center text-muted-foreground">
              No historical data available.
              <br />
              Your net worth history will be recorded periodically.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
