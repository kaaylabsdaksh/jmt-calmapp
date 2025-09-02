import WorkOrderHeader from "@/components/WorkOrderHeader";
import VisualSearchCategories from "@/components/VisualSearchCategories";

const Index = () => {
  return (
    <div className="bg-background min-h-screen">
      <WorkOrderHeader />
      <main className="w-full max-w-none px-4 sm:px-6 py-6 overflow-x-hidden">
        <VisualSearchCategories />
      </main>
    </div>
  );
};

export default Index;
