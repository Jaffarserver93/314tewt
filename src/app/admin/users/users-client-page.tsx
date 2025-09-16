"use client";

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Edit, Trash2, MoreVertical, Ban, UserPlus, UserCog } from "lucide-react";
import type { AppUser } from '@/types/next-auth';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toggleUserStatusAction, deleteUserAction, addUserAction, updateUserRoleAction } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const addUserFormSchema = z.object({
  discordUsername: z.string().min(2, "Username must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  role: z.enum(['user', 'staff', 'manager', 'admin', 'super admin']),
});

const roles: AppUser['role'][] = ['user', 'staff', 'manager', 'admin', 'super admin'];

const roleHierarchy: { [key in AppUser['role']]: number } = {
  user: 0,
  staff: 1,
  manager: 2,
  admin: 3,
  'super admin': 4,
};

interface UsersClientPageProps {
  initialUsers: AppUser[];
}


export default function UsersClientPage({ initialUsers }: UsersClientPageProps) {
    const { data: session } = useSession();
    const currentUser = session?.user as AppUser;
    const [users, setUsers] = useState<AppUser[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
    const [isManageRoleDialogOpen, setIsManageRoleDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<AppUser | null>(null);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<AppUser['role'] | null>(null);

    const addUserForm = useForm<z.infer<typeof addUserFormSchema>>({
      resolver: zodResolver(addUserFormSchema),
      defaultValues: {
        discordUsername: "",
        email: "",
        role: "user",
      },
    });
    
    const canManageRole = (targetUser: AppUser) => {
        if (!currentUser || !['super admin', 'admin'].includes(currentUser.role)) return false;
        if (currentUser.id === targetUser.id) return false;
        return roleHierarchy[currentUser.role] > roleHierarchy[targetUser.role];
    };

    const canDeleteUser = (targetUser: AppUser) => {
        if (!currentUser || !['super admin', 'admin'].includes(currentUser.role)) return false;
        if (currentUser.id === targetUser.id) return false;
        return roleHierarchy[currentUser.role] > roleHierarchy[targetUser.role];
    };

    const canBanUser = (targetUser: AppUser) => {
        if (!currentUser || !['super admin', 'admin'].includes(currentUser.role)) return false;
        if (currentUser.id === targetUser.id) return false;
        return roleHierarchy[currentUser.role] > roleHierarchy[targetUser.role];
    };

    const canAddUser = currentUser && ['super admin', 'admin'].includes(currentUser.role);


    const onAddUserSubmit = async (values: z.infer<typeof addUserFormSchema>) => {
      const result = await addUserAction(values);

      if (result.success && result.user) {
        setUsers([result.user, ...users]);
        toast({
            title: "Success",
            description: result.message as string,
        });
        setIsAddUserDialogOpen(false);
        addUserForm.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: typeof result.message === 'string' ? result.message : "An error occurred.",
        });
      }
    };


    const handleToggleStatus = async (userId: string) => {
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
            toast({
                variant: "destructive",
                title: "Error",
                description: result.message,
            });
        } else {
            toast({
                title: "Success",
                description: result.message,
            });
        }
    };
    
    const openManageRoleDialog = (user: AppUser) => {
        setUserToEdit(user);
        setSelectedRole(user.role);
        setIsManageRoleDialogOpen(true);
    };

    const handleUpdateRole = async () => {
        if (!userToEdit || !selectedRole) return;

        const result = await updateUserRoleAction(userToEdit.id, selectedRole);

        if (result.success && result.user) {
            setUsers(users.map(u => u.id === result.user!.id ? result.user! : u));
            toast({
                title: "Success",
                description: result.message as string,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.message as string,
            });
        }
        setIsManageRoleDialogOpen(false);
        setUserToEdit(null);
        setSelectedRole(null);
    };


    const openDeleteDialog = (userId: string) => {
        setUserToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        const originalUsers = [...users];
        
        setUsers(users.filter(u => u.id !== userToDelete));
        setIsDeleteDialogOpen(false);

        const result = await deleteUserAction(userToDelete);

        if (!result.success) {
            setUsers(originalUsers);
            toast({
                variant: "destructive",
                title: "Error",
                description: result.message,
            });
        } else {
            toast({
                title: "Success",
                description: result.message,
            });
        }
        setUserToDelete(null);
    };


    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.discordUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, searchTerm]);

    
    useEffect(() => {
      setUsers(initialUsers);
    }, [initialUsers]);


    const roleBadgeColors: { [key: string]: string } = {
        user: "bg-primary/80 text-primary-foreground border-primary",
        staff: "bg-blue-500/80 text-white border-blue-500",
        manager: "bg-yellow-500/80 text-white border-yellow-500",
        admin: "bg-orange-500/80 text-white border-orange-500",
        "super admin": "bg-pink-500/30 bg-pink-500/20 text-pink-400",
    };
    
    const availableRolesForCreation = roles.filter(role => currentUser && roleHierarchy[currentUser.role] > roleHierarchy[role]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold">User Management</h1>
                  <p className="text-muted-foreground">Manage all registered users.</p>
                </div>
                {canAddUser && (
                    <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add New User
                        </Button>
                      </DialogTrigger>
                       <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New User</DialogTitle>
                          <DialogDescription>
                            Enter the details for the new user. They will be added to the system immediately.
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...addUserForm}>
                          <form onSubmit={addUserForm.handleSubmit(onAddUserSubmit)} className="space-y-4">
                            <FormField
                              control={addUserForm.control}
                              name="discordUsername"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Discord Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="jaffar.king" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addUserForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="user@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addUserForm.control}
                              name="role"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Role</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {availableRolesForCreation.map(role => (
                                        <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <DialogFooter className="pt-4">
                              <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                              </DialogClose>
                              <Button type="submit" disabled={addUserForm.formState.isSubmitting}>
                                {addUserForm.formState.isSubmitting ? "Adding..." : "Add User"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                )}
            </div>
            
            <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                   <div className="flex items-center justify-between">
                    <CardDescription>A list of all users in the system.</CardDescription>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                   </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.image} alt={user.discordUsername} />
                                                <AvatarFallback>{user.discordUsername.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.discordUsername}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("capitalize", roleBadgeColors[user.role] || roleBadgeColors['user'])}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'} className={cn("capitalize", user.status === 'active' ? 'bg-green-500/80' : 'bg-red-500/80')}>{user.status}</Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(user.createdAt), 'yyyy-MM-dd')}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => openManageRoleDialog(user)} disabled={!canManageRole(user)}>
                                                    <UserCog className="mr-2 h-4 w-4" />
                                                    <span>Manage Role</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleToggleStatus(user.id)} disabled={!canBanUser(user)}>
                                                    <Ban className="mr-2 h-4 w-4" />
                                                    <span>{user.status === 'active' ? 'Ban' : 'Unban'}</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem disabled>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>Edit (soon)</span>
                                                </DropdownMenuItem>
                                                {canDeleteUser(user) && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:bg-destructive/20 focus:text-destructive"
                                                            onClick={() => openDeleteDialog(user.id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
           
            {filteredUsers.length === 0 && (
                 <Card className="mt-6 glassmorphism">
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">No users found.</p>
                    </CardContent>
                </Card>
            )}

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account and remove their data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <Dialog open={isManageRoleDialogOpen} onOpenChange={setIsManageRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Role for {userToEdit?.discordUsername}</DialogTitle>
                        <DialogDescription>
                            Select a new role for the user. The change will be applied immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Label>Role</Label>
                        <Select
                            value={selectedRole || ''}
                            onValueChange={(value) => setSelectedRole(value as AppUser['role'])}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map(role => (
                                    <SelectItem key={role} value={role} className="capitalize" disabled={currentUser && roleHierarchy[currentUser.role] <= roleHierarchy[role]}>{role}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                           <Button type="button" variant="secondary" onClick={() => { setUserToEdit(null); setSelectedRole(null); }}>Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleUpdateRole}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
