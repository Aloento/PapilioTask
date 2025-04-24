export interface Event {
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
  updatedDaysAgo?: number;
  updatedHoursAgo?: number;
  updatedMinutesAgo?: number;
  closedOn?: string;
  description: string;
  events: Event[];
}
