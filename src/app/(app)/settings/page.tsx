import { CategoryManager } from '@/components/settings/category-manager';
import { categories } from '@/lib/data';
import { Separator } from '@/components/ui/separator';
import { AIPreferences } from '@/components/settings/ai-preferences';

export default function SettingsPage() {
  const fetchedCategories = categories;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your application settings.
        </p>
      </div>

      <CategoryManager initialCategories={fetchedCategories} />

      <Separator />
      
      <AIPreferences />

    </div>
  );
}
