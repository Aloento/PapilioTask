import { UserOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Avatar, Button, Card, Flex, Input, Select, Space, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import { EventData } from '../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// 活动项类型定义
type ActivityItem = {
  id: string;
  type: 'system' | 'comment';
  content: string;
  user: string;
  timestamp: string;
  title?: string;
};

// 示例活动数据
const sampleActivities: ActivityItem[] = [
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

// 主要内容组件
const MainContent: React.FC<{ event: EventData }> = ({ event }) => {
  const [comment, setComment] = useState('');
  const [activities, setActivities] = useState<ActivityItem[]>(sampleActivities);
  const [eventStatus, setEventStatus] = useState('open');

  // 添加评论
  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      type: 'comment',
      content: comment,
      user: 'Current User', // 实际应用中应从用户信息获取
      timestamp: new Date().toLocaleString(),
    };

    setActivities([...activities, newActivity]);
    setComment('');
  };

  // 关闭事件
  const handleCloseEvent = () => {
    const closeActivity: ActivityItem = {
      id: Date.now().toString(),
      type: 'system',
      content: 'closed this event',
      user: 'Current User',
      timestamp: new Date().toLocaleString(),
    };

    setActivities([...activities, closeActivity]);
    setEventStatus('closed');
  };

  // 渲染活动项
  const renderActivityItem = (item: ActivityItem) => {
    if (item.type === 'system') {
      return (
        <Card
          key={item.id}
          size="small"
          style={{ backgroundColor: '#f6f8fa' }}
          title={
            <Flex align="center">
              <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
              <Text strong>{item.user}</Text>
              <Text type="secondary" style={{ marginLeft: 8 }}>{item.content}</Text>
              <Text type="secondary" style={{ marginLeft: 'auto' }}>{item.timestamp}</Text>
            </Flex>
          }
        >
          {item.title && <Tag color="blue">{item.title}</Tag>}
        </Card>
      );
    } else {
      return (
        <Card
          key={item.id}
          size="small"
          title={
            <Flex align="center">
              <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 8 }} />
              <Text strong>{item.user}</Text>
              <Text type="secondary" style={{ marginLeft: 'auto' }}>{item.timestamp}</Text>
            </Flex>
          }
        >
          <Paragraph>{item.content}</Paragraph>
        </Card>
      );
    }
  };

  return (
    <Flex vertical gap={24} style={{ flex: 2 }}>
      <ProCard bordered>
        <Title level={4}>{event.title} #{event.key}</Title>
        <Text type={eventStatus === 'closed' ? 'success' : 'secondary'}>
          {eventStatus === 'open' ? 'Opened 3 hours ago' : 'Closed'}
        </Text>
      </ProCard>

      <ProCard title="Description" bordered>
        <Paragraph>{event.description}</Paragraph>
      </ProCard>

      {/* 添加评论区域 */}
      <ProCard title="Add Comment" bordered>
        <Space direction="vertical" style={{ width: '100%' }}>
          <TextArea
            rows={4}
            placeholder="Leave a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Flex justify="space-between">
            <Space>
              <Button type="primary" onClick={handleAddComment}>
                Comment
              </Button>
              <Select
                defaultValue="open"
                style={{ width: 120 }}
                options={[
                  { value: 'open', label: 'Open' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'review', label: 'Review' },
                ]}
              />
            </Space>
            <Button
              danger={eventStatus === 'open'}
              type={eventStatus === 'open' ? 'primary' : 'default'}
              onClick={handleCloseEvent}
            >
              {eventStatus === 'open' ? 'Close Event' : 'Reopen Event'}
            </Button>
          </Flex>
        </Space>
      </ProCard>

      {/* Activity log */}
      <ProCard title="Activity" bordered>
        <Space direction="vertical" style={{ width: '100%' }}>
          {activities.map(renderActivityItem)}
        </Space>
      </ProCard>
    </Flex>
  );
};

export default MainContent;
