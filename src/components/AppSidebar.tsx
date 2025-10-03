import { NavLink, useLocation } from "react-router-dom";
import { Calendar, Users, BarChart3, Settings, Briefcase, LogOut, Home, BookOpen } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Agenda", url: "/agenda", icon: Calendar },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Serviços", url: "/servicos", icon: Briefcase },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Manual", url: "/manual", icon: BookOpen },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso");
    navigate("/auth");
  };

  const getNavClass = (isActive: boolean) => {
    return isActive 
      ? "bg-primary text-primary-foreground font-medium hover:bg-primary hover:text-primary-foreground" 
      : "text-foreground hover:bg-accent/10 hover:text-foreground";
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        {/* Logo */}
        <div className="p-6 flex items-center justify-center border-b border-border">
          {!collapsed ? (
            <img 
              src={logo} 
              alt="Horix" 
              className="h-20 w-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300" 
            />
          ) : (
            <img 
              src={logo} 
              alt="Horix" 
              className="h-10 w-auto drop-shadow-lg hover:scale-110 transition-transform duration-300" 
            />
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavClass(isActive)}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1">
              <ThemeToggle />
              {!collapsed && (
                <span className="text-sm text-muted-foreground">Tema</span>
              )}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
