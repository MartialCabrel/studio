import { CategoryManager } from '@/components/settings/category-manager';
import { categories } from '@/lib/data';

export default function SettingsPage() {
  const fetchedCategories = categories;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your expense categories.
        </p>
      </div>

      <CategoryManager initialCategories={fetchedCategories} />
    </div>
  );
}
