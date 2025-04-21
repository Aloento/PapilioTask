import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const { Text, Link } = Typography;

// 定义类型接口
interface EventItem {
  key: string | number;
  eventNumber: string;
  eventName: string;
  assignees: string;
  timeframe: string;
  labels: string[];
  status: string[];
}

// 通知提醒组件
const NotificationCard: React.FC<{ data: EventItem }> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <Card
      variant='outlined'
      style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f', marginBottom: 16 }}
    >
      <Text type="success">
        <ExclamationCircleOutlined style={{ marginRight: 8 }} />
        One of your tasks is about to expire, the project is called{' '}
        <strong>{data.eventName}</strong>,{' '}
        <Link onClick={() => navigate(`/events/eventdetail/${data.key}`)}>
          click to jump!
        </Link>
      </Text>
    </Card>
  );
};

export default NotificationCard;
