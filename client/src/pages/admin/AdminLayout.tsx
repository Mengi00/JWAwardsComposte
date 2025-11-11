import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Tag, GitBranch, Database, LogOut, Shield } from "lucide-react";
import type { Admin } from "@shared/schema";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: admin, isLoading } = useQuery<Admin | null>({
    queryKey: ["/api/auth/me"],
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/auth/logout", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/admin/login");
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-bold">Cargando...</div>
      </div>
    );
  }

  if (!admin) {
    setLocation("/admin/login");
    return null;
  }

  const menuItems = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Categorías",
      url: "/admin/categories",
      icon: Tag,
    },
    {
      title: "DJs",
      url: "/admin/djs",
      icon: Users,
    },
    {
      title: "Asignaciones",
      url: "/admin/assignments",
      icon: GitBranch,
    },
    {
      title: "Votantes",
      url: "/admin/voters",
      icon: Database,
    },
  ];

  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary flex items-center justify-center border-4 border-border">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-black text-sm uppercase">Admin Panel</div>
                <div className="text-xs text-muted-foreground font-semibold">{admin.username}</div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="font-bold uppercase text-xs">
                Gestión
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location === item.url}
                        data-testid={`link-${item.title.toLowerCase()}`}
                      >
                        <a href={item.url}>
                          <item.icon className="w-4 h-4" />
                          <span className="font-bold">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 font-bold border-4"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              {logoutMutation.isPending ? "Cerrando..." : "Cerrar Sesión"}
            </Button>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
