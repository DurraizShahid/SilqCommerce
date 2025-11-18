import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-grow flex flex-col">
        <header className="border-b border-gray-200 dark:border-gray-800 py-4 px-6 bg-background">
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        </header>
        <main className="flex-grow p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;