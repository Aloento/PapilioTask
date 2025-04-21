export interface Issue {
  id: string;
  title: string;
  labels: string[];
  author: string;
  time: string;
  comments: number;
}

export interface Milestone {
  title: string;
  status: 'open' | 'closed';
  percent: number;
  open: number;
  closed: number;
  updatedDaysAgo: number;
  closedOn: string;
  description: string;
  issues: Issue[];
}
