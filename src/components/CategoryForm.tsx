import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Category } from '@/data/dummyData';
import { toast } from 'sonner';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category; // Optional: if provided, it's an edit form
  onSave: (category: Category) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName('');
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }
    onSave({ id: category?.id || `cat-${Date.now()}`, name: name.trim() });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription>
            {category ? 'Make changes to the category here.' : 'Add a new category to organize your products.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
          </div>
          <DialogFooter>
            <Button type="submit">{category ? 'Save Changes' : 'Add Category'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;