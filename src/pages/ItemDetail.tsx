import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock item data - in real app, this would be fetched based on id
  const item = {
    id: id,
    itemNumber: "DMM-001",
    calFreq: "12",
    actionCode: "rc",
    priority: "normal",
    manufacturer: "3d-instruments",
    model: "DM-5000",
    description: "Digital Multimeter with advanced measurement capabilities",
    mfgSerial: "SN123456",
    custId: "CUST-001",
    custSN: "C001",
    assetNumber: "ASSET-001",
    iso17025: "yes",
    estimate: "$125.00",
    newEquip: "no",
    needByDate: "2024-12-15",
    ccCost: "$50.00",
    tf: "yes",
    capableLocations: "Lab A, Lab B"
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Item Details</h1>
            <p className="text-muted-foreground">
              Detailed information for {item.itemNumber}
            </p>
          </div>
          <Badge variant={item.priority === "rush" ? "destructive" : "default"} className="capitalize text-lg px-4 py-2">
            {item.priority}
          </Badge>
        </div>
      </div>

      {/* Item Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Item Number:</span>
              <p className="text-lg font-semibold">{item.itemNumber}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Manufacturer:</span>
              <p className="text-lg uppercase">{item.manufacturer}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Model:</span>
              <p className="text-lg">{item.model}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Description:</span>
              <p className="text-sm">{item.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Cal Frequency:</span>
              <p className="text-lg">{item.calFreq} months</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Action Code:</span>
              <p className="text-lg uppercase">{item.actionCode}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">ISO 17025:</span>
              <p className="text-lg capitalize">{item.iso17025}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">TF:</span>
              <p className="text-lg capitalize">{item.tf}</p>
            </div>
          </CardContent>
        </Card>

        {/* Serial Numbers & IDs */}
        <Card>
          <CardHeader>
            <CardTitle>Serial Numbers & IDs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Mfg Serial Number:</span>
              <p className="text-lg">{item.mfgSerial}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Customer ID:</span>
              <p className="text-lg">{item.custId}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Customer Serial Number:</span>
              <p className="text-lg">{item.custSN}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Asset Number:</span>
              <p className="text-lg">{item.assetNumber}</p>
            </div>
          </CardContent>
        </Card>

        {/* Financial & Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Financial & Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Estimate:</span>
              <p className="text-lg font-semibold">{item.estimate}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">C/C Cost:</span>
              <p className="text-lg">{item.ccCost}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Need By Date:</span>
              <p className="text-lg">{item.needByDate}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">New Equipment:</span>
              <p className="text-lg capitalize">{item.newEquip}</p>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Capable Locations:</span>
              <p className="text-lg mt-1">{item.capableLocations}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ItemDetail;
