import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EstimateDetails } from "@/components/EstimateDetails";

const EstimatePage = () => {
  const [userRole, setUserRole] = useState<"technician" | "admin">("admin");

  return (
    <div className="container mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h1 className="text-sm font-semibold text-foreground">Estimate</h1>
          <p className="text-xs text-muted-foreground">
            Cost estimation and pricing details
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/form-variations">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back
          </Link>
        </Button>
      </div>

      <EstimateDetails userRole={userRole} onUserRoleChange={setUserRole} />
    </div>
  );
};

export default EstimatePage;
