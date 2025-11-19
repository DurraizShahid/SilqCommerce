import React, { useState } from 'react';
import { H1, P } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(8, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  isDefault: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface Address extends AddressFormData {
  id: string;
}

const AddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      fullName: 'John Doe',
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      isDefault: true,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = (data: AddressFormData) => {
    if (editingAddress) {
      setAddresses(addresses.map((addr) => (addr.id === editingAddress.id ? { ...data, id: editingAddress.id } : addr)));
    } else {
      setAddresses([...addresses, { ...data, id: Date.now().toString() }]);
    }
    reset();
    setIsDialogOpen(false);
    setEditingAddress(null);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    reset(address);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map((addr) => ({ ...addr, isDefault: addr.id === id })));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Saved Addresses</H1>
          <P className="text-muted-foreground">Manage your shipping addresses</P>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingAddress(null);
              reset();
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
              <DialogDescription>Enter your shipping address details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" {...register('fullName')} />
                  {errors.fullName && <P className="text-sm text-destructive mt-1">{errors.fullName.message}</P>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...register('phone')} />
                  {errors.phone && <P className="text-sm text-destructive mt-1">{errors.phone.message}</P>}
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register('address')} />
                {errors.address && <P className="text-sm text-destructive mt-1">{errors.address.message}</P>}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register('city')} />
                  {errors.city && <P className="text-sm text-destructive mt-1">{errors.city.message}</P>}
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" {...register('state')} />
                  {errors.state && <P className="text-sm text-destructive mt-1">{errors.state.message}</P>}
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" {...register('postalCode')} />
                  {errors.postalCode && <P className="text-sm text-destructive mt-1">{errors.postalCode.message}</P>}
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register('country')} />
                {errors.country && <P className="text-sm text-destructive mt-1">{errors.country.message}</P>}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Address</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <P className="text-lg text-muted-foreground mb-4">No saved addresses yet.</P>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{address.fullName}</CardTitle>
                  {address.isDefault && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Default</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <P className="text-sm text-muted-foreground mb-4">
                  {address.address}<br />
                  {address.city}, {address.state} {address.postalCode}<br />
                  {address.country}<br />
                  {address.phone}
                </P>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)}>
                      Set as Default
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleEdit(address)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(address.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesPage;

