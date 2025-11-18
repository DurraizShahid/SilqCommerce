import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { products as initialProducts, categories } from '@/data/dummyData';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ProductForm from '@/components/ProductForm';
import { Product } from '@/data/dummyData';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (productId: string) => {
    const productToEdit = products.find((p) => p.id === productId);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setIsFormOpen(true);
    }
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    toast.error(`Product deleted successfully!`);
  };

  const handleSaveProduct = (product: Product) => {
    if (product.id && products.some(p => p.id === product.id)) {
      // Edit existing product
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
      toast.success(`Product "${product.name}" updated successfully!`);
    } else {
      // Add new product
      setProducts([...products, { ...product, id: `prod-${Date.now()}` }]);
      toast.success(`Product "${product.name}" added successfully!`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <H1 className="mb-0">Products Management</H1>
        <Button onClick={handleAddProduct} className="bg-primary text-primary-foreground hover:bg-primary/90">Add New Product</Button>
      </div>
      <P className="text-lg text-muted-foreground">
        Manage your store's product catalog.
      </P>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell><Muted>{product.category}</Muted></TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(product.id)} className="mr-2">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
        categories={categories}
      />
    </div>
  );
};

export default AdminProducts;