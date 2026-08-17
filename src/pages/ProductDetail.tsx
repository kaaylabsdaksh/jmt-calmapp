import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ModernTopNav from "@/components/modern/ModernTopNav";

const products = [
  { id: "9719", manufacturer: "FLUKE", model: "10", description: "MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "102.50", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9723", manufacturer: "FLUKE", model: "105 SERIES II", description: "SCOPEMETER", alias: "", lc: "Q", locations: "", tf: "No", calCost: "358.75", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9724", manufacturer: "FLUKE", model: "105B", description: "SCOPEMETER", alias: "", lc: "Q", locations: "", tf: "No", calCost: "358.75", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9727", manufacturer: "FLUKE", model: "11", description: "MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "205.00", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9728", manufacturer: "FLUKE", model: "110", description: "TRUE RMS MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "205.00", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9729", manufacturer: "FLUKE", model: "111", description: "MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "153.75", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9730", manufacturer: "FLUKE", model: "112", description: "MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "153.75", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9731", manufacturer: "FLUKE", model: "114", description: "TRUE RMS MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "153.75", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9734", manufacturer: "FLUKE", model: "115", description: "TRUE RMS MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "153.75", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9737", manufacturer: "FLUKE", model: "12", description: "MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "153.75", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9738", manufacturer: "FLUKE", model: "123", description: "SCOPEMETER", alias: "", lc: "Q", locations: "Baton Rouge, Alexandria, Odessa, Clute, Mattoon, Groves, Port Arthur, Onsite", tf: "No", calCost: "307.50", groupType: "Electrical", productType: "", accredCal: "Yes", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9739", manufacturer: "FLUKE", model: "124", description: "SCOPEMETER", alias: "", lc: "Q", locations: "", tf: "No", calCost: "307.50", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9740", manufacturer: "FLUKE", model: "125", description: "SCOPEMETER", alias: "", lc: "Q", locations: "", tf: "No", calCost: "307.50", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9741", manufacturer: "FLUKE", model: "15B+", description: "DIGITAL MULTIMETER", alias: "", lc: "M", locations: "Houston", tf: "No", calCost: "125.00", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "Yes", option: "", range: "", accuracy: "" },
  { id: "9742", manufacturer: "FLUKE", model: "17B+", description: "DIGITAL MULTIMETER", alias: "", lc: "M", locations: "Houston", tf: "No", calCost: "145.00", groupType: "Electrical", productType: "", accredCal: "Yes", status: "ACTIVE", prItem: "", prStatus: "", rental: "Yes", option: "", range: "", accuracy: "" },
  { id: "9743", manufacturer: "FLUKE", model: "287", description: "TRUE RMS ELECTRONIC LOGGING MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "425.00", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9744", manufacturer: "FLUKE", model: "289", description: "TRUE RMS INDUSTRIAL LOGGING MULTIMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "495.00", groupType: "Electrical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9745", manufacturer: "DRUCK", model: "DPI 620", description: "CALIBRATOR", alias: "", lc: "P", locations: "", tf: "No", calCost: "620.00", groupType: "Pressure", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9746", manufacturer: "DRUCK", model: "DPI 705", description: "PRESSURE INDICATOR", alias: "", lc: "P", locations: "", tf: "No", calCost: "210.00", groupType: "Pressure", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9747", manufacturer: "HART", model: "475", description: "FIELD COMMUNICATOR", alias: "", lc: "T", locations: "", tf: "No", calCost: "385.00", groupType: "Temperature", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9748", manufacturer: "HART", model: "375", description: "FIELD COMMUNICATOR", alias: "", lc: "T", locations: "", tf: "No", calCost: "295.00", groupType: "Temperature", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9749", manufacturer: "AMETEK", model: "JOFRA RTC-157", description: "TEMPERATURE CALIBRATOR", alias: "", lc: "T", locations: "", tf: "No", calCost: "750.00", groupType: "Temperature", productType: "", accredCal: "Yes", status: "ACTIVE", prItem: "", prStatus: "", rental: "Yes", option: "", range: "", accuracy: "" },
  { id: "9750", manufacturer: "AMETEK", model: "JOFRA ATC-140", description: "TEMPERATURE CALIBRATOR", alias: "", lc: "T", locations: "", tf: "No", calCost: "680.00", groupType: "Temperature", productType: "", accredCal: "Yes", status: "ACTIVE", prItem: "", prStatus: "", rental: "Yes", option: "", range: "", accuracy: "" },
  { id: "9751", manufacturer: "MITUTOYO", model: "500-196-30", description: "DIGIMATIC CALIPER", alias: "", lc: "M", locations: "", tf: "No", calCost: "55.00", groupType: "Mechanical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
  { id: "9752", manufacturer: "MITUTOYO", model: "293-340-30", description: "DIGIMATIC MICROMETER", alias: "", lc: "M", locations: "", tf: "No", calCost: "72.50", groupType: "Mechanical", productType: "", accredCal: "", status: "ACTIVE", prItem: "", prStatus: "", rental: "No", option: "", range: "", accuracy: "" },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="bg-background min-h-full">
        <ModernTopNav />
        <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-5">
          <div className="text-center py-20">
            <p className="text-sm text-muted-foreground">Product not found</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/manage-products")}>
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Back to Manage Products
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const fields = [
    { label: "ID", key: "id" },
    { label: "Manufacturer", key: "manufacturer" },
    { label: "Model", key: "model" },
    { label: "Product Description", key: "description" },
    { label: "Alias", key: "alias" },
    { label: "LC", key: "lc" },
    { label: "Capable Location(s)", key: "locations" },
    { label: "TF", key: "tf" },
    { label: "Cal/Cert Cost", key: "calCost" },
    { label: "Group Type", key: "groupType" },
    { label: "Product Type", key: "productType" },
    { label: "Accred Cal", key: "accredCal" },
    { label: "Status", key: "status" },
    { label: "PR Item", key: "prItem" },
    { label: "PR Status", key: "prStatus" },
    { label: "Rental", key: "rental" },
    { label: "Option", key: "option" },
    { label: "Range", key: "range" },
    { label: "Accuracy", key: "accuracy" },
  ] as const;

  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-5">
        <div className="space-y-4 max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Product Details</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {product.manufacturer} {product.model} — ID {product.id}
              </p>
            </div>
            <Badge variant={product.status === "ACTIVE" ? "default" : "secondary"} className="text-[10px]">
              {product.status}
            </Badge>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields.map((f) => (
                  <div key={f.key} className="space-y-1">
                    <Label className="text-[10px] font-medium text-muted-foreground">{f.label}</Label>
                    <Input value={product[f.key as keyof typeof product] || "—"} readOnly className="h-7 text-[11px] bg-muted/30" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between gap-2 pt-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate("/manage-products")}>
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate("/manage-products")}>
                <X className="h-3.5 w-3.5 mr-1.5" />
                Cancel
              </Button>
              <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white">
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
