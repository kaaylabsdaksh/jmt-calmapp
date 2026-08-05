import { useEffect, useState } from "react";
import { Mail, Send, Paperclip, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export type EmailComposeValues = {
  from: string;
  to: string;
  subject: string;
  comments: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  defaults: EmailComposeValues;
  attachments?: string[];
  bodyLabel?: string;
  bodyMinHeight?: string;
  onSend: (values: EmailComposeValues) => void;
};

export default function EmailComposeDialog({
  open,
  onOpenChange,
  title,
  description,
  defaults,
  attachments = [],
  bodyLabel = "Comments",
  bodyMinHeight = "min-h-[104px]",
  onSend,
}: Props) {
  const [values, setValues] = useState<EmailComposeValues>(defaults);

  useEffect(() => {
    if (open) setValues(defaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const set = (k: keyof EmailComposeValues, v: string) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-1 border-b bg-muted/40 px-5 py-4 text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Mail className="h-4 w-4" />
            </span>
            <DialogTitle className="text-sm font-semibold">{title}</DialogTitle>
          </div>
          {description ? (
            <DialogDescription className="text-xs">{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="space-y-3 px-5 py-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-muted-foreground">From</Label>
              <Input
                value={values.from}
                onChange={(e) => set("from", e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-muted-foreground">
                To <span className="text-destructive">*</span>
              </Label>
              <Input
                value={values.to}
                onChange={(e) => set("to", e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-[11px] font-medium text-muted-foreground">Subject</Label>
            <Input
              value={values.subject}
              onChange={(e) => set("subject", e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-[11px] font-medium text-muted-foreground">{bodyLabel}</Label>
              <span className="text-[10px] text-muted-foreground">
                {values.comments.length}/1000
              </span>
            </div>
            <Textarea
              value={values.comments}
              maxLength={1000}
              onChange={(e) => set("comments", e.target.value)}
              placeholder="Add a short message…"
              className={`${bodyMinHeight} resize-none text-xs leading-relaxed`}
            />
          </div>

          {attachments.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium text-muted-foreground">Attachments</Label>
              <div className="flex flex-wrap gap-1.5">
                {attachments.map((a) => (
                  <Badge
                    key={a}
                    variant="secondary"
                    className="gap-1 rounded-full px-2 py-0.5 text-[10px] font-normal"
                  >
                    <Paperclip className="h-3 w-3" />
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-end gap-2 border-t bg-muted/30 px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => onOpenChange(false)}
          >
            <X className="mr-1.5 h-3.5 w-3.5" /> Cancel
          </Button>
          <Button
            size="sm"
            className="h-8 bg-green-600 text-xs text-white hover:bg-green-700"
            disabled={!values.to.trim()}
            onClick={() => {
              onSend(values);
              onOpenChange(false);
            }}
          >
            <Send className="mr-1.5 h-3.5 w-3.5" /> Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
