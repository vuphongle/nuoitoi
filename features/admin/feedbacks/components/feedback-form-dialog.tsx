'use client';

import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNotification } from '@/components/ui/notification';
import { useCreateFeedback, useUpdateFeedback } from '@/hooks/use-feedbacks';
import { getApiErrorMessage } from '@/lib/api-error';
import { FEEDBACK_TYPES, type FeedbackItem } from '@/types';
import {
  feedbackSchema,
  type FeedbackFormValues,
} from '@/features/feedback/schemas/feedback.schema';

interface FeedbackFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback?: FeedbackItem | null;
}

const emptyValues: FeedbackFormValues = {
  name: '',
  type: FEEDBACK_TYPES[0].value,
  title: '',
  description: '',
};

function valuesFromFeedback(item: FeedbackItem): FeedbackFormValues {
  return {
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
  };
}

export function FeedbackFormDialog({ open, onOpenChange, feedback }: FeedbackFormDialogProps) {
  const isEdit = Boolean(feedback);
  const { success, error } = useNotification();
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: feedback ? valuesFromFeedback(feedback) : emptyValues,
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  React.useEffect(() => {
    reset(feedback ? valuesFromFeedback(feedback) : emptyValues);
  }, [feedback, open, reset]);

  const createMutation = useCreateFeedback({
    onSuccess: () => {
      success('Tạo phản hồi thành công!');
      onOpenChange(false);
    },
    onError: (err) => error(getApiErrorMessage(err, 'Có lỗi xảy ra khi tạo phản hồi')),
  });

  const updateMutation = useUpdateFeedback({
    onSuccess: () => {
      success('Cập nhật phản hồi thành công!');
      onOpenChange(false);
    },
    onError: (err) => error(getApiErrorMessage(err, 'Có lỗi xảy ra khi cập nhật phản hồi')),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = handleSubmit((values) => {
    if (isEdit && feedback) {
      updateMutation.mutate({ id: feedback.id, payload: values });
    } else {
      createMutation.mutate(values);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa phản hồi' : 'Thêm phản hồi mới'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="feedback-name" required>
                Họ và tên
              </Label>
              <Input
                id="feedback-name"
                placeholder="Nguyễn Minh Huy"
                error={errors.name?.message}
                {...register('name')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-type" required>
                Loại phản hồi
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="feedback-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FEEDBACK_TYPES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-title" required>
              Tiêu đề
            </Label>
            <Input
              id="feedback-title"
              placeholder="Tóm tắt ngắn gọn nội dung"
              error={errors.title?.message}
              {...register('title')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-description" required>
              Nội dung
            </Label>
            <Textarea id="feedback-description" rows={5} {...register('description')} />
            {errors.description ? (
              <p className="text-sm text-destructive" role="alert">
                {errors.description.message}
              </p>
            ) : null}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending} isLoading={isPending}>
              {isEdit ? 'Lưu thay đổi' : 'Tạo phản hồi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
