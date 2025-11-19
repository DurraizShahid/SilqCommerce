import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Copy, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultPrice: number;
  defaultStock: number;
  attributes: Record<string, string>;
  createdAt: string;
  usageCount: number;
}

const VendorProductTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<ProductTemplate[]>([
    {
      id: 't1',
      name: 'Luxury Handbag Template',
      category: 'Accessories',
      description: 'Template for luxury handbags with standard attributes',
      defaultPrice: 299.99,
      defaultStock: 10,
      attributes: {
        material: 'Leather',
        color: 'Black',
        size: 'Standard',
      },
      createdAt: '2023-10-15',
      usageCount: 12,
    },
    {
      id: 't2',
      name: 'Designer Watch Template',
      category: 'Accessories',
      description: 'Template for designer watches',
      defaultPrice: 599.99,
      defaultStock: 5,
      attributes: {
        material: 'Stainless Steel',
        color: 'Silver',
        waterResistance: '50m',
      },
      createdAt: '2023-10-20',
      usageCount: 8,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProductTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    defaultPrice: 0,
    defaultStock: 0,
  });

  const handleCreate = () => {
    setEditingTemplate(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      defaultPrice: 0,
      defaultStock: 0,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (template: ProductTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      description: template.description,
      defaultPrice: template.defaultPrice,
      defaultStock: template.defaultStock,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? { ...t, ...formData, updatedAt: new Date().toISOString() }
            : t
        )
      );
      toast.success('Template updated');
    } else {
      const newTemplate: ProductTemplate = {
        id: `t-${Date.now()}`,
        ...formData,
        attributes: {},
        createdAt: new Date().toISOString().split('T')[0],
        usageCount: 0,
      };
      setTemplates([...templates, newTemplate]);
      toast.success('Template created');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast.success('Template deleted');
  };

  const handleDuplicate = (template: ProductTemplate) => {
    const newTemplate: ProductTemplate = {
      ...template,
      id: `t-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
    };
    setTemplates([...templates, newTemplate]);
    toast.success('Template duplicated');
  };

  const handleUseTemplate = (template: ProductTemplate) => {
    toast.success(`Using template: ${template.name}. Redirecting to product creation...`);
    // In real app, this would navigate to product creation with template data
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Product Templates</H1>
          <P className="text-muted-foreground">Create and manage product templates for faster listing</P>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <P className="text-lg text-muted-foreground mb-2">No templates created yet</P>
            <P className="text-sm text-muted-foreground mb-4">
              Create templates to speed up product listing with pre-filled information
            </P>
            <Button onClick={handleCreate}>Create Your First Template</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="mt-1">{template.category}</CardDescription>
                  </div>
                  <Badge variant="outline">{template.usageCount} uses</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <P className="text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </P>
                <div className="flex justify-between text-sm">
                  <div>
                    <Muted>Default Price</Muted>
                    <P className="font-semibold">${template.defaultPrice.toFixed(2)}</P>
                  </div>
                  <div>
                    <Muted>Default Stock</Muted>
                    <P className="font-semibold">{template.defaultStock}</P>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDuplicate(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(template.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? 'Update your product template'
                : 'Create a reusable template for faster product listing'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name *</Label>
              <Input
                id="templateName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Luxury Handbag Template"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateCategory">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Footwear">Footwear</SelectItem>
                  <SelectItem value="Jewelry">Jewelry</SelectItem>
                  <SelectItem value="Home & Living">Home & Living</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateDescription">Description</Label>
              <Textarea
                id="templateDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Template description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultPrice">Default Price</Label>
                <Input
                  id="defaultPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.defaultPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultPrice: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultStock">Default Stock</Label>
                <Input
                  id="defaultStock"
                  type="number"
                  min="0"
                  value={formData.defaultStock}
                  onChange={(e) =>
                    setFormData({ ...formData, defaultStock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingTemplate ? 'Update' : 'Create'} Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorProductTemplatesPage;

