import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ModernTopNav from "@/components/modern/ModernTopNav";
import { PRODUCTS } from "@/lib/products";


const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = PRODUCTS.find((p) => p.id === id);


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
