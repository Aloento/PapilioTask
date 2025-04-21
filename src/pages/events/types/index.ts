// 定义类型接口
export interface EventItem {
  key: string | number;
  eventNumber: string;
  eventName: string;
  assignees: string;
  timeframe: string;
  labels: string[];
  status: string[];
}

export interface ScheduleItem {
  key: string;
  title: string;
  time: string;
  urgent: boolean;
  url: string;
}

export interface ColumnItem {
  title: string;
  dataIndex: string;
  key: string;
  render?: (text: any, record: any) => React.ReactNode;
  filters?: { text: string; value: string }[];
  onFilter?: (value: any, record: any) => boolean;
  fixed?: 'left' | 'right';
}
