import { ProCard } from '@ant-design/pro-components';
import { Avatar, Button, Card, Flex, Space, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

// 定义事件类型接口
interface EventData {
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

const mockData = [
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

// 侧边栏信息组件
const SidebarInfo: React.FC<{ event: EventData }> = ({ event }) => {
  return (
    <Flex vertical gap={16} style={{ width: 300 }}>
      <ProCard title="Assignees" bordered>
        {event.assignees && event.assignees.length > 0 ? (
          <Space>
            {event.assignees.map((assignee, index) => (
              <Text key={index}>{assignee}</Text>
            ))}
          </Space>
        ) : (
          <Text type="secondary">No one assigned</Text>
        )}
      </ProCard>

      <ProCard title="Labels" bordered>
        {event.labels && event.labels.length > 0 ? (
          <Space>
            {event.labels.map((label, index) => (
              <Tag color="magenta" key={index}>{label}</Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary">No labels</Text>
        )}
      </ProCard>

      <ProCard title="Type" bordered>
        {event.type ? (
          <Text>{event.type}</Text>
        ) : (
          <Text type="secondary">No type</Text>
        )}
      </ProCard>

      <ProCard title="Projects" bordered>
        {event.project ? (
          <Text>{event.project}</Text>
        ) : (
          <Text type="secondary">No projects</Text>
        )}
      </ProCard>

      <ProCard title="Milestone" bordered>
        {event.milestone ? (
          <Text>Due date: {event.milestone}</Text>
        ) : (
          <Text type="secondary">No milestone</Text>
        )}
      </ProCard>

      <ProCard title="Notification" bordered>
        <Button type="primary" block>
          Subscribe
        </Button>
        <Text type="secondary">You're not receiving notifications from this thread.</Text>
      </ProCard>

      <ProCard title="Participants" bordered>
        <Avatar.Group maxCount={5}>
          <Avatar src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Janice" />
          <Avatar>K</Avatar>
          <Avatar>R</Avatar>
          <Avatar style={{ backgroundColor: '#87d068' }}>+2</Avatar>
        </Avatar.Group>
      </ProCard>
    </Flex>
  );
};

// 主要内容组件
const MainContent: React.FC<{ event: EventData }> = ({ event }) => {
  return (
    <Flex vertical gap={24} style={{ flex: 2 }}>
      <ProCard bordered>
        <Title level={4}>{event.title} #{event.key}</Title>
        <Text type="secondary">Opened 3 hours ago</Text>
      </ProCard>

      <ProCard title="Description" bordered>
        <Paragraph>{event.description}</Paragraph>
      </ProCard>

      <ProCard title="Notes" bordered>
        <Paragraph>{event.notes}</Paragraph>
      </ProCard>

      {/* Activity log */}
      <ProCard title="Activity" bordered>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card size="small" title="Jerry added this label 4 days ago">
            <Tag color="gold">{event.labels[0] || 'Label'}</Tag>
          </Card>
          <Card size="small" title="Harry added this link 4 days ago">
            <Text>Link to the project</Text>
          </Card>
          <Card size="small" title="Tom left a comment 4 days ago">
            <Paragraph italic>
              Comment regarding this event...
            </Paragraph>
          </Card>
        </Space>
      </ProCard>
    </Flex>
  );
};

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventData | null>(null);

  useEffect(() => {
    const found = mockData.find((item) => String(item.key) === id);
    setEvent(found || null);
  }, [id]);

  if (!event) {
    return <Text type="danger">Event not found.</Text>;
  }

  return (
    <Flex gap={24} style={{ padding: 24 }} align="start">
      {/* 左侧：主要内容 */}
      <MainContent event={event} />

      {/* 右侧：侧边栏信息 */}
      <SidebarInfo event={event} />
    </Flex>
  );
};

export default EventDetail;
