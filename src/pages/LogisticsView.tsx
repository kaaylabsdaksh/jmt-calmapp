import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Printer, FileText, Award, Database, ChevronDown, ChevronRight, MapPin, AlertTriangle, Zap, X, SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

// --- Types ---
interface LogisticsItem {
  woBatch: string;
  division: string;
  manufacturer: string;
  model: string;
  description: string;
}

interface LogisticsGroup {
  id: string;
  type: "INV" | "DT";
  number: string;
  invoiceDate?: string;
  priority: "EMERGENCY" | "RUSH" | "NORMAL";
  customerName: string;
  city: string;
  state: string;
  division: string;
  deliverBy: string;
  itemCount: number;
  assignedDriver: string;
  items: LogisticsItem[];
}

// --- Mock Data ---
const mockGroups: LogisticsGroup[] = [
  {
    id: "1",
    type: "INV",
    number: "988620",
    invoiceDate: "Friday, February 20, 2026",
    priority: "EMERGENCY",
    customerName: "ExxonMobil Baton Rouge",
    city: "Baton Rouge",
    state: "LA",
    division: "Lab",
    deliverBy: "Sunday, March 1, 2026",
    itemCount: 3,
    assignedDriver: "unassigned",
    items: [
      { woBatch: "572200-001", division: "Lab", manufacturer: "FLUKE", model: "719PRO 30G", description: "PRESSURE CALIBRATOR" },
      { woBatch: "572200-002", division: "Lab", manufacturer: "ASHCROFT", model: '-30"Hg-0-60 PSI', description: "TEST GAUGE" },
      { woBatch: "572200-003", division: "Lab", manufacturer: "WINTERS", model: "0-3000 PSI", description: "L/F PRESSURE GAUGE" },
    ],
  },
  {
    id: "2",
    type: "DT",
    number: "40915",
    priority: "RUSH",
    customerName: "Turner Industries",
    city: "Lake Charles",
    state: "LA",
    division: "Field",
    deliverBy: "Monday, March 9, 2026",
    itemCount: 2,
    assignedDriver: "unassigned",
    items: [
      { woBatch: "572210-001", division: "Field", manufacturer: "PROTO", model: "6062C", description: 'TORQUE WRENCH 1/4"' },
      { woBatch: "572210-002", division: "Field", manufacturer: "PROTO", model: "6062D", description: 'TORQUE WRENCH 3/8"' },
    ],
  },
  {
    id: "3",
    type: "INV",
    number: "988635",
    invoiceDate: "Monday, February 24, 2026",
    priority: "NORMAL",
    customerName: "Dow Chemical Plaquemine",
    city: "Plaquemine",
    state: "LA",
    division: "Lab",
    deliverBy: "Wednesday, March 5, 2026",
    itemCount: 4,
    assignedDriver: "unassigned",
    items: [
      { woBatch: "572220-001", division: "Lab", manufacturer: "FLUKE", model: "87V", description: "DIGITAL MULTIMETER" },
      { woBatch: "572220-002", division: "Lab", manufacturer: "AMETEK", model: "RTC-159", description: "DRY BLOCK CALIBRATOR" },
      { woBatch: "572220-003", division: "Lab", manufacturer: "FLUKE", model: "724", description: "TEMPERATURE CALIBRATOR" },
      { woBatch: "572220-004", division: "Lab", manufacturer: "DRUCK", model: "DPI 611", description: "PRESSURE CALIBRATOR" },
    ],
  },
];

// --- Priority Badge Component ---
const PriorityBadge = ({ priority }: { priority: LogisticsGroup["priority"] }) => {
  if (priority === "NORMAL") return null;
  
  const config = {
    EMERGENCY: { icon: AlertTriangle, className: "bg-destructive text-destructive-foreground font-semibold tracking-wide" },
    RUSH: { icon: Zap, className: "bg-warning text-warning-foreground font-semibold tracking-wide" },
  };
  
  const { icon: Icon, className } = config[priority];
  return (
    <Badge className={`${className} text-[10px] px-2 py-0.5 gap-1 uppercase`}>
      <Icon className="w-3 h-3" />
      {priority}
    </Badge>
  );
};

