import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, Category } from '@/data/dummyData';
import { toast } from 'sonner';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product; // Optional: if provided, it's an edit form
  onSave: (product: Product) => void;
  categories: Category[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
  categories,
}) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    stock: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        category: categories.length > 0 ? categories[0].name : '',
        stock: 0,
      });
    }
  }, [product, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === 'price' || id === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.price <= 0 || formData.stock < 0) {
      toast.error("Please fill in all required fields and ensure price/stock are valid.");
      return;
    }
    onSave({ ...formData, id: product?.id || `prod-${Date.now()}` });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Make changes to the product here.' : 'Add a new product to your store.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea id="description" value={formData.description} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input id="price" type="number" value={formData.price} onChange={handleChange} className="col-span-3" step="0.01" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">
              Image URL
            </Label>
            <Input id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select onValueChange={handleSelectChange} value={formData.category} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              Stock
            </Label>
            <Input id="stock" type="number" value={formData.stock} onChange={handleChange} className="col-span-3" required />
          </div>
          <DialogFooter>
            <Button type="submit">{product ? 'Save Changes' : 'Add Product'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;