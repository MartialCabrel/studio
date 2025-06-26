'use client';

import * as React from 'react';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, PlusCircle, Save, Trash2, X } from 'lucide-react';
import { Icon } from '../icon';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

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

  const handleEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingName(category.name);
  };

  const handleCancel = () => {
    setEditingCategoryId(null);
    setEditingName('');
  };

  const handleSave = (id: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, name: editingName } : cat
      )
    );
    handleCancel();
  };

  // In a real app, delete would have a confirmation and backend logic.
  const handleDelete = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Categories</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            {/* Add new category form can be implemented here */}
            <p className="py-4 text-center text-sm text-muted-foreground">
              (Add category form UI would go here)
            </p>
            <DialogFooter>
              <Button>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCancel}
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
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
