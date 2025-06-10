import React from "react";
import { Logo } from "./logo";
import { Menu } from "lucide-react";
import { SheetContent, Sheet, SheetTrigger } from "../ui/sheet";
import { AppSidebar } from "./app-sidebar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
    isMobile?: boolean;
    isSidebarCollapsed?: boolean;
    setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AppHeader({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMobile, isSidebarCollapsed, setIsSidebarCollapsed
}:  AppHeaderProps) {
    const [ mobileSheetOpen, setMobileSheetOpen ] = React.useState(false);

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-2">
                {isMobile && (
          <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Cambiar menu de navegación</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <AppSidebar isMobile={true} isCollapsed={false} setIsCollapsed={() => { /* controlled by sheet */ }} />
            </SheetContent>
          </Sheet>
        )}  
        {!isMobile && <div className="w-16"> {""} </div>}
         <div className={cn(isMobile ? "ml-2" : Logo({collapsed: isSidebarCollapsed}).props.className, "flex items-center gap-2")}>
          <h1 className="text-lg font-semibold font-headline">AgroSena</h1>
        </div>
            </div>
        </header>
    );
}
