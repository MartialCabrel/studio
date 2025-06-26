'use client';

import type { Asset, Liability } from '@/lib/types';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useCurrency } from '@/hooks/use-currency';
import { AddAssetDialog } from './add-asset-dialog';
import { AddLiabilityDialog } from './add-liability-dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface NetWorthClientProps {
  initialAssets: Asset[];
  initialLiabilities: Liability[];
  currency: string;
}

export function NetWorthClient({
  initialAssets,
  initialLiabilities,
  currency,
}: NetWorthClientProps) {
  const { formatCurrency } = useCurrency(currency);

  const totalAssets = useMemo(
    () => initialAssets.reduce((sum, asset) => sum + asset.value, 0),
    [initialAssets]
  );
  const totalLiabilities = useMemo(
    () => initialLiabilities.reduce((sum, lia) => sum + lia.balance, 0),
    [initialLiabilities]
  );
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Assets</CardTitle>
              <AddAssetDialog>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Asset
                </Button>
              </AddAssetDialog>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.type}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(asset.value)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {initialAssets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No assets added yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="font-bold">
              <div className="flex w-full justify-between">
                <span>Total Assets</span>
                <span>{formatCurrency(totalAssets)}</span>
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Liabilities</CardTitle>
              <AddLiabilityDialog>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Liability
                </Button>
              </AddLiabilityDialog>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialLiabilities.map((lia) => (
                    <TableRow key={lia.id}>
                      <TableCell>{lia.name}</TableCell>
                      <TableCell>{lia.type}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(lia.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {initialLiabilities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        No liabilities added yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="font-bold">
              <div className="flex w-full justify-between">
                <span>Total Liabilities</span>
                <span>{formatCurrency(totalLiabilities)}</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Net Worth Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-grow flex-col justify-center space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Total Assets - Total Liabilities
          </p>
          <p className="text-4xl font-bold tracking-tight text-primary">
            {formatCurrency(netWorth)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
