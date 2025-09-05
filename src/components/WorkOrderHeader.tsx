import { Button } from "@/components/ui/button";

const WorkOrderHeader = () => {

  return (
    <header className="bg-card border-b border-border/50">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            JM Test Systems
          </span>
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