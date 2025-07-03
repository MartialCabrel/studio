'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // This code runs only on the client
    const consent = localStorage.getItem('cookie_consent');
    if (consent !== 'true') {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowBanner(false);
    router.push('/privacy-policy');
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 w-full transform transition-transform duration-300',
        showBanner ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-between gap-4 rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur-sm md:flex-row">
          <p className="text-center text-sm text-foreground md:text-left">
            We use cookies to enhance your experience. By clicking "Accept", you
            agree to our{' '}
            <Link
              href="/privacy-policy"
              className="underline hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <div className="flex items-center gap-2">
            <Button onClick={handleAccept}>Accept</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
