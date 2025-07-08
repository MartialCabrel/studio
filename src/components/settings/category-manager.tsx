'use client';

import * as React from 'react';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Edit,
  PlusCircle,
  Save,
  Trash2,
  X,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Icon } from '../icon';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface CategoryManagerProps {
  initialCategories: Category[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] =
    React.useState<Category[]>(initialCategories);
  const [editingCategoryId, setEditingCategoryId] = React.useState<
    string | null
  >(null);
  const [editingName, setEditingName] = React.useState('');
  const [processingState, setProcessingState] = React.useState<{
    id: string;
    action: 'save' | 'delete';
  } | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingName(category.name);
  };

  const handleCancel = () => {
    setEditingCategoryId(null);
    setEditingName('');
  };

  const handleSave = async (id: string) => {
    setProcessingState({ id, action: 'save' });
    try {
      await updateCategory(id, editingName);
      toast({ title: 'Category updated!' });
      handleCancel();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error saving category' });
    } finally {
      setProcessingState(null);
    }
  };

  const handleDelete = async (id: string) => {
    setProcessingState({ id, action: 'delete' });
    try {
      await deleteCategory(id);
      toast({ title: 'Category deleted!' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error deleting category',
        description: 'Make sure no expenses are using this category.',
      });
    } finally {
      setProcessingState(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Categories</CardTitle>
          <CardDescription>
            Manage your expense categories.
          </CardDescription>
        </div>
        <AddCategoryDialog />
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div className="flex items-center gap-3">
                <Icon name={category.icon} className="h-5 w-5" />
                {editingCategoryId === category.id ? (
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="h-8"
                  />
                ) : (
                  <span className="font-medium">{category.name}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {editingCategoryId === category.id ? (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSave(category.id)}
                      disabled={processingState?.id === category.id}
                    >
                      {processingState?.id === category.id &&
                      processingState.action === 'save' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCancel}
                      disabled={processingState?.id === category.id}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(category)}
                      disabled={processingState?.id === category.id}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          disabled={processingState?.id === category.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the category.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id)}
                            disabled={
                              processingState?.id === category.id &&
                              processingState.action === 'delete'
                            }
                          >
                            {processingState?.id === category.id &&
                              processingState.action === 'delete' && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function AddCategoryDialog() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [icon, setIcon] = React.useState('Package');
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addCategory(name, icon);
      toast({ title: 'Category added!' });
      setName('');
      setIcon('Package');
      setOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error adding category' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                required
                placeholder="A lucide-react icon name"
              />
              <p className="text-xs text-muted-foreground">
                Find icons at{' '}
                <a
                  href="https://lucide.dev/icons/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  lucide.dev/icons
                </a>
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
