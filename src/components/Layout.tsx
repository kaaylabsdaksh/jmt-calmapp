import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-warning px-4 sm:px-6 py-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <SidebarTrigger className="text-black hover:bg-black/10" />
                <span className="text-lg sm:text-xl font-bold text-black">CalMApp</span>
                <span className="text-xs sm:text-sm text-black hidden sm:block">Work Order Management</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="sm" className="text-black hover:bg-black/10 p-2">
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-black hover:bg-black/10 p-2">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};