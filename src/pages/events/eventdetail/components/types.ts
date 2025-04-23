
// 活动项类型定义
export type ActivityItem = {
  id: string;
  type: 'system' | 'comment';
  content: string;
  user: string;
  timestamp: string;
  title?: string;
};

// 示例活动数据
export const sampleActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'system',
    content: 'changed status from "Open" to "In Progress"',
    user: 'System',
    timestamp: '2023-07-15 10:30',
  },
  {
    id: '2',
    type: 'comment',
    content: 'I think we should consider refactoring this part of the code.',
    user: 'Tom',
    timestamp: '2023-07-15 11:45',
  },
  {
    id: '3',
    type: 'system',
    content: 'added label',
    user: 'Jerry',
    timestamp: '2023-07-16 09:22',
    title: 'bug',
  },
  {
    id: '4',
    type: 'comment',
    content: 'Let me take a look at this issue this afternoon.',
    user: 'Harry',
    timestamp: '2023-07-16 14:15',
  },
];
