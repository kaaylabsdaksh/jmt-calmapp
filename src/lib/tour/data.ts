// Release + tour data for CalMApp "What's New & Guided Tours"

export type TourStep = {
  id: string;
  title: string;
  description: string;
  why?: string;
  /** CSS selector for the element to spotlight. If not found, step is centered. */
  target?: string;
  /** Path to navigate to before showing the step */
  route?: string;
  estimateSeconds?: number;
};

export type MiniTour = {
  id: string;
  label: string;
  description: string;
  steps: TourStep[];
};

export type ReleaseNote = {
  category: "new" | "improved" | "fixed";
  title: string;
  description?: string;
};

export type Release = {
  version: string;
  releasedAt: string; // display date
  headline: string;
  highlights: string[];
  notes: ReleaseNote[];
  docsUrl?: string;
  videoUrl?: string;
  /** Feature flags rendered as NEW badges. Cleared on tour complete. */
  newBadgeKeys?: string[];
};

/** ---- Feature keys used by <NewBadge featureKey="..." /> ---- */
export const FEATURE_KEYS = {
  invoicingUnified: "invoicing-unified",
  manageCustomers: "manage-customers",
  whatsNew: "whats-new",
  helpMenu: "help-menu",
} as const;

/** ---- Full guided tour for the current release ---- */
export const CURRENT_TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "New KPI Dashboard",
    description:
      "Monitor calibration status and invoice processing at a glance from the Work Order home.",
    why: "Get a real-time pulse on the shop without opening reports.",
    target: '[data-tour="work-orders-table"]',
    route: "/",
    estimateSeconds: 20,
  },
  {
    id: "filters",
    title: "Improved Table Filters",
    description:
      "Quick-search each column inline — dates, item numbers, statuses — with a compact, keyboard-friendly UI.",
    why: "Find any work order in seconds without leaving the table.",
    target: '[data-tour="search-filters"]',
    route: "/",
    estimateSeconds: 25,
  },
  {
    id: "invoicing",
    title: "Unified Invoice Workspace",
    description:
      "Invoices and the Billing Specialist workflow are now combined into one workspace with shared search and filters.",
    why: "Fewer clicks, faster processing, one source of truth.",
    target: '[data-tour="invoicing-nav"]',
    route: "/invoicing-unified",
    estimateSeconds: 30,
  },
  {
    id: "customers",
    title: "Customer Summary Card",
    description:
      "See essential customer info — contacts, print tags, terms — without opening multiple tabs.",
    why: "Answer customer questions in a single view.",
    target: '[data-tour="customers-nav"]',
    route: "/manage-customers",
    estimateSeconds: 20,
  },
  {
    id: "whats-new",
    title: "What's New & Product Tours",
    description:
      "Open the Help menu any time to replay a tour, read release notes, or manage tour preferences.",
    why: "You'll never miss a new feature after a release.",
    target: '[data-tour="help-menu"]',
    estimateSeconds: 15,
  },
];

export const MINI_TOURS: MiniTour[] = [
  {
    id: "customers",
    label: "Customer Management Tour",
    description: "Manage customers, contacts and print tags.",
    steps: [
      {
        id: "cm-1",
        title: "Manage Customers",
        description: "Search, filter and open any customer account from this table.",
        target: '[data-tour="customers-nav"]',
        route: "/manage-customers",
      },
    ],
  },
  {
    id: "invoicing",
    label: "Invoicing Tour",
    description: "The unified invoicing workspace.",
    steps: [
      {
        id: "inv-1",
        title: "Unified Invoicing",
        description: "Invoices and Billing Specialist workflows in a single workspace.",
        target: '[data-tour="invoicing-nav"]',
        route: "/invoicing-unified",
      },
    ],
  },
  {
    id: "work-orders",
    label: "Work Orders Tour",
    description: "The new work order table and filters.",
    steps: [
      {
        id: "wo-1",
        title: "Work Orders Table",
        description: "Filter, sort and drill into any work order.",
        target: '[data-tour="work-orders-table"]',
        route: "/",
      },
    ],
  },
];

/** ---- Release history (newest first) ---- */
export const RELEASES: Release[] = [
  {
    version: "3.5.0",
    releasedAt: "July 2026",
    headline: "Unified Invoicing, Faster Search, Customer Improvements",
    highlights: [
      "Unified Invoicing Workspace",
      "Customer Management Improvements",
      "Faster column filters",
      "Invoice reports",
    ],
    notes: [
      { category: "new", title: "Unified Invoicing Workspace", description: "Invoices + Billing Specialist in one place." },
      { category: "new", title: "Customer Summary Card", description: "Print tags, contacts and terms at a glance." },
      { category: "improved", title: "Column quick search", description: "Compact date pickers, visible typed values, keyboard-friendly." },
      { category: "improved", title: "CSA view auto-load", description: "No search click required." },
      { category: "fixed", title: "Item # field hidden text while typing" },
    ],
    docsUrl: "https://docs.lovable.dev",
    newBadgeKeys: [
      FEATURE_KEYS.invoicingUnified,
      FEATURE_KEYS.manageCustomers,
      FEATURE_KEYS.whatsNew,
      FEATURE_KEYS.helpMenu,
    ],
  },
  {
    version: "3.4.0",
    releasedAt: "June 2026",
    headline: "New Dashboard, Performance & Bug Fixes",
    highlights: ["New Dashboard", "Performance improvements", "Bug fixes"],
    notes: [
      { category: "new", title: "Modern dashboard layout" },
      { category: "improved", title: "Faster initial load" },
      { category: "fixed", title: "Sorting on Aging column" },
    ],
  },
  {
    version: "3.3.0",
    releasedAt: "May 2026",
    headline: "Logistics + Shipping Views",
    highlights: ["Logistics View", "Shipping View", "Customer Pickup View"],
    notes: [
      { category: "new", title: "Logistics View with priority filters" },
      { category: "new", title: "Shipping View with tracking rollups" },
    ],
  },
];

export const CURRENT_RELEASE = RELEASES[0];
