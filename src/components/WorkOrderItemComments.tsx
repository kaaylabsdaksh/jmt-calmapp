import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus } from "lucide-react";
import { format } from "date-fns";

interface Comment {
  id: string;
  type: string;
  user: string;
  dateEntered: Date;
  comment: string;
  includeInCopy: boolean;
}

interface WorkOrderItemCommentsProps {
  workOrderItemId?: string;
}

export const WorkOrderItemComments: React.FC<WorkOrderItemCommentsProps> = ({ 
  workOrderItemId 
}) => {
  const [commentType, setCommentType] = useState<string>("");
  const [commentText, setCommentText] = useState<string>("");
  const [includeInCopy, setIncludeInCopy] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      type: "Estimate",
      user: "Admin User",
      dateEntered: new Date("2025-10-22T07:19:00"),
      comment: "Estimate status set to 'Sent to Customer'. Emailed to JonathanAtkinson@thenewtronggroup.com.",
      includeInCopy: false
    },
    {
      id: "2",
      type: "Estimate",
      user: "Admin User",
      dateEntered: new Date("2025-10-22T07:19:00"),
      comment: "Estimate status set to 'Sent to AR'. Email was sent to TammyPatt@jmtest.com",
      includeInCopy: false
    },
    {
      id: "3",
      type: "Estimate",
      user: "Admin User",
      dateEntered: new Date("2025-10-22T07:19:00"),
      comment: "Estimate status set to 'Awaiting Estimate'. Email was sent to tomcorvers@jmtest.com;tracymincin@jmtest.com",
      includeInCopy: false
    },
    {
      id: "4",
      type: "Other",
      user: "Admin User",
      dateEntered: new Date("2025-10-22T07:18:00"),
      comment: "C/C Cost updated.",
      includeInCopy: false
    },
    {
      id: "5",
      type: "Other",
      user: "Admin User",
      dateEntered: new Date("2025-10-22T07:18:00"),
      comment: "CHANGES: * Manufacturer/Model changed from '/' to '3D INSTRUMENTS/-30\"Hg-0-60 PSI' * Mfg Serial changed from '' to '312' * Cust ID changed from '' to '123' * Cust Serial changed from '' to '1234'",
      includeInCopy: false
    },
    {
      id: "6",
      type: "Other",
      user: "Admin User",
      dateEntered: new Date("2025-10-22T07:18:00"),
      comment: "Need By Date changed to 10/23/2025",
      includeInCopy: false
    }
  ]);

  const handleAddComment = () => {
    if (!commentType || !commentText.trim()) {
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      type: commentType,
      user: "Current User", // This should come from auth context
      dateEntered: new Date(),
      comment: commentText,
      includeInCopy
    };

    setComments([newComment, ...comments]);
    setCommentText("");
    setCommentType("");
    setIncludeInCopy(false);
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "estimate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "other":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "status":
        return "bg-green-100 text-green-800 border-green-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="rounded-t-none border-t-0 bg-gradient-to-br from-background to-muted/20">
      <CardContent className="p-8 space-y-8">
        {/* Add Comment Form - Modern Sleek Design */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl blur-xl" />
          <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-52 shrink-0">
                <Label htmlFor="comment-type" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 block">
                  Type
                </Label>
                <Select value={commentType} onValueChange={setCommentType}>
                  <SelectTrigger className="h-11 bg-background/50 backdrop-blur-sm border-border/60 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover border">
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Estimate">Estimate</SelectItem>
                    <SelectItem value="Status">Status Change</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Quality">Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Label htmlFor="comment-text" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 block">
                  Comment
                </Label>
                <Textarea
                  id="comment-text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Enter your comment..."
                  className="min-h-[110px] resize-none bg-background/50 backdrop-blur-sm border-border/60 hover:border-primary/50 focus:border-primary transition-colors"
                />
              </div>

              <div className="shrink-0 self-end">
                <Button 
                  onClick={handleAddComment}
                  disabled={!commentType || !commentText.trim()}
                  className="gap-2 h-11 px-8 shadow-md hover:shadow-lg transition-shadow"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4 pl-56">
              <Checkbox
                id="include-copy"
                checked={includeInCopy}
                onCheckedChange={(checked) => setIncludeInCopy(checked as boolean)}
                className="border-border/60"
              />
              <Label
                htmlFor="include-copy"
                className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              >
                Include in Copy as New
              </Label>
            </div>
          </div>
        </div>

        {/* Comments History - Modern Design */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/30 rounded-full" />
              <h3 className="text-base font-bold text-foreground">
                Activity History
              </h3>
              <Badge variant="secondary" className="rounded-full px-3">
                {comments.length}
              </Badge>
            </div>
          </div>

          {comments.length === 0 ? (
            <div className="border border-dashed rounded-xl p-12 text-center bg-muted/20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                No activity recorded yet
              </p>
              <p className="text-xs text-muted-foreground">
                All changes and updates will appear here
              </p>
            </div>
          ) : (
            <div className="border border-border/50 rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm shadow-md">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/40 backdrop-blur-sm border-b border-border/50">
                      <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-[100px]">
                        Type
                      </th>
                      <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-[140px]">
                        User
                      </th>
                      <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-[160px]">
                        Date
                      </th>
                      <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map((comment, index) => (
                      <tr
                        key={comment.id}
                        className={`border-b border-border/30 last:border-b-0 hover:bg-muted/30 transition-all duration-200 ${
                          index % 2 === 0 ? 'bg-background/50' : 'bg-muted/10'
                        }`}
                      >
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={`${getTypeColor(comment.type)} text-xs font-semibold shadow-sm`}
                          >
                            {comment.type}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm font-medium text-foreground">
                          {comment.user}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground font-mono">
                          {format(comment.dateEntered, "MM/dd/yyyy hh:mm a")}
                        </td>
                        <td className="p-4 text-sm text-foreground/90 leading-relaxed">
                          <div className="line-clamp-2 whitespace-pre-wrap">
                            {comment.comment}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-border/30">
                {comments.map((comment, index) => (
                  <div 
                    key={comment.id} 
                    className={`p-5 space-y-3 hover:bg-muted/30 transition-colors ${
                      index % 2 === 0 ? 'bg-background/50' : 'bg-muted/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Badge
                        variant="outline"
                        className={`${getTypeColor(comment.type)} text-xs font-semibold shadow-sm`}
                      >
                        {comment.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-mono">
                        {format(comment.dateEntered, "MM/dd/yyyy hh:mm a")}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {comment.user}
                    </div>
                    <div className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">
                      {comment.comment}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
