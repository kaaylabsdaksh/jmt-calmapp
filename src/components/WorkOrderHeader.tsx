import { Button } from "@/components/ui/button";

const WorkOrderHeader = () => {
  return (
    <header className="bg-card shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground">CalMApp</h1>
            <p className="text-sm text-muted-foreground">Calibration Management and Processing Program v3.0</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">JM Test Systems</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Pricing History
              </Button>
              <Button variant="outline" size="sm">
                User Guide
              </Button>
              <Button variant="secondary" size="sm">
                Menu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WorkOrderHeader;