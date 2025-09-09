import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Workflow, Layers, List, LayoutGrid } from "lucide-react";

const FormVariationsDemo = () => {
  const navigate = useNavigate();

  const variations = [
    {
      title: "Original Form",
      description: "Classic single-page layout with all sections visible",
      path: "/add-work-order-item",
      icon: LayoutGrid,
      features: ["All sections visible", "Scrollable layout", "Quick overview"],
    },
    {
      title: "Step-by-Step Wizard",
      description: "Guided multi-step process with progress tracking",
      path: "/add-work-order-item-wizard",
      icon: Workflow,
      features: ["Progress indicator", "Step validation", "Guided experience"],
    },
    {
      title: "Tabbed Interface", 
      description: "Organized sections in tabs with enhanced visual design",
      path: "/add-work-order-item-tabs",
      icon: Layers,
      features: ["Tabbed navigation", "Section icons", "Enhanced cards"],
    },
    {
      title: "Expandable Sections",
      description: "Collapsible sections with completion tracking",
      path: "/add-work-order-item-accordion",
      icon: List,
      features: ["Collapsible sections", "Completion status", "Focused workflow"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3 max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/add-new-work-order")}
            className="flex items-center gap-2 hover-scale"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Work Order
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Form UX Variations</h1>
            <p className="text-sm text-muted-foreground">Choose from different user experience approaches</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Different Form UX Patterns
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each variation demonstrates a different approach to form design and user experience. 
            Click on any option to explore the different implementations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {variations.map((variation, index) => (
            <Card 
              key={variation.path} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover-scale bg-background/60 backdrop-blur-sm"
              onClick={() => navigate(variation.path)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <variation.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {variation.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {variation.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {variation.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className="w-full mt-4 hover-scale" 
                  variant={index === 0 ? "default" : "outline"}
                >
                  {index === 0 ? "View Original" : "Try This Variation"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Card className="border-0 shadow-md bg-muted/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Which UX approach works best?
              </h3>
              <p className="text-muted-foreground text-sm max-w-3xl mx-auto">
                Each pattern has its strengths: <strong>Wizard</strong> for complex forms with many required fields, 
                <strong>Tabs</strong> for organized content with clear sections, <strong>Accordion</strong> for 
                progressive disclosure, and <strong>Single Page</strong> for quick data entry when users are familiar with the form.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FormVariationsDemo;