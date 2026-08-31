/**
 * PROTOTYPE ONLY — append-only comment thread.
 *
 * Extracted from OpenDecisionsPanel.tsx (D27) so JobDetailDialog's new
 * per-job Comments section (D27, sourced from Canada's RMID form's
 * Comments field and Andrea's real Detail page's Comments box) can reuse
 * the exact same, already-proven pattern instead of a second
 * implementation. Originally replaced an even earlier single-textarea
 * note field that autosaved on every keystroke, had no submit action, and
 * only ever held the latest text — direct user feedback that this read as
 * "how do I submit a comment / see a list of comments" since there was no
 * way to do either. Existing comments render above the input, oldest
 * first; submitting clears the draft and appends rather than overwriting.
 */
import React, { useState } from 'react';
import { format } from 'date-fns';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

/** Structurally identical to DecisionComment/JobComment — kept as an
 * inline shape here rather than importing either specific type, so this
 * component doesn't have to pick a "primary" owner between Open Decisions
 * and job comments. */
export interface ThreadComment {
  id: string;
  text: string;
  createdAt: string;
}

const CommentThread: React.FC<{
  comments: ThreadComment[];
  onAdd: (text: string) => void;
  placeholder?: string;
}> = ({ comments, onAdd, placeholder = 'Add a comment (this session only)…' }) => {
  const [draft, setDraft] = useState('');

  const submit = () => {
    if (!draft.trim()) return;
    onAdd(draft);
    setDraft('');
  };

  return (
    <div className="space-y-1.5">
      {comments.length > 0 && (
        <div className="max-h-32 space-y-2 overflow-y-auto rounded-md border bg-muted/20 p-2">
          {comments.map((c) => (
            <div key={c.id} className="text-xs">
              <span className="text-[10px] text-muted-foreground">
                {format(new Date(c.createdAt), 'MMM d, h:mm a')}
              </span>
              <p className="whitespace-pre-wrap text-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-end gap-1.5">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          className="min-h-[40px] text-xs"
        />
        <Button
          size="sm"
          className="h-8 shrink-0 gap-1 text-[11px]"
          onClick={submit}
          disabled={!draft.trim()}
        >
          <MessageSquarePlus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default CommentThread;
