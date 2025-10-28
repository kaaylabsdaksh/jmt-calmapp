import { Button } from "@/components/ui/button";
import jmTestLogo from "@/assets/jm-test-logo.png";

const WorkOrderHeader = () => {

  return (
    <header className="bg-card border-b border-border/50">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <img src={jmTestLogo} alt="JM Test Systems" className="h-6" />
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs h-7 px-2 hover:bg-black hover:text-white"
            >
              Pricing History
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs h-7 px-2 hover:bg-black hover:text-white"
            >
              User Guide
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkOrderHeader;