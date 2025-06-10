import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Wrench, Sprout, FileText, Bell, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import React from 'react';

const navItems = [
    {href: '/', label : 'Tablero', icon: LayoutDashboard},
    {href: '/employees', label : 'Empleados', icon: Users},
    {href: '/equipment', label : 'Equipos ', icon: Wrench},
    {href: '/planting', label : 'Control de plantas', icon: Sprout},
    {href: '/documents', label : 'Documentos', icon: FileText},
    {href: '/notifications', label : 'Notificaciones', icon: Bell},
]

interface AppSidebarProps {
    isCollapsed ?: boolean;
    isMobile ?: boolean;
    setIsCollapsed : React.Dispatch<React.SetStateAction<boolean>>;
}

export function AppSidebar({isCollapsed,isMobile, setIsCollapsed} : AppSidebarProps) {
    const pathname = usePathname();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    }

    return (
        <aside className={cn("bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out", 
        isCollapsed && isMobile ? "w-16" : "w-64",
        isMobile ? "fixed inset-y-0 left-0 z-50 w-64 transform" : "relative",
        isMobile && isCollapsed ? "-translate-x-full" : "translate-x-0",
    )}>
        <div className="flex items-center justify-between h-16 border-b border-sidebar-border">
            <Logo collapsed={isCollapsed && isMobile} />
            {!isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn("mr-2", isCollapsed ? "mx-auto" : "")}>
                {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
            )}
        </div>
        <nav className="flex-1 space-y-1 p-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return(
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive ? "bg-sidebar-active text-sidebar-active-foreground" 
                            : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-hover-foreground"
                        )}>
                            <item.icon className="h-5 w-5" />
                            {(!isCollapsed || isMobile) && <span>{item.label}</span>}
                        </Link>
                );
            })} 
        </nav>
            <div className="mt-auto border-t border-sidebar-border p-2">
        <Link
          href="#" // Placeholder for settings
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-hover-foreground",
            isCollapsed && !isMobile ? "justify-center" : ""
          )}
           title={isCollapsed && !isMobile ? "Settings" : undefined}
        >
          <Settings className="h-5 w-5" />
          {(!isCollapsed || isMobile) && <span>Configuración</span>}
        </Link>
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-hover-foreground",
             isCollapsed && !isMobile ? "justify-center" : ""
          )}
          title={isCollapsed && !isMobile ? "Logout" : undefined}
          // onClick={() => { /* Implement logout */ }}
        >
          <LogOut className="h-5 w-5" />
          {(!isCollapsed || isMobile) && <span>Cerrar sesion</span>}
        </button>
      </div>
    </aside>
    )
}

