/**
 * PROTOTYPE ONLY — manual fallback for decision-results.md (2026-08-15).
 *
 * The normal path is fully automatic now: OpenDecisionsContext.tsx
 * debounce-POSTs the current results snapshot to a local dev-server route
 * (prototype.decisionLogServerPlugin.ts) that writes the file directly —
 * no button, no download, while `npm run dev` is running. This dialog only
 * shows up when that auto-save fails (`syncStatus === 'error'`, e.g. no
 * dev server behind this page — a production build/preview), as a manual
 * way to still get the current snapshot out of the browser.
 */
import React, { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useOpenDecisions } from '@/context/OpenDecisionsContext';

interface ExportResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RESULTS_FILENAME = 'decision-results.md';

const ExportResultsDialog: React.FC<ExportResultsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { resultsMarkdown, markExported } = useOpenDecisions();
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([resultsMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = RESULTS_FILENAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    markExported();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resultsMarkdown);
      setCopied(true);
      markExported();
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied/unavailable — the textarea below is
      // still fully selectable as a manual fallback.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export decision results</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground">
          Download this and replace{' '}
          <code className="rounded bg-muted px-1 py-0.5">
            /prototype/decisions/{RESULTS_FILENAME}
          </code>{' '}
          with it (create the file if it doesn't exist yet) so this session's Reviewed/
          Call/Comments state leaves the browser and becomes part of the committed record.
        </p>
        <textarea
          readOnly
          value={resultsMarkdown}
          className="h-80 w-full rounded-md border bg-muted/20 p-2 font-mono text-[11px]"
          onFocus={(e) => e.currentTarget.select()}
        />
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? 'Copied' : 'Copy to clipboard'}
          </Button>
          <Button size="sm" onClick={handleDownload} className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Download {RESULTS_FILENAME}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportResultsDialog;
