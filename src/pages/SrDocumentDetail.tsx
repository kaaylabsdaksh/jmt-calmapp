import { Fragment, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  Trash2,
  Pencil,
  Bold,
  FileText,
  Upload,
  Users,
  Search,
  X,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import ModernTopNav from "@/components/modern/ModernTopNav";

type Instruction = {
  id: string;
  type: string;
  text: string;
  requestedBy: string;
  submittedBy: string;
  created: string;
  modified: string;
  line: string;
  bold?: boolean;
};

const TYPES = [
  "Customer Service",
  "Sales",
  "Accounting",
  "Shipping",
  "Quality",
];

const SEED: Instruction[] = [
  {
    id: "i1",
    type: "Customer Service",
    text: "Shon Haveard requested that all hot sticks and rescue sticks have a 24 month calibration date.",
    requestedBy: "Shon Haveard",
    submittedBy: "Brad Harris",
    created: "03/16/22 - K Seawell",
    modified: "03/16/22 - K Seawell",
    line: "1",
  },
  {
    id: "i2",
    type: "Sales",
    text: "POs received before Oct. 1 (outside of the Ariba Network) can continue to be invoiced by paper copy and emailed or mailed in if they are not in the ARIBA network.",
    requestedBy: "SR0093",
    submittedBy: "Taylor Richardson",
    created: "12/12/18 - T Richardson",
    modified: "12/12/18 - T Richardson",
    line: "1",
  },
  {
    id: "i3",
    type: "Sales",
    text: "When you invoice shipping charges over $500, we require supporting documentation (freight quote, freight bill, etc.) from the carrier. The shipping charges must not exceed the amount on the supporting document. The document should be submitted as an attachment to your invoice in Ariba.",
    requestedBy: "SR0093",
    submittedBy: "Jo'Leigh Deshotel",
    created: "11/20/18 - J Deshotel",
    modified: "12/12/18 - T Richardson",
    line: "2",
  },
  {
    id: "i4",
    type: "Sales",
    text: "The Purchase Order is set up to either allow or disallow freight to be submitted on an invoice. If you are unable to bill for freight, it is because our PO does not allow for it. If you feel the PO is not correct, please reach out to the buyer contact on your order for assistance.",
    requestedBy: "SR0093",
    submittedBy: "Jo'Leigh Deshotel",
    created: "11/20/18 - J Deshotel",
    modified: "12/12/18 - T Richardson",
    line: "3",
  },
  {
    id: "i5",
    type: "Sales",
    text: "For order confirmations with changes to our original PO, please also send a confirmation outside of the Ariba Network - email/fax/phone to the buyer contact on the PO, to ensure your order is updated with correct information.",
    requestedBy: "SR0093",
    submittedBy: "Jo'Leigh Deshotel",
    created: "11/20/18 - J Deshotel",
    modified: "12/12/18 - T Richardson",
    line: "4",
  },
  {
    id: "i6",
    type: "Sales",
    text: "Beginning Oct. 1, 2018, IPaper accts will be using ARIBA for invoicing, receiving POs and acknowledging POs. Please see below guidelines.",
    requestedBy: "SR0093",
    submittedBy: "Jo'Leigh Deshotel",
    created: "11/20/18 - J Deshotel",
    modified: "12/12/18 - T Richardson",
    line: "5",
    bold: true,
  },
];

const ACCOUNTS = [
  { acct: "0540.00", customer: "International Paper" },
  { acct: "0540.02", customer: "International Paper-Vicksburg" },
  { acct: "0540.03", customer: "International Paper Reliability" },
  { acct: "0540.08", customer: "International Paper Bastrop La" },
  { acct: "0540.09", customer: "International Paper" },
  { acct: "0540.11", customer: "International Paper Paper Mach" },
  { acct: "0540.12", customer: "International Paper Pulp Mill" },
  { acct: "0540.13", customer: "Graphic Packaging Int'l LLC" },
  { acct: "0540.14", customer: "International Paper Iepm Test" },
  { acct: "0540.15", customer: "International Paper Powerhouse" },
  { acct: "0540.16", customer: "International Paper Riverdale" },
  { acct: "0540.17", customer: "International Paper" },
  { acct: "0540.18", customer: "International Paper" },
];

const emptyDraft = {
  type: "",
  requestedBy: "",
  submittedBy: "",
  text: "",
};

const SrDocumentDetail = () => {
  const { sr = "SR0093" } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [items, setItems] = useState<Instruction[]>(SEED);
  const [draft, setDraft] = useState({ ...emptyDraft });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState({ ...emptyDraft });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [acctSearch, setAcctSearch] = useState("");
  const [pdfDescription, setPdfDescription] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [files, setFiles] = useState<{ name: string; description: string }[]>([]);

  const grouped = useMemo(() => {
    const map = new Map<string, Instruction[]>();
    items.forEach((i) => {
      map.set(i.type, [...(map.get(i.type) || []), i]);
    });
    return Array.from(map.entries());
  }, [items]);

  const accounts = useMemo(
    () =>
      ACCOUNTS.filter(
        (a) =>
          a.acct.includes(acctSearch) ||
          a.customer.toLowerCase().includes(acctSearch.toLowerCase())
      ),
    [acctSearch]
  );

  const handleAdd = () => {
    if (!draft.type || !draft.text.trim()) {
      toast({
        title: "Missing information",
        description: "Type and instructions are required.",
        variant: "destructive",
      });
      return;
    }
    const stamp = "Today - Current User";
    setItems((p) => [
      ...p,
      {
        id: crypto.randomUUID(),
        ...draft,
        created: stamp,
        modified: stamp,
        line: String(p.filter((x) => x.type === draft.type).length + 1),
      },
    ]);
    toast({ title: "Instruction added" });
    setDraft({ ...emptyDraft });
  };

  const startEdit = (i: Instruction) => {
    setEditingId(i.id);
    setEditDraft({
      type: i.type,
      requestedBy: i.requestedBy,
      submittedBy: i.submittedBy,
      text: i.text,
    });
  };

  const saveEdit = () => {
    if (!editDraft.type || !editDraft.text.trim()) {
      toast({
        title: "Missing information",
        description: "Type and instructions are required.",
        variant: "destructive",
      });
      return;
    }
    const stamp = "Today - Current User";
    setItems((p) =>
      p.map((i) => (i.id === editingId ? { ...i, ...editDraft, modified: stamp } : i))
    );
    toast({ title: "Instruction updated" });
    setEditingId(null);
  };

  const toggleBold = (id: string) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, bold: !i.bold } : i)));

  const setLine = (id: string, line: string) =>
    setItems((p) => p.map((i) => (i.id === id ? { ...i, line } : i)));


  return (
    <div className="bg-background min-h-full">
      <ModernTopNav />
      <main className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-3 sm:py-5">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">{sr}</h1>
                <p className="text-xs text-muted-foreground">
                  Special requirements document · {items.length} instruction
                  {items.length === 1 ? "" : "s"} · {ACCOUNTS.length} accounts
                </p>
              </div>
              <Badge variant="secondary" className="h-5 text-[10px]">
                {sr}.pdf
              </Badge>
            </div>
            <div />

          </div>

          <div className="space-y-4">
            {/* Top: three panels side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">

              {/* Add instruction */}
              <Card>
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-xs font-semibold">
                    Add Instruction
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-muted-foreground">
                      Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={draft.type}
                      onValueChange={(v) => setDraft((p) => ({ ...p, type: v }))}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {TYPES.map((t) => (
                          <SelectItem key={t} value={t} className="text-xs">
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-muted-foreground">
                        Requested By
                      </Label>
                      <Input
                        className="h-8 text-xs"
                        value={draft.requestedBy}
                        onChange={(e) =>
                          setDraft((p) => ({ ...p, requestedBy: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-medium text-muted-foreground">
                        Submitted By
                      </Label>
                      <Input
                        className="h-8 text-xs"
                        value={draft.submittedBy}
                        onChange={(e) =>
                          setDraft((p) => ({ ...p, submittedBy: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-muted-foreground">
                      Instructions <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      rows={5}
                      className="text-xs resize-none"
                      value={draft.text}
                      onChange={(e) => setDraft((p) => ({ ...p, text: e.target.value }))}
                      placeholder="Type the special requirement..."
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        setDraft({ ...emptyDraft });
                        setEditingId(null);
                      }}
                    >
                      <X className="h-3.5 w-3.5 mr-1.5" />Clear
                    </Button>
                    <Button size="sm" className="h-8 text-xs" onClick={handleAdd}>
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      {editingId ? "Update" : "Add"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Accounts */}
              <Card>
                <CardHeader className="p-3 pb-2 flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xs font-semibold inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />Accounts
                    <Badge variant="secondary" className="h-4 text-[10px] ml-1">
                      {ACCOUNTS.length}
                    </Badge>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px]"
                    onClick={() =>
                      toast({ title: "Add / Remove Accounts", description: "Account picker." })
                    }
                  >
                    Add / Remove
                  </Button>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      value={acctSearch}
                      onChange={(e) => setAcctSearch(e.target.value)}
                      placeholder="Filter accounts"
                      className="h-8 text-xs pl-7"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto rounded-md border divide-y">
                    {accounts.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground p-3 text-center">
                        No accounts match.
                      </p>
                    ) : (
                      accounts.map((a) => (
                        <div
                          key={a.acct}
                          className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/40"
                        >
                          <span className="text-xs font-medium text-slate-900 w-16 shrink-0">
                            {a.acct}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {a.customer}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* PDF */}
              <Card>
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-xs font-semibold inline-flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />PDF Files
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-muted-foreground">
                      Description
                    </Label>
                    <Input
                      className="h-8 text-xs"
                      value={pdfDescription}
                      onChange={(e) => setPdfDescription(e.target.value)}
                      placeholder="e.g. Ariba invoicing guidelines"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-medium text-muted-foreground">PDF</Label>
                    <div className="flex gap-2">
                      <Input
                        className="h-8 text-xs"
                        value={pdfName}
                        onChange={(e) => setPdfName(e.target.value)}
                        placeholder="No file selected"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs shrink-0"
                        onClick={() => {
                          if (!pdfName.trim()) {
                            toast({ title: "Enter a file name first" });
                            return;
                          }
                          setFiles((p) => [
                            ...p,
                            { name: pdfName, description: pdfDescription },
                          ]);
                          setPdfName("");
                          setPdfDescription("");
                        }}
                      >
                        <Upload className="h-3.5 w-3.5 mr-1.5" />Select
                      </Button>
                    </div>
                  </div>
                  <Separator />
                  {files.length === 0 ? (
                    <div className="rounded-md border border-dashed py-6 text-center">
                      <FileText className="h-6 w-6 mx-auto mb-1.5 text-muted-foreground/40" />
                      <p className="text-[11px] text-muted-foreground">No data to display</p>
                    </div>
                  ) : (
                    <div className="rounded-md border divide-y">
                      {files.map((f, idx) => (
                        <div
                          key={`${f.name}-${idx}`}
                          className="flex items-center justify-between gap-2 px-2 py-1.5"
                        >
                          <div className="min-w-0">
                            <p className="text-xs truncate">{f.name}</p>
                            {f.description && (
                              <p className="text-[10px] text-muted-foreground truncate">
                                {f.description}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() =>
                              setFiles((p) => p.filter((_, i) => i !== idx))
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Instructions table (full width) */}
            <Card>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="sticky top-0 z-10">
                      <TableRow className="bg-muted hover:bg-muted">
                        <TableHead className="text-[11px] font-semibold w-14 text-center">
                          Line
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold min-w-[28rem]">
                          Instructions
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold w-44">People</TableHead>
                        <TableHead className="text-[11px] font-semibold w-44">History</TableHead>
                        <TableHead className="text-[11px] font-semibold w-24 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grouped.map(([type, rows]) => (
                        <Fragment key={type}>
                          <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableCell colSpan={5} className="py-1.5">
                              <span className="text-[11px] font-semibold uppercase tracking-wide">
                                {type}
                              </span>
                              <span className="text-[10px] text-muted-foreground ml-2">
                                {rows.length} item{rows.length === 1 ? "" : "s"}
                              </span>
                            </TableCell>
                          </TableRow>
                          {rows.map((r) => (
                            <TableRow key={r.id} className="group hover:bg-muted/40 align-top">
                              <TableCell className="py-2 text-center">
                                <Input
                                  value={r.line}
                                  onChange={(e) => setLine(r.id, e.target.value)}
                                  className="h-7 w-10 text-xs text-center px-1 mx-auto"
                                />
                              </TableCell>
                              <TableCell className="py-2">
                                <p
                                  className={`text-xs leading-relaxed max-w-[52rem] ${
                                    r.bold ? "font-semibold text-foreground" : "text-foreground/80"
                                  }`}
                                >
                                  {r.text}
                                </p>
                              </TableCell>
                              <TableCell className="py-2">
                                <p className="text-xs">{r.requestedBy}</p>
                                <p className="text-[10px] text-muted-foreground">
                                  Submitted: {r.submittedBy}
                                </p>
                              </TableCell>
                              <TableCell className="py-2 whitespace-nowrap">
                                <p className="text-[11px] text-muted-foreground">
                                  Created {r.created}
                                </p>
                                <p className="text-[10px] text-muted-foreground/80">
                                  Modified {r.modified}
                                </p>
                              </TableCell>

                              <TableCell className="py-2">
                                <div className="flex items-center justify-end gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    title="Edit"
                                    onClick={() => startEdit(r)}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-6 w-6 p-0 ${r.bold ? "bg-muted" : ""}`}
                                    title={r.bold ? "Unset bold" : "Set bold"}
                                    onClick={() => toggleBold(r.id)}
                                  >
                                    <Bold className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    title="Delete"
                                    onClick={() => setDeleteId(r.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>

                            </TableRow>
                          ))}
                        </Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="h-14" />
        </div>
      </main>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-[var(--sidebar-width,16rem)] right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="w-full max-w-none px-2 sm:px-4 lg:px-6 py-2 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => navigate("/manage-customers/sr-documents")}
          >
            Back
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
            onClick={() => toast({ title: "Saved", description: `${sr} updated.` })}
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />Save
          </Button>
        </div>
      </div>


      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete instruction?</AlertDialogTitle>
            <AlertDialogDescription>
              This instruction will be removed from {sr}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="h-8 text-xs bg-destructive hover:bg-destructive/90"
              onClick={() => {
                setItems((p) => p.filter((i) => i.id !== deleteId));
                setDeleteId(null);
                toast({ title: "Instruction deleted" });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SrDocumentDetail;
