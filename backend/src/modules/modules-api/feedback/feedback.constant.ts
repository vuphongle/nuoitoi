export const FEEDBACK_TYPES = [
  'bug',
  'feature_request',
  'improvement',
  'general',
] as const;

export type FeedbackType = (typeof FEEDBACK_TYPES)[number];
