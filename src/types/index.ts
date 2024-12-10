export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignee?: string;
  createdAt: Date;
  startDate?: Date;
  endDate?: Date;
  customColor?: string;
  categoryId?: number;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  color: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface Status {
  id: number;
  name: string;
  color: string;
  isDefault: boolean;
}