// 定义事件类型接口
export interface EventData {
  key: number;
  title: string;
  description: string;
  notes: string;
  labels: string[];
  assignees: string[];
  type: string;
  project: string;
  milestone: string;
}

export const mockData: EventData[] = [
  {
    key: 1,
    title: 'Sample Event',
    description: 'description description description...',
    notes: 'write something about the task...',
    labels: ['Meeting'],
    assignees: ['Tom'],
    type: 'Discussion',
    project: 'AI Research',
    milestone: '2025.5.1',
  },
  {
    key: 2,
    title: 'Event 2',
    description: 'another event description',
    notes: 'discussion and results...',
    labels: ['Discussion'],
    assignees: ['Jerry'],
    type: 'Feature',
    project: 'Frontend Refactor',
    milestone: '2025.5.20',
  },
];
