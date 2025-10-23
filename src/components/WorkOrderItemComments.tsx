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
    <Card className="rounded-t-none border-t-0">
      <CardContent className="p-6 space-y-6">
        {/* Add Comment Form - Clean Modern Design */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-48 shrink-0">
              <Label htmlFor="comment-type" className="text-sm font-medium mb-2 block">
                Type
              </Label>
              <Select value={commentType} onValueChange={setCommentType}>
                <SelectTrigger className="h-10 bg-background border-border/60">
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
              <Label htmlFor="comment-text" className="text-sm font-medium mb-2 block">
                Comment
              </Label>
              <Textarea
                id="comment-text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter your comment..."
                className="min-h-[100px] resize-none bg-background border-border/60"
              />
            </div>

            <div className="shrink-0 self-end">
              <Button 
                onClick={handleAddComment}
                disabled={!commentType || !commentText.trim()}
                className="gap-2 h-10 px-6"
              >
                <Plus className="h-4 w-4" />
                Add Comment
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2 pl-52">
            <Checkbox
              id="include-copy"
              checked={includeInCopy}
              onCheckedChange={(checked) => setIncludeInCopy(checked as boolean)}
            />
            <Label
              htmlFor="include-copy"
              className="text-sm font-normal cursor-pointer text-muted-foreground"
            >
              Include in Copy as New
            </Label>
          </div>
        </div>

        {/* Comments History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground/90">
              History ({comments.length} {comments.length === 1 ? 'entry' : 'entries'})
            </h3>
          </div>

          {comments.length === 0 ? (
            <div className="border rounded-lg p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No comments recorded yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All changes and updates will appear here
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-3 text-xs font-semibold text-foreground/80 w-[100px]">
                        Type
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-foreground/80 w-[140px]">
                        User
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-foreground/80 w-[160px]">
                        Date Entered
                      </th>
                      <th className="text-left p-3 text-xs font-semibold text-foreground/80">
                        Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map((comment) => (
                      <tr
                        key={comment.id}
                        className="border-b last:border-b-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            className={`${getTypeColor(comment.type)} text-xs font-medium`}
                          >
                            {comment.type}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-foreground/90">
                          {comment.user}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {format(comment.dateEntered, "MM/dd/yyyy hh:mm a")}
                        </td>
                        <td className="p-3 text-sm text-foreground/90">
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
              <div className="md:hidden divide-y">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge
                        variant="outline"
                        className={`${getTypeColor(comment.type)} text-xs font-medium`}
                      >
                        {comment.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(comment.dateEntered, "MM/dd/yyyy hh:mm a")}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-foreground/90">
                      {comment.user}
                    </div>
                    <div className="text-sm text-foreground/80 whitespace-pre-wrap">
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
