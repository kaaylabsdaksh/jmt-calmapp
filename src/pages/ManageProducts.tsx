import ModernTopNav from "@/components/modern/ModernTopNav";
import ManageProductsV1 from "@/components/products/ManageProductsV1";

const ManageProducts = () => {
  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-5">
        <ManageProductsV1 />
      </main>
    </div>
  );
};

export default ManageProducts;
