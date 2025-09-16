
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { z } from 'zod';
import type { AppUser } from '@/types/next-auth';
import { addUserAction, toggleUserStatusAction, updateUserRoleAction, deleteUserAction } from '@/app/actions';

const addUserFormSchema = z.object({
  discordUsername: z.string().min(2, "Username must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  role: z.enum(['user', 'staff', 'manager', 'admin', 'super admin']),
});

type AddUserFormValues = z.infer<typeof addUserFormSchema>;

interface UsersContextType {
  users: AppUser[];
  addUser: (values: AddUserFormValues) => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, role: AppUser['role']) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children, initialUsers }: { children: ReactNode; initialUsers: AppUser[] }) {
  const [users, setUsers] = useState<AppUser[]>(initialUsers);

  const addUser = useCallback(async (values: AddUserFormValues) => {
    const result = await addUserAction(values);
    if (result.success && result.user) {
      setUsers(currentUsers => [result.user!, ...currentUsers]);
    } else {
      throw new Error(typeof result.message === 'string' ? result.message : "Failed to add user.");
    }
  }, []);

  const toggleUserStatus = useCallback(async (userId: string) => {
    const originalUsers = [...users];
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    const updatedUsers = users.map(u =>
        u.id === userId ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u
    );
    setUsers(updatedUsers);

    const result = await toggleUserStatusAction(userId);
    if (!result.success) {
      setUsers(originalUsers);
      throw new Error(result.message);
    }
  }, [users]);
  
  const updateUserRole = useCallback(async (userId: string, role: AppUser['role']) => {
    const result = await updateUserRoleAction(userId, role);
    if (result.success && result.user) {
      setUsers(currentUsers => currentUsers.map(u => u.id === userId ? result.user! : u));
    } else {
      throw new Error(typeof result.message === 'string' ? result.message : "Failed to update role.");
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    const originalUsers = [...users];
    setUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
    const result = await deleteUserAction(userId);
    if (!result.success) {
      setUsers(originalUsers);
      throw new Error(result.message);
    }
  }, [users]);

  return (
    <UsersContext.Provider value={{ users, addUser, toggleUserStatus, updateUserRole, deleteUser }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
}
