'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
  Cell,
} from 'recharts';

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
import type { Asset, Liability } from '@/lib/types';
import { useCurrency } from '@/hooks/use-currency';

interface NetWorthChartProps {
  assets: Asset[];
  liabilities: Liability[];
  currency: string;
}

export function NetWorthChart({
  assets,
  liabilities,
  currency,
}: NetWorthChartProps) {
  const { formatCurrency } = useCurrency(currency);
  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce(
    (sum, lia) => sum + lia.balance,
    0
  );

  const chartData = [
    {
      name: 'Assets',
      value: totalAssets,
      fill: 'var(--color-assets)',
    },
    {
      name: 'Liabilities',
      value: totalLiabilities,
      fill: 'var(--color-liabilities)',
    },
  ];

  const chartConfig = {
    value: {
      label: 'Amount',
    },
    assets: {
      label: 'Assets',
      color: 'hsl(var(--chart-2))',
    },
    liabilities: {
      label: 'Liabilities',
      color: 'hsl(var(--chart-5))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset vs. Liability Breakdown</CardTitle>
        <CardDescription>
          A visual overview of your financial position.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value.toLowerCase() as keyof typeof chartConfig]
                  ?.label
              }
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(value as number)}
                  indicator="dot"
                />
              }
            />
            <Bar dataKey="value" layout="vertical" radius={4}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => formatCurrency(value)}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
