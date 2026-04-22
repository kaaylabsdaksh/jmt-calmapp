import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Trash2, ArrowRightLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import ModernTopNav from "@/components/modern/ModernTopNav";

type StdRow = {
  id: string;
  acct: string;
  stdNo: string;
  manufacturer: string;
  model: string;
  description: string;
  nextCalDate: string;
  checkedOut: string;
  checkedIn: string;
};

const VehicleStandards = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const projectNo = params.get("project") || "0007001";
  const vehicle = params.get("vehicle") || "001";

  const [scanInput, setScanInput] = useState("");
  const [rows, setRows] = useState<StdRow[]>([]);
  const [transferTo, setTransferTo] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const VEHICLE_OPTIONS = ["Van 12", "Truck 7", "Trailer 3", "Service Van 4", "Box Truck 9"].filter(
    (v) => v !== vehicle
  );

  const handleScanEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !scanInput.trim()) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setRows((prev) => [
      ...prev,
      {
        id,
        acct: "—",
        stdNo: scanInput.trim(),
        manufacturer: "—",
        model: "—",
        description: "—",
        nextCalDate: "—",
        checkedOut: new Date().toLocaleDateString(),
        checkedIn: "—",
      },
    ]);
    setScanInput("");
  };

  const handleDelete = () => {
    if (!selectedId) return;
    setRows((prev) => prev.filter((r) => r.id !== selectedId));
    setSelectedId(null);
  };

  const handleTransfer = () => {
    if (!selectedId || !transferTo) return;
    setRows((prev) => prev.filter((r) => r.id !== selectedId));
    setSelectedId(null);
    setTransferTo("");
  };

  return (
    <div className="min-h-screen bg-background">
      <ModernTopNav />
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <Button variant="ghost" size="sm" className="h-7 text-xs mb-3" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
        </Button>

        {/* Header */}
        <div className="flex items-center justify-center gap-12 mb-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Project #:</span>{" "}
            <span className="font-bold">{projectNo}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Standards for Vehicle:</span>{" "}
            <span className="font-bold">{vehicle}</span>
          </div>
        </div>

        {/* Scan input */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <Input
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            onKeyDown={handleScanEnter}
            className="h-8 w-64 text-xs"
            autoFocus
          />
          <Label className="text-xs text-muted-foreground">
            Scan an RFID or Add a Std # and press Enter
          </Label>
        </div>

        {/* Table */}
        <Card className="mb-4">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/40">
                  <TableHead className="text-[11px] uppercase tracking-wide">Acct #</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">StdNo</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Manufacturer</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Model</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Description</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Next Cal Date</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Checked Out</TableHead>
                  <TableHead className="text-[11px] uppercase tracking-wide">Checked In</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-sm text-muted-foreground">
                      No data to display
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((r) => (
                    <TableRow
                      key={r.id}
                      data-state={selectedId === r.id ? "selected" : undefined}
                      onClick={() => setSelectedId(r.id)}
                      className="cursor-pointer"
                    >
                      <TableCell className="py-2 text-xs">{r.acct}</TableCell>
                      <TableCell className="py-2 text-xs font-medium">{r.stdNo}</TableCell>
                      <TableCell className="py-2 text-xs">{r.manufacturer}</TableCell>
                      <TableCell className="py-2 text-xs">{r.model}</TableCell>
                      <TableCell className="py-2 text-xs">{r.description}</TableCell>
                      <TableCell className="py-2 text-xs">{r.nextCalDate}</TableCell>
                      <TableCell className="py-2 text-xs">{r.checkedOut}</TableCell>
                      <TableCell className="py-2 text-xs">{r.checkedIn}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={!selectedId}
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Vehicle
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              disabled={!selectedId || !transferTo}
              onClick={handleTransfer}
            >
              <ArrowRightLeft className="h-3.5 w-3.5 mr-1" /> Transfer
            </Button>
            <Label className="text-xs text-muted-foreground">to Vehicle:</Label>
            <Select value={transferTo} onValueChange={setTransferTo}>
              <SelectTrigger className="h-8 w-56 text-xs">
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_OPTIONS.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" className="h-8 text-xs">
            <LogIn className="h-3.5 w-3.5 mr-1" /> Go to Checkin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleStandards;
