import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with Sidebar Toggle */}
          <header className="h-12 flex items-center border-b bg-background/95 backdrop-blur px-4">
            <SidebarTrigger className="mr-2" />
          </header>
          
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;