export type Issue = {
  id: string;
  reviewId: string;
  file: string;
  line: number;
  severity: 'critical' | 'warning' | 'suggestion';
  message: string;
};

export type Review = {
  id: string;
  repoName: string;
  prNumber: number;
  prTitle: string;
  prAuthor: string;
  verdict: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
  summary: string;
  issueCount: number;
  createdAt: string;
  issues: Issue[];
};

export type Stats = {
  totalReviews: number;
  totalIssues: number;
  critical: number;
  warning: number;
  suggestion: number;
};
