import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Package, LayoutDashboard, ListOrdered, Tag } from 'lucide-react';
import { H2 } from '@/components/ui/typography';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Orders', href: '/admin/orders', icon: ListOrdered },
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