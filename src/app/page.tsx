import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, LineChart, ListPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { CookieConsent } from '@/components/cookie-consent';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Logo />
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto grid grid-cols-1 items-center gap-6 px-4 py-8 md:grid-cols-2 md:px-6 lg:py-16">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Gain Control of Your Finances with Insightful Expenses
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Stop wondering where your money goes. Start tracking your expenses
              effortlessly and let our AI provide you with personalized insights
              to help you save more.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">Sign Up for Free</Link>
            </Button>
          </div>
          <div className="flex justify-center">
            <Image
              src="/banner.jpeg"
              alt="Dashboard preview"
              width={600}
              height={400}
              className="rounded-xl shadow-2xl"
            />
          </div>
        </section>

        <section className="bg-muted py-8 lg:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Features Designed for You
              </h2>
              <p className="mt-4 text-muted-foreground">
                Everything you need to manage your expenses and improve your
                financial health.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListPlus className="h-6 w-6 text-primary" />
                    Effortless Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Quickly record your expenses with our intuitive form.
                  Categorize and date your entries for easy organization.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-6 w-6 text-primary" />
                    Clear Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  View your spending habits at a glance. Filter your expenses by
                  date or category to understand your financial patterns.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    AI-Powered Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Receive smart summaries and cost-saving suggestions from our
                  AI to help you make better financial decisions.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Insightful Expenses. All rights
            reserved.
          </p>
          <Logo />
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
}
