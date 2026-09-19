import { z } from 'zod';

export const feedbackSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'feedbackDialog.validation.nameRequired')
    .max(255, 'feedbackDialog.validation.nameMax'),
  type: z
    .string()
    .trim()
    .min(1, 'feedbackDialog.validation.typeRequired')
    .max(50, 'feedbackDialog.validation.typeMax'),
  title: z
    .string()
    .trim()
    .min(1, 'feedbackDialog.validation.subjectRequired')
    .max(255, 'feedbackDialog.validation.subjectMax'),
  description: z.string().trim().min(1, 'feedbackDialog.validation.contentRequired'),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
