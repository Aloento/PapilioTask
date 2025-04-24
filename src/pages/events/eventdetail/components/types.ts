// 活动项类型定义
export interface ActivityItem {
  id: string;
  type: 'comment' | 'system' | 'update';
  content: string;
  user: string;
  timestamp: string;
  createdAt?: Date | string;
}

// 示例活动数据
export const sampleActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'system',
    content: 'created this event',
    user: 'Admin',
    timestamp: '2023-06-10 14:30:00',
  },
  {
    id: '2',
    type: 'comment',
    content: 'This event needs to be prioritized.',
    user: 'Tom',
    timestamp: '2023-06-10 15:45:00',
  },
  {
    id: '3',
    type: 'system',
    content: 'changed status to Doing',
    user: 'Hermione',
    timestamp: '2023-06-11 09:15:00',
  },
];
