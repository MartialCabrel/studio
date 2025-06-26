import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar user={user} />
        <SidebarInset>
          <AppHeader user={user} />
          <main className="p-2">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
