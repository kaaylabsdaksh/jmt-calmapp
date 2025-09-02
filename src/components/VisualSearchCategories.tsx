import { Search, User, Grid3x3, MapPin, Calendar, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const searchCategories = [
  {
    id: "find-work-order",
    title: "Find Work Order",
    subtitle: "(by number)",
    icon: Search,
    color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    iconColor: "text-blue-600",
    action: () => console.log("Find Work Order clicked")
  },
  {
    id: "search-customer",
    title: "Search by Customer", 
    subtitle: "(by company)",
    icon: User,
    color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    iconColor: "text-purple-600",
    action: () => console.log("Search by Customer clicked")
  },
  {
    id: "browse-products",
    title: "Browse Products",
    subtitle: "(by type)", 
    icon: Grid3x3,
    color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
    iconColor: "text-orange-600",
    action: () => console.log("Browse Products clicked")
  },
  {
    id: "by-location",
    title: "By Location",
    subtitle: "(facility/area)",
    icon: MapPin,
    color: "bg-red-50 hover:bg-red-100 border-red-200", 
    iconColor: "text-red-600",
    action: () => console.log("By Location clicked")
  },
  {
    id: "date-range",
    title: "By Date Range",
    subtitle: "(created/due)",
    icon: Calendar,
    color: "bg-cyan-50 hover:bg-cyan-100 border-cyan-200",
    iconColor: "text-cyan-600", 
    action: () => console.log("By Date Range clicked")
  },
  {
    id: "quick-actions",
    title: "Quick Actions",
    subtitle: "(overdue/urgent)",
    icon: Zap,
    color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
    iconColor: "text-yellow-600",
    action: () => console.log("Quick Actions clicked")
  }
];

const VisualSearchCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: typeof searchCategories[0]) => {
    category.action();
    // Add navigation logic here based on category
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Visual Search Categories</h2>
        <p className="text-muted-foreground text-lg">Create large, clickable cards for common search types:</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchCategories.map((category) => {
          const IconComponent = category.icon;
          
          return (
            <Card 
              key={category.id}
              className={`${category.color} cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2`}
              onClick={() => handleCategoryClick(category)}
            >
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className={`${category.iconColor} mb-2`}>
                    <IconComponent size={48} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.subtitle}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Version 2 - Visual Search Interface
          </span>
        </p>
      </div>
    </div>
  );
};

export default VisualSearchCategories;