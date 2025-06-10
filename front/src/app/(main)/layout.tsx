"use client";

import React, {useState, useEffect} from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { cn } from "@/lib/utils";

const MobileBreakpoint = 768; //Establezco la resolución de corte para dispositivos móviles

export default function MainAppLayout({
    children,
}: {
    children: React.ReactNode;  
}){
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // La barra lateral está colapsada por defecto en el escritorio

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < MobileBreakpoint); // Verifica si el ancho de la ventana es menor que el punto de corte

        };
        checkMobile(); // Verifica el tamaño inicial de la ventana

        window.addEventListener("resize", checkMobile); // Escucha los cambios de tamaño de la ventana
        return () => {
            window.removeEventListener("resize", checkMobile); 
        }; 
    }, []);

    useEffect(() => {
        const storedCollapsedState = localStorage.getItem("sidebarCollapsed");
        if (storedCollapsedState) {
            setIsSidebarCollapsed(JSON.parse(storedCollapsedState));
        }
    }, []);

    useEffect(() => {
        if (!isMobile) {
            localStorage.setItem("sidebarCollapsed", JSON.stringify(isSidebarCollapsed));
        }
}, [isSidebarCollapsed, isMobile]);
     return (
    <div className="flex min-h-screen bg-background">
      {!isMobile && (
        <AppSidebar 
          isMobile={false} 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
        />
      )}
      <div className="flex flex-1 flex-col">
        <AppHeader 
            isMobile={isMobile} 
            isSidebarCollapsed={isSidebarCollapsed} 
            setIsSidebarCollapsed={setIsSidebarCollapsed} 
        />
        <main className={cn(
          "flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto transition-all duration-300 ease-in-out",
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
