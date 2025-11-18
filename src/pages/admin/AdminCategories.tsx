import React from 'react';
import { H1, P } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { categories } from '@/data/dummyData';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminCategories: React.FC = () => {
  const handleEdit = (categoryId: string) => {
    toast.info(`Editing category ${categoryId}`);
    // Implement actual edit logic
  };

  const handleDelete = (categoryId: string) => {
    toast.error(`Deleting category ${categoryId}`);
    // Implement actual delete logic
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <H1 className="mb-0">Categories Management</H1>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Add New Category</Button>
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
    </div>
  );
};

export default AdminCategories;