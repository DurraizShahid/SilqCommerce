import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Shield, User, Mail, Calendar, Ban, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'pending';
  joinDate: string;
  lastActive: string;
  totalOrders: number;
  totalSpent: number;
}

const AdminUsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'suspend' | 'activate' | 'change-role' | null>(null);
  const [newRole, setNewRole] = useState<string>('');

  const users: User[] = [
    {
      id: 'u1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer',
      status: 'active',
      joinDate: '2023-01-15',
      lastActive: '2023-11-10',
      totalOrders: 12,
      totalSpent: 4500,
    },
    {
      id: 'u2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'vendor',
      status: 'active',
      joinDate: '2023-02-20',
      lastActive: '2023-11-09',
      totalOrders: 0,
      totalSpent: 0,
    },
    {
      id: 'u3',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      status: 'active',
      joinDate: '2022-12-01',
      lastActive: '2023-11-10',
      totalOrders: 0,
      totalSpent: 0,
    },
    {
      id: 'u4',
      name: 'Suspended User',
      email: 'suspended@example.com',
      role: 'customer',
      status: 'suspended',
      joinDate: '2023-05-10',
      lastActive: '2023-10-15',
      totalOrders: 5,
      totalSpent: 1200,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: User['role']) => {
    const colors: Record<User['role'], 'default' | 'secondary' | 'outline'> = {
      customer: 'default',
      vendor: 'secondary',
      admin: 'outline',
      moderator: 'outline',
    };
    return <Badge variant={colors[role]}>{role}</Badge>;
  };

  const getStatusBadge = (status: User['status']) => {
    const colors: Record<User['status'], 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      suspended: 'destructive',
      pending: 'secondary',
    };
    return <Badge variant={colors[status]}>{status}</Badge>;
  };

  const handleAction = (user: User, action: 'suspend' | 'activate' | 'change-role') => {
    setSelectedUser(user);
    setActionType(action);
    if (action === 'change-role') {
      setNewRole(user.role);
    }
    setIsDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedUser || !actionType) return;

    switch (actionType) {
      case 'suspend':
        toast.success(`${selectedUser.name} has been suspended`);
        break;
      case 'activate':
        toast.success(`${selectedUser.name} has been activated`);
        break;
      case 'change-role':
        toast.success(`${selectedUser.name}'s role has been changed to ${newRole}`);
        break;
    }
    setIsDialogOpen(false);
    setSelectedUser(null);
    setActionType(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>User Management</H1>
          <P className="text-muted-foreground">Manage users, roles, and permissions</P>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === 'vendor').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {users.filter((u) => u.status === 'suspended').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <P className="font-semibold">{user.name}</P>
                      <Muted className="text-sm">{user.email}</Muted>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {user.role === 'customer' ? (
                      <div>
                        <P className="font-semibold">{user.totalOrders}</P>
                        <Muted className="text-xs">${user.totalSpent.toLocaleString()}</Muted>
                      </div>
                    ) : (
                      <Muted>-</Muted>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user.status === 'active' ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(user, 'suspend')}
                            className="text-red-600"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(user, 'change-role')}
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(user, 'activate')}
                          className="text-green-600"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'suspend' && 'Suspend User'}
              {actionType === 'activate' && 'Activate User'}
              {actionType === 'change-role' && 'Change User Role'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>
                  {actionType === 'suspend' && (
                    <>Are you sure you want to suspend <strong>{selectedUser.name}</strong>?</>
                  )}
                  {actionType === 'activate' && (
                    <>Activate <strong>{selectedUser.name}</strong>?</>
                  )}
                  {actionType === 'change-role' && (
                    <>Change <strong>{selectedUser.name}</strong>'s role?</>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {actionType === 'change-role' && (
            <div className="space-y-2">
              <Label>New Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;

