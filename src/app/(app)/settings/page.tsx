import { CategoryManager } from '@/components/settings/category-manager';
import { Separator } from '@/components/ui/separator';
import { AIPreferences } from '@/components/settings/ai-preferences';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

async function getCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
}

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const categories = await getCategories(user.id);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings.
        </p>
      </div>

      <CategoryManager initialCategories={categories} />

      <Separator />

      <AIPreferences />
    </div>
  );
}
