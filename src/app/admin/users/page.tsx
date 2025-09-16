
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

async function getUsers() {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching users:', error);
        return [];
    }
    return data;
}

const roleBadgeColors: { [key: string]: string } = {
    user: "border-primary/30 bg-primary/20 text-primary",
    staff: "border-blue-500/30 bg-blue-500/20 text-blue-400",
    manager: "border-yellow-500/30 bg-yellow-500/20 text-yellow-400",
    admin: "border-orange-500/30 bg-orange-500/20 text-orange-400",
    "super admin": "border-pink-500/30 bg-pink-500/20 text-pink-400",
};

const statusBadgeColors: { [key: string]: string } = {
    active: 'border-green-500/30 bg-green-500/20 text-green-400',
    banned: 'border-red-500/30 bg-red-500/20 text-red-400',
    suspended: 'border-yellow-500/30 bg-yellow-500/20 text-yellow-400',
};


export default async function UsersPage() {
  const users = await getUsers();

  return (
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Users</CardTitle>
          <CardDescription>A list of all users on the platform.</CardDescription>
        </div>
        <Button size="sm" variant="outline" className="ml-auto gap-1">
          <PlusCircle className="h-4 w-4" />
          Add User
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar_url} alt={user.username} />
                        <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground">
                            {user.email}
                        </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-xs capitalize", roleBadgeColors[user.role] || roleBadgeColors.user)} variant="outline">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-xs capitalize", statusBadgeColors[user.status] || 'border-gray-500/30 bg-gray-500/20 text-gray-400')} variant="outline">{user.status}</Badge>
                </TableCell>
                <TableCell>{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
