import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Shield, UserCheck, UserX, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "admin" | "moderator" | "user";

interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole | null;
  created_at: string;
}

export function TeamTab() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<AppRole>("user");
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name, created_at");

      if (profilesError) throw profilesError;

      // Get all user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Merge profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role as AppRole || null,
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: AppRole | "remove") => {
    try {
      if (newRole === "remove") {
        // Remove role
        await supabase.from("user_roles").delete().eq("user_id", userId);
        toast({ title: "Role removed" });
      } else {
        // Check if user already has a role
        const { data: existingRole } = await supabase
          .from("user_roles")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        if (existingRole) {
          // Update existing role
          await supabase
            .from("user_roles")
            .update({ role: newRole })
            .eq("user_id", userId);
        } else {
          // Insert new role
          await supabase
            .from("user_roles")
            .insert({ user_id: userId, role: newRole });
        }
        toast({ title: `Role updated to ${newRole}` });
      }
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const getRoleColor = (role: AppRole | null) => {
    switch (role) {
      case "admin":
        return "bg-destructive/20 text-destructive";
      case "moderator":
        return "bg-primary/20 text-primary";
      case "user":
        return "bg-secondary/20 text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRoleIcon = (role: AppRole | null) => {
    switch (role) {
      case "admin":
        return Shield;
      case "moderator":
        return UserCheck;
      default:
        return Users;
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  const roleStats = {
    admins: users.filter(u => u.role === "admin").length,
    moderators: users.filter(u => u.role === "moderator").length,
    users: users.filter(u => u.role === "user").length,
    noRole: users.filter(u => !u.role).length,
  };

  return (
    <div className="space-y-6">
      {/* Role Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl p-4 border border-border"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-destructive" />
            <div>
              <p className="text-2xl font-bold text-foreground">{roleStats.admins}</p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-4 border border-border"
        >
          <div className="flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{roleStats.moderators}</p>
              <p className="text-sm text-muted-foreground">Moderators</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl p-4 border border-border"
        >
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-secondary" />
            <div>
              <p className="text-2xl font-bold text-foreground">{roleStats.users}</p>
              <p className="text-sm text-muted-foreground">Users</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-4 border border-border"
        >
          <div className="flex items-center gap-3">
            <UserX className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold text-foreground">{roleStats.noRole}</p>
              <p className="text-sm text-muted-foreground">No Role</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info Box */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-2">Role Permissions</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li><strong className="text-destructive">Admin:</strong> Full access to all dashboard features and user management</li>
          <li><strong className="text-primary">Moderator:</strong> Can manage content (events, blog, products) but cannot manage users</li>
          <li><strong className="text-secondary-foreground">User:</strong> Basic access, can view own profile only</li>
        </ul>
      </div>

      {/* Users List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="font-heading font-semibold text-foreground">
            Team Members ({users.length})
          </h2>
        </div>
        {users.length === 0 ? (
          <p className="p-6 text-muted-foreground text-center">No users found.</p>
        ) : (
          <div className="divide-y divide-border">
            {users.map((user) => {
              const RoleIcon = getRoleIcon(user.role);
              return (
                <div key={user.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                      {(user.full_name || user.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {user.full_name || "No name"}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getRoleColor(user.role)}`}>
                      <RoleIcon className="w-3 h-3" />
                      {user.role || "No role"}
                    </span>
                    <select
                      value={user.role || ""}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as AppRole | "remove")}
                      className="h-8 px-2 rounded border border-input bg-background text-sm"
                    >
                      <option value="">No role</option>
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                      {user.role && <option value="remove">Remove role</option>}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
