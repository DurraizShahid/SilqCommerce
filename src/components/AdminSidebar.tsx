import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Package, LayoutDashboard, ListOrdered, Tag, BarChart3, Store, Users, FileText, Settings, Zap, Key } from 'lucide-react';
import { H2 } from '@/components/ui/typography';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Product Approval', href: '/admin/product-approval', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Orders', href: '/admin/orders', icon: ListOrdered },
    { name: 'Vendors', href: '/admin/vendors', icon: Store },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Content', href: '/admin/content', icon: FileText },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Advanced Analytics', href: '/admin/advanced-analytics', icon: BarChart3 },
    { name: 'Marketing Automation', href: '/admin/marketing-automation', icon: Zap },
    { name: 'Disputes', href: '/admin/disputes', icon: FileText },
    { name: 'API Management', href: '/admin/api', icon: Key },
  ];

  return (
    <aside className="w-64 bg-sidebar dark:bg-sidebar-background border-r border-sidebar-border dark:border-sidebar-border p-4 flex flex-col">
      <div className="mb-8">
        <H2 className="text-2xl font-bold text-sidebar-primary dark:text-sidebar-primary-foreground m-0 border-b-0 pb-0">Admin Panel</H2>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-md text-sidebar-foreground dark:text-sidebar-foreground hover:bg-sidebar-accent dark:hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:text-sidebar-accent-foreground transition-colors",
                  location.pathname === item.href && "bg-sidebar-accent dark:bg-sidebar-accent text-sidebar-accent-foreground dark:text-sidebar-accent-foreground font-semibold"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-sidebar-border dark:border-sidebar-border">
        <Link to="/" className="flex items-center space-x-3 p-3 rounded-md text-sidebar-foreground dark:text-sidebar-foreground hover:bg-sidebar-accent dark:hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:text-sidebar-accent-foreground transition-colors">
          <span className="text-sm">← Back to Store</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;