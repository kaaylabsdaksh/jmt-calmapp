import { Link } from "react-router-dom";

interface WorkOrderInfoBarProps {
  workOrderNumber: string;
  accountNumber: string;
  customer: string;
  srDocument: string;
  salesperson: string;
  contact: string;
  contactPhone?: string;
}

const WorkOrderInfoBar = ({
  workOrderNumber,
  accountNumber,
  customer,
  srDocument,
  salesperson,
  contact,
  contactPhone = "(713)344-8821"
}: WorkOrderInfoBarProps) => {
  return (
    <div className="bg-card border-b px-4 py-2 text-xs sm:text-sm overflow-x-auto">
      <div className="flex items-center gap-4 sm:gap-6 whitespace-nowrap min-w-max">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-medium">Work Order #:</span>
          <span className="text-foreground font-semibold">{workOrderNumber}</span>
        </div>
        
        {accountNumber && (
          <>
            <div className="flex items-center gap-2">
              <Link 
                to="#" 
                className="text-primary hover:underline font-semibold"
              >
                {accountNumber}
              </Link>
              <span className="text-muted-foreground">-</span>
              <span className="text-foreground">{customer}</span>
            </div>
          </>
        )}
        
        {srDocument && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-medium">SR Doc:</span>
            <Link 
              to="#" 
              className="text-primary hover:underline font-semibold"
            >
              {srDocument}
            </Link>
          </div>
        )}
        
        {salesperson && salesperson !== "Not assigned" && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-medium">Salesperson:</span>
            <Link 
              to="#" 
              className="text-primary hover:underline"
            >
              {salesperson}
            </Link>
          </div>
        )}
        
        {contact && contact !== "Not assigned" && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-medium">Contact:</span>
            <span className="text-foreground font-semibold">{contact}</span>
            {contactPhone && (
              <span className="text-foreground">{contactPhone}</span>
            )}
          </div>
        )}
        
        <Link 
          to="#" 
          className="text-primary hover:underline ml-auto"
        >
          Misc Labor Parts and Pricing
        </Link>
      </div>
    </div>
  );
};

export default WorkOrderInfoBar;
