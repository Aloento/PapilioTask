import { Card, Col, Flex, Tag, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const { Text, Link } = Typography;

interface ScheduleItem {
  key: string;
  title: string;
  time: string;
  urgent: boolean;
}

// 日程组件
const TodaySchedule: React.FC<{ data: ScheduleItem[] }> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <Card title="Today's Schedule" style={{ marginBottom: 24 }}>
      {data.map((item) => (
        <Flex vertical gap={12} key={item.key} style={{ padding: 12 }}>
          <Col span={24}>
            <Text strong>{item.title}</Text>
            <Text style={{ marginLeft: 8, color: '#888' }}>{item.time}</Text>
            {item.urgent && (
              <Tag color="red" style={{ marginLeft: 8 }}>
                Urgent
              </Tag>
            )}
            <div>
              <Link onClick={() => navigate(`/events/eventdetail/${item.key}`)}>
                View Details
              </Link>
            </div>
          </Col>
        </Flex>
      ))}
    </Card>
  );
};

export default TodaySchedule;
