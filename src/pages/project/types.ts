export interface Task {
  id: number;
  number: string;
  name: string;
  tags: string[];
}

export interface BoardColumn {
  columnTitle: string;
  count: number;
  tasks: Task[];
}

// 标签颜色映射
export const getTagColor = (tag: string): string => {
  switch (tag) {
    case 'Discussion':
      return 'pink';
    case 'Meeting':
      return 'gold';
    default:
      return 'blue';
  }
};

export const columnTypes = ['Team User Stories', 'In Progress', 'Urgent', 'Performance', 'Done'];
