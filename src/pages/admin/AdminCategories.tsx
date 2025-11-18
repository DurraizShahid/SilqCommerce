import React, { useState } from 'react';
import { H1, P } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { categories as initialCategories } from '@/data/dummyData';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import CategoryForm from '@/components/CategoryForm';
import { Category } from '@/data/dummyData';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (categoryId: string) => {
    const categoryToEdit = categories.find((c) => c.id === categoryId);
    if (categoryToEdit) {
      setEditingCategory(categoryToEdit);
      setIsFormOpen(true);
    }
  };

  const handleDelete = (categoryId: string) => {
    setCategories(categories.filter((c) => c.id !== categoryId));
    toast.error(`Category deleted successfully!`);
  };

  const handleSaveCategory = (category: Category) => {
    if (category.id && categories.some(c => c.id === category.id)) {
      // Edit existing category
      setCategories(categories.map((c) => (c.id === category.id ? category : c)));
      toast.success(`Category "${category.name}" updated successfully!`);
    } else {
      // Add new category
      setCategories([...categories, { ...category, id: `cat-${Date.now()}` }]);
      toast.success(`Category "${category.name}" added successfully!`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <H1 className="mb-0">Categories Management</H1>
        <Button onClick={handleAddCategory} className="bg-primary text-primary-foreground hover:bg-primary/90">Add New Category</Button>
      </div>
      <P className="text-lg text-muted-foreground">
        Organize your products into categories.
      </P>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(category.id)} className="mr-2">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default AdminCategories;