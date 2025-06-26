'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { countries } from '@/lib/countries';

export default function SignupPage() {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = React.useState<string>('USD');

  const handleSignup = () => {
    // This is a mock signup. In a real app, you would handle user creation here.
    localStorage.setItem('userCurrency', selectedCurrency);
    router.push('/dashboard');
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your details below to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="country">Country</Label>
          <Select
            onValueChange={setSelectedCurrency}
            defaultValue={selectedCurrency}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.currency}>
                  {country.name} ({country.currency})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" onClick={handleSignup}>
          Create account
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="underline hover:text-primary">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
