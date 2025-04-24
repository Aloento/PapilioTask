// 表格列配置
export interface ColumnItem {
  title: string;
  dataIndex: string;
  key: string;
  render?: (text: any, record: any) => JSX.Element;
  filters?: { text: string; value: string }[];
  onFilter?: (value: string, record: any) => boolean;
  fixed?: 'left' | 'right';
}

// 事件列表项
export interface EventItem {
  key: React.Key;
  eventNumber: string;
  eventName: string;
  assignees: string;
  timeframe: string;
  labels: string[];
  status: string[];
}

// 今日日程项
export interface ScheduleItem {
  key: string;
  title: string;
  time: string;
  urgent: boolean;
  url?: string;
}

// 事件详情数据
export interface EventData {
  key: React.Key;
  eventNumber: string;
  eventName: string;
  description: string;
  timeframe: string;
  labels: string[];
  status: string[];
  participants: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
