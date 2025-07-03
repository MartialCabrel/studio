import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-6">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <div>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p className="text-muted-foreground">
            Welcome to Insightful Expenses. We respect your privacy and are
            committed to protecting your personal data. This privacy policy will
            inform you as to how we look after your personal data when you visit
            our website (regardless of where you visit it from) and tell you
            about your privacy rights and how the law protects you.
          </p>

          <h2 className="text-2xl font-semibold">
            2. What data do we collect?
          </h2>
          <p className="text-muted-foreground">
            We may collect, use, store and transfer different kinds of personal
            data about you which we have grouped together as follows:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              <strong>Identity Data</strong> includes first name, last name,
              username or similar identifier.
            </li>
            <li>
              <strong>Contact Data</strong> includes billing address, delivery
              address, email address and telephone numbers.
            </li>
            <li>
              <strong>Financial Data</strong> includes your expense and income
              data that you provide.
            </li>
            <li>
              <strong>Technical Data</strong> includes internet protocol (IP)
              address, your login data, browser type and version, time zone
              setting and location, operating system and platform.
            </li>
            <li>
              <strong>Usage Data</strong> includes information about how you use
              our website and features.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold">
            3. How we use your personal data
          </h2>
          <p className="text-muted-foreground">
            We will only use your personal data when the law allows us to. Most
            commonly, we will use your personal data in the following
            circumstances:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>To provide and maintain our service.</li>
            <li>To manage your account and provide you with customer support.</li>
            <li>
              To gather analysis or valuable information so that we can improve
              our service.
            </li>
            <li>To monitor the usage of our service.</li>
            <li>To detect, prevent and address technical issues.</li>
          </ul>

          <h2 className="text-2xl font-semibold">4. Cookies</h2>
          <p className="text-muted-foreground">
            Our website uses cookies to distinguish you from other users of our
            website. This helps us to provide you with a good experience when
            you browse our website and also allows us to improve our site. A
            cookie is a small file of letters and numbers that we store on your
            browser or the hard drive of your computer if you agree. By clicking
            "Accept" on our cookie banner, you are agreeing to our use of
`           ` cookies.
          </p>

          <h2 className="text-2xl font-semibold">5. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this privacy policy, please contact
            us at privacy@insightfulexpenses.com.
          </p>
        </div>
      </div>
    </div>
  );
}
