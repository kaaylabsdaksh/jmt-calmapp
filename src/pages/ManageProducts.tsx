import { useState } from "react";
import ModernTopNav from "@/components/modern/ModernTopNav";
import ManageProductsV1 from "@/components/products/ManageProductsV1";
import ManageProductsV2 from "@/components/products/ManageProductsV2";
import { cn } from "@/lib/utils";

const ManageProducts = () => {
  const [version, setVersion] = useState<"v1" | "v2">("v2");

  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-5">
        <div className="mb-3 flex justify-end">
          <div className="inline-flex rounded-md border bg-muted/40 p-0.5">
            {(["v1", "v2"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVersion(v)}
                className={cn(
                  "rounded px-3 py-1 text-[11px] font-medium transition-colors",
                  version === v
                    ? "bg-slate-900 text-white"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v === "v1" ? "Ver 1" : "Ver 2"}
              </button>
            ))}
          </div>
        </div>
        {version === "v1" ? <ManageProductsV1 /> : <ManageProductsV2 />}
      </main>
    </div>
  );
};

export default ManageProducts;
