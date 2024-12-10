import React from 'react';
import { UserManagement } from './UserManagement';
import { CategoryManagement } from './CategoryManagement';
import { StatusManagement } from './StatusManagement';

export const Settings: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UserManagement />
      <CategoryManagement />
      <div className="md:col-span-2">
        <StatusManagement />
      </div>
    </div>
  );
};