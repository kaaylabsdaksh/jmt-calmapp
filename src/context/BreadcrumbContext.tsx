import { createContext, useContext, useState, type ReactNode } from "react";

type Crumb = { label: string; to?: string };

type BreadcrumbContextValue = {
  extraCrumbs: Crumb[];
  setExtraCrumbs: (crumbs: Crumb[]) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [extraCrumbs, setExtraCrumbs] = useState<Crumb[]>([]);
  return (
    <BreadcrumbContext.Provider value={{ extraCrumbs, setExtraCrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
};
