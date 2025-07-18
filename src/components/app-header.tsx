import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from './logo';
import type { User } from '@supabase/supabase-js';

export function AppHeader({ user }: { user: User }) {
  return (
    <header className="sticky top-0 z-10 flex h-14 w-full shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        <div className="hidden md:block">
          <Logo />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserNav user={user} />
      </div>
    </header>
  );
}
