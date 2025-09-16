

"use client";

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Edit, Trash2, MoreVertical, Ban, UserPlus, UserCog, ChevronLeft, ChevronRight } from "lucide-react";
import type { AppUser } from '@/types/next-auth';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { useUsers } from './users-context';
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


export default function UsersClientPage() {
    const { data: session } = useSession();
    const currentUser = session?.user as AppUser;
    const { 
      users, 
      addUser, 
      toggleUserStatus, 
      updateUserRole, 
      deleteUser 
    } = useUsers();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const { toast } = useToast();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
    const [isManageRoleDialogOpen, setIsManageRoleDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<AppUser | null>(null);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<AppUser['role'] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

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
      try {
        await addUser(values);
        toast({
            title: "Success",
            description: "User added successfully.",
        });
        setIsAddUserDialogOpen(false);
        addUserForm.reset();
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "An error occurred.",
        });
      }
    };


    const handleToggleStatus = async (userId: string) => {
        try {
            await toggleUserStatus(userId);
            const user = users.find(u => u.id === userId);
            const newStatus = user?.status === 'active' ? 'banned' : 'active';
            toast({
                title: "Success",
                description: `User status updated to ${newStatus}.`,
            });
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Error",
                description: error.message || 'Failed to update user status.',
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
        try {
            await updateUserRole(userToEdit.id, selectedRole);
            toast({
                title: "Success",
                description: "User role updated.",
            });
        } catch(error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to update user role.",
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
        try {
            await deleteUser(userToDelete);
            toast({
                title: "Success",
                description: "User deleted successfully.",
            });
        } catch(error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to delete user.",
            });
        }
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
    };


    const filteredUsers = useMemo(() => {
        const filtered = users.filter(user => {
            const searchMatch = user.discordUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
            const roleMatch = roleFilter === 'all' || user.role === roleFilter;
            return searchMatch && roleMatch;
        });

        filtered.sort((a, b) => roleHierarchy[b.role] - roleHierarchy[a.role]);

        setCurrentPage(1);
        return filtered;
    }, [users, searchTerm, roleFilter]);
    
    const paginatedUsers = useMemo(() => {
      const startIndex = (currentPage - 1) * usersPerPage;
      return filteredUsers.slice(startIndex, startIndex + usersPerPage);
    }, [filteredUsers, currentPage, usersPerPage]);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);


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
                   <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                     <CardDescription>A list of all users in the system.</CardDescription>
                     <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search users..."
                                className="pl-10 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                         <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                {roles.map(role => (
                                    <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                   </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead className="hidden md:table-cell">Email</TableHead>
                                    <TableHead className="hidden sm:table-cell">Role</TableHead>
                                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                                    <TableHead className="hidden md:table-cell">Created At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={user.image} alt={user.discordUsername} />
                                                    <AvatarFallback>{user.discordUsername.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                  <div className="font-medium">{user.discordUsername}</div>
                                                  <div className="text-sm text-muted-foreground md:hidden">{user.email}</div>
                                                  <div className="flex flex-wrap items-center gap-2 mt-1 sm:hidden">
                                                    <Badge className={cn("capitalize text-xs", roleBadgeColors[user.role] || roleBadgeColors['user'])}>{user.role}</Badge>
                                                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'} className={cn("capitalize text-xs", user.status === 'active' ? 'bg-green-500/80' : 'bg-red-500/80')}>{user.status}</Badge>
                                                  </div>
                                                  <div className="text-xs text-muted-foreground mt-1 md:hidden">
                                                    Joined: {format(new Date(user.createdAt), 'dd/MM/yy')}
                                                  </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge className={cn("capitalize", roleBadgeColors[user.role] || roleBadgeColors['user'])}>{user.role}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge variant={user.status === 'active' ? 'default' : 'destructive'} className={cn("capitalize", user.status === 'active' ? 'bg-green-500/80' : 'bg-red-500/80')}>{user.status}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{format(new Date(user.createdAt), 'yyyy-MM-dd')}</TableCell>
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
                    </div>
                </CardContent>
                {totalPages > 1 && (
                 <CardFooter className="flex justify-center pt-4">
                     <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                           <ChevronLeft className="h-4 w-4" />
                           Previous
                        </Button>
                        <span className="text-sm font-medium text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardFooter>
                )}
            </Card>
           
            {filteredUsers.length === 0 && (
                 <Card className="mt-6 glassmorphism">
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">No users found for the selected filters.</p>
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

    

    

    
