import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Edit, Calendar, Package, ChevronLeft, ChevronRight } from "lucide-react";

// Simplified work order data focusing on essential information
const workOrders = [
  {
    id: "500133",
    customerName: "ACME Industries",
    status: "In Lab",
    priority: "Normal",
    createdDate: "Oct 15, 2021",
    dueDate: "Nov 24, 2022",
    manufacturer: "ADEULIS",
    model: "PPS-1734",
    description: "Pressure Calibration Service"
  },
  {
    id: "500132",
    customerName: "Tech Solutions Ltd",
    status: "Complete",
    priority: "Rush",
    createdDate: "Oct 15, 2021",
    dueDate: "Nov 20, 2022",
    manufacturer: "STARRETT",
    model: "844-441",
    description: "Micrometer Repair & Calibration"
  },
  {
    id: "500131",
    customerName: "Manufacturing Corp",
    status: "Pending",
    priority: "Normal",
    createdDate: "Oct 15, 2021",
    dueDate: "Dec 10, 2022",
    manufacturer: "CHARLS LTD",
    model: "1000 PS/100 gr",
    description: "Scale Calibration Service"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Lab": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Complete": return "bg-green-100 text-green-800 border-green-200";
    case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Shipped": return "bg-purple-100 text-purple-800 border-purple-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Rush": return "bg-red-100 text-red-800 border-red-200";
    case "Emergency": return "bg-red-200 text-red-900 border-red-300";
    case "Normal": return "bg-gray-100 text-gray-700 border-gray-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const MinimalWorkOrderResults = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalItems = 1985;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Search Results ({totalItems} work orders)
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Showing {itemsPerPage} of {totalItems} results
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {workOrders.map((order) => (
            <Card key={order.id} className="hover-glow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-primary">
                        WO #{order.id}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </Badge>
                        <Badge className={`text-xs border ${getPriorityColor(order.priority)}`}>
                          {order.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Customer</p>
                        <p className="font-medium">{order.customerName}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Equipment</p>
                          <p className="font-medium">{order.manufacturer} {order.model}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-medium">{order.dueDate}</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2">
                      {order.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/work-order/${order.id}`)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Simple Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MinimalWorkOrderResults;