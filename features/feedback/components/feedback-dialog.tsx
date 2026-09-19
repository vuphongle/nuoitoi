'use client';

import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { useSubmitFeedback } from '@/hooks/use-feedbacks';
import { getApiErrorMessage } from '@/lib/api-error';
import { useI18n } from '@/hooks/useI18n';
import { FEEDBACK_TYPES } from '@/types';
import { feedbackSchema, type FeedbackFormValues } from '../schemas/feedback.schema';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emptyValues: FeedbackFormValues = {
  name: '',
  type: FEEDBACK_TYPES[0].value,
  title: '',
  description: '',
};

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const { t } = useI18n('lixi');
  const { success, error } = useNotification();
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: emptyValues,
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  React.useEffect(() => {
    if (open) reset(emptyValues);
  }, [open, reset]);

  const submitMutation = useSubmitFeedback({
    onSuccess: () => {
      success(t('feedbackDialog.success'));
      onOpenChange(false);
    },
    onError: (err) => error(getApiErrorMessage(err, t('feedbackDialog.error'))),
  });

  const onSubmit = handleSubmit((values) => {
    submitMutation.mutate(values);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{t('feedbackDialog.title')}</DialogTitle>
          <DialogDescription>{t('feedbackDialog.description')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-2 py-2" noValidate>
          <div className="space-y-2">
            <Label htmlFor="feedback-name" required>
              {t('feedbackDialog.name')}
            </Label>
            <Input
              className="mt-2"
              id="feedback-name"
              placeholder={t('feedbackDialog.namePlaceholder')}
              error={errors.name?.message ? t(errors.name.message) : undefined}
              {...register('name')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-type" required>
              {t('feedbackDialog.type')}
            </Label>
            <div className="mt-2">
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
                          {t(`feedbackDialog.types.${option.value}`)}
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
              {t('feedbackDialog.subject')}
            </Label>
            <Input
              className="mt-2"
              id="feedback-title"
              placeholder={t('feedbackDialog.subjectPlaceholder')}
              error={errors.title?.message ? t(errors.title.message) : undefined}
              {...register('title')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-description" required>
              {t('feedbackDialog.content')}
            </Label>
            <Textarea
              className="mt-2"
              id="feedback-description"
              rows={4}
              placeholder={t('feedbackDialog.contentPlaceholder')}
              {...register('description')}
            />
            {errors.description?.message ? (
              <p className="text-sm text-destructive" role="alert">
                {t(errors.description.message)}
              </p>
            ) : null}
          </div>

          <DialogFooter className="pt-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => onOpenChange(false)}
              disabled={submitMutation.isPending}
            >
              {t('feedbackDialog.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={submitMutation.isPending}
              isLoading={submitMutation.isPending}
              className="cursor-pointer"
              style={{ background: 'linear-gradient(120deg, #d7263d, #f28c28)' }}
            >
              {t('feedbackDialog.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
