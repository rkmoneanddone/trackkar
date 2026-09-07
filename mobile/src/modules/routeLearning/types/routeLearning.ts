export type RouteLearningStatus =
  | 'DRAFT'
  | 'LEARNING'
  | 'FINALIZING'
  | 'ACTIVE'
  | 'RELEARNING';

export type RouteDirection = 'OUTBOUND' | 'RETURN' | 'CUSTOM';

export type RouteLearningSummary = {
  validRunsRequired: number;
  validRunsCollected: number;
  status: RouteLearningStatus;
};