// --- Logistics Group Card ---
const LogisticsGroupCard = ({ group }: { group: LogisticsGroup }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [driver, setDriver] = useState(group.assignedDriver);

  const typeLabel = group.type === "INV" ? "Inv" : "DT";
  const borderColor = group.priority === "EMERGENCY" 
    ? "border-l-destructive" 
    : group.priority === "RUSH" 
    ? "border-l-warning" 
    : "border-l-primary";

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={`bg-card rounded-lg border shadow-sm overflow-hidden border-l-4 ${borderColor}`}>
        {/* Card Header */}
        <div className="px-4 py-3 flex items-center gap-3 flex-wrap">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>

          <span className="font-bold text-sm text-foreground">
            {typeLabel} #{group.number}
          </span>

          <PriorityBadge priority={group.priority} />

          {group.invoiceDate && (
            <span className="text-xs text-muted-foreground hidden md:inline">
              INVOICE: {group.invoiceDate}
            </span>
          )}

          <span className="font-semibold text-sm text-foreground">{group.customerName}</span>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {group.city}, {group.state}
          </div>

          <Badge variant="outline" className="text-[10px] font-normal">{group.division}</Badge>

          <div className="ml-auto flex items-center gap-3 flex-wrap">
            <div className="text-xs">
              <span className="text-muted-foreground">DELIVER BY: </span>
              <span className="font-bold text-foreground">{group.deliverBy}</span>
            </div>

            <Badge variant="secondary" className="text-xs">{group.itemCount} items</Badge>

            <Select value={driver} onValueChange={setDriver}>
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Assign Driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                <SelectItem value="sarah-williams">Sarah Williams</SelectItem>
                <SelectItem value="david-chen">David Chen</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1">
              <Button size="sm" className="h-8 text-xs gap-1">
                <Printer className="w-3.5 h-3.5" />
                Print All
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                {group.type === "INV" ? "Invoice" : "DT"}
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">Certs</Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">Data</Button>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <CollapsibleContent>
          <div className="border-t">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">WO-Batch</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">Division</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">Manufacturer</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">Model</th>
                  <th className="text-left px-4 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">Description</th>
                  <th className="text-right px-4 py-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((item, idx) => (
                  <tr key={idx} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs text-foreground">{item.woBatch}</td>
                    <td className="px-4 py-2.5 text-xs text-foreground">{item.division}</td>
                    <td className="px-4 py-2.5 text-xs font-medium text-foreground">{item.manufacturer}</td>
                    <td className="px-4 py-2.5 text-xs text-foreground">{item.model}</td>
                    <td className="px-4 py-2.5 text-xs text-foreground">{item.description}</td>
                    <td className="px-4 py-2.5 text-right">
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                        <Award className="w-3 h-3" />
                        Certs + Data
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

// --- Main Page ---
const LogisticsView = () => {
  const [locationFilter, setLocationFilter] = useState("baton-rouge");
  const [stateFilter, setStateFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [driverFilter, setDriverFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"awaiting" | "printed">("awaiting");
  const [searchQuery, setSearchQuery] = useState("");

  const awaitingCount = mockGroups.length;
  const printedCount = 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav - matching Work Order Management style */}
      <header className="bg-white px-2 sm:px-4 lg:px-6 py-3 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <SidebarTrigger className="text-foreground hover:bg-muted hover:text-foreground transition-all duration-300 transform hover:scale-105" />
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight">Logistics</h1>
              <Breadcrumb className="mt-1 hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs text-foreground font-medium">Logistics</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </header>

      {/* Pill/Chip Filters Bar */}
      <div className="px-2 sm:px-4 lg:px-6 py-3 border-b bg-card flex items-center gap-2 flex-wrap">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />

        {/* Filter Chips */}
        {[
          { label: "Location", value: locationFilter, defaultVal: "baton-rouge", displayValue: locationFilter === "baton-rouge" ? "Baton Rouge" : locationFilter === "lake-charles" ? "Lake Charles" : locationFilter === "houston" ? "Houston" : "New Orleans", onChange: setLocationFilter, options: [{ v: "baton-rouge", l: "Baton Rouge" }, { v: "lake-charles", l: "Lake Charles" }, { v: "houston", l: "Houston" }, { v: "new-orleans", l: "New Orleans" }] },
          { label: "State", value: stateFilter, defaultVal: "all", displayValue: stateFilter === "all" ? "All" : stateFilter, onChange: setStateFilter, options: [{ v: "all", l: "All" }, { v: "LA", l: "Louisiana" }, { v: "TX", l: "Texas" }] },
          { label: "City", value: cityFilter, defaultVal: "all", displayValue: cityFilter === "all" ? "All" : cityFilter === "baton-rouge" ? "Baton Rouge" : "Lake Charles", onChange: setCityFilter, options: [{ v: "all", l: "All" }, { v: "baton-rouge", l: "Baton Rouge" }, { v: "lake-charles", l: "Lake Charles" }] },
          { label: "Division", value: divisionFilter, defaultVal: "all", displayValue: divisionFilter === "all" ? "All" : divisionFilter === "lab" ? "Lab" : "Field", onChange: setDivisionFilter, options: [{ v: "all", l: "All" }, { v: "lab", l: "Lab" }, { v: "field", l: "Field" }] },
          { label: "Driver", value: driverFilter, defaultVal: "all", displayValue: driverFilter === "all" ? "All" : driverFilter === "mike" ? "Mike Johnson" : "Sarah Williams", onChange: setDriverFilter, options: [{ v: "all", l: "All" }, { v: "mike", l: "Mike Johnson" }, { v: "sarah", l: "Sarah Williams" }] },
        ].map(({ label, value, defaultVal, displayValue, onChange, options }) => {
          const isActive = value !== defaultVal || label === "Location";
          return (
            <Popover key={label}>
              <PopoverTrigger asChild>
                <button
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 hover:shadow-sm ${
                    isActive && label !== "Location"
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card text-foreground border-border hover:border-foreground/30"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-wider opacity-60">{label}</span>
                  <span className="font-semibold">{displayValue}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                  {isActive && label !== "Location" && (
                    <span
                      role="button"
                      className="ml-0.5 hover:opacity-100 opacity-70"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(defaultVal);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-1" align="start">
                <div className="flex flex-col">
                  {options.map((o) => (
                    <button
                      key={o.v}
                      onClick={() => onChange(o.v)}
                      className={`text-left px-3 py-1.5 text-xs rounded-md transition-colors ${
                        value === o.v
                          ? "bg-primary/10 text-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          );
        })}

        {/* Active filter count + Reset */}
        {(stateFilter !== "all" || cityFilter !== "all" || divisionFilter !== "all" || driverFilter !== "all") && (
          <button
            onClick={() => {
              setStateFilter("all");
              setCityFilter("all");
              setDivisionFilter("all");
              setDriverFilter("all");
            }}
            className="text-[10px] text-destructive hover:text-destructive/80 font-medium uppercase tracking-wider transition-colors ml-1"
          >
            Reset filters
          </button>
        )}

        {/* Search */}
        <div className="ml-auto relative w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-xs rounded-full"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-3 bg-card border-b">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("awaiting")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors flex items-center gap-2 ${
              activeTab === "awaiting"
                ? "text-primary-foreground bg-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Awaiting Print
            <Badge variant={activeTab === "awaiting" ? "secondary" : "outline"} className="text-[10px] h-5 min-w-5 flex items-center justify-center">
              {awaitingCount}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab("printed")}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors flex items-center gap-2 ${
              activeTab === "printed"
                ? "text-primary-foreground bg-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Printed / Ready
            <Badge variant={activeTab === "printed" ? "secondary" : "outline"} className="text-[10px] h-5 min-w-5 flex items-center justify-center">
              {printedCount}
            </Badge>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-4">
        {activeTab === "awaiting" ? (
          mockGroups.map(group => (
            <LogisticsGroupCard key={group.id} group={group} />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No printed/ready shipments at this time.
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsView;
