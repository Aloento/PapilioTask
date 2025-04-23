import { ProCard } from '@ant-design/pro-components';
import { Flex, Typography } from 'antd';
import React, { useState } from 'react';
import { EventData } from '../types';
import ActivityLog from './ActivityLog';
import CommentSection from './CommentSection';
import { ActivityItem, sampleActivities } from './types';

const { Title, Text, Paragraph } = Typography;

// 主要内容组件
const MainContent: React.FC<{ event: EventData }> = ({ event }) => {
  const [activities, setActivities] = useState<ActivityItem[]>(sampleActivities);
  const [eventStatus, setEventStatus] = useState('open');

  // 添加评论
  const handleAddComment = (comment: string) => {
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      type: 'comment',
      content: comment,
      user: 'Current User', // 实际应用中应从用户信息获取
      timestamp: new Date().toLocaleString(),
    };

    setActivities([...activities, newActivity]);
  };

  // 更改事件状态
  const handleChangeStatus = () => {
    const statusActivity: ActivityItem = {
      id: Date.now().toString(),
      type: 'system',
      content: eventStatus === 'open' ? 'closed this event' : 'reopened this event',
      user: 'Current User',
      timestamp: new Date().toLocaleString(),
    };

    setActivities([...activities, statusActivity]);
    setEventStatus(eventStatus === 'open' ? 'closed' : 'open');
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

      <CommentSection
        eventStatus={eventStatus}
        onAddComment={handleAddComment}
        onChangeStatus={handleChangeStatus}
      />

      <ActivityLog activities={activities} />
    </Flex>
  );
};

export default MainContent;
