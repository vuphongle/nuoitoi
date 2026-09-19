'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, User as UserIcon } from 'lucide-react';
import { FEEDBACK_TYPES, type FeedbackItem } from '@/types';

interface FeedbackDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: FeedbackItem | null;
}

function typeLabel(type: string) {
  return FEEDBACK_TYPES.find((option) => option.value === type)?.label || type;
}

export function FeedbackDetailDialog({ open, onOpenChange, feedback }: FeedbackDetailDialogProps) {
  if (!feedback) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Chi tiết phản hồi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-muted/40 p-4">
            <div className="min-w-0 space-y-1">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                {feedback.name}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {feedback.created_at
                  ? new Date(feedback.created_at).toLocaleString('vi-VN')
                  : '—'}
              </p>
            </div>
            <Badge variant="secondary">{typeLabel(feedback.type)}</Badge>
          </div>

          <div className="space-y-1">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MessageSquare className="h-3 w-3" /> Tiêu đề
            </p>
            <p className="font-medium text-foreground">{feedback.title}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Nội dung</p>
            <p className="whitespace-pre-wrap rounded-lg border border-border bg-background p-3 text-sm text-foreground">
              {feedback.description}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
