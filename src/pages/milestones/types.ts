export interface Milestone {
  id?: string;
  title: string;
  status: 'open' | 'closed';
  percent: number;
  open: number;
  closed: number;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  updatedMinutesAgo?: number;
  updatedHoursAgo?: number;
  updatedDaysAgo?: number;
  closedOn?: string;
  description?: string;
  eventId?: number;
}

export interface Event {
  id: number;
  name: string;
  status: 'Ongoing' | 'Pending' | 'Finished';
}
