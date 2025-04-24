import { EditOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Button, Flex, Modal, Space, Tag, Typography, message } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import EditEventForm from '../../components/EditEventForm';
import { fetchEventComments } from '../../service';
import { EventData } from '../../types';
import ActivityLog from './ActivityLog';
import CommentSection from './CommentSection';
import { ActivityItem } from './types';

const { Title, Text, Paragraph } = Typography;

// 主要内容组件
interface MainContentProps {
  event: EventData;
  onUpdateEvent: (values: any) => Promise<void>;
}

const MainContent: React.FC<MainContentProps> = ({ event, onUpdateEvent }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventStatus, setEventStatus] = useState(event.status?.[0] || 'Pending');
  const [isEditing, setIsEditing] = useState(false);

  // 获取事件评论
  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await fetchEventComments(event.key);
      setActivities(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      message.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载评论
  useEffect(() => {
    fetchComments();
  }, [event.key]);

  // 添加评论
  const handleAddComment = (newComment: ActivityItem) => {
    setActivities(prev => [...prev, newComment]);
  };

  // 更改事件状态
  const handleChangeStatus = async () => {
    const newStatus = eventStatus === 'Pending' ? 'Finished' : 'Pending';

    try {
      await onUpdateEvent({ status: [newStatus] });

      const statusActivity: ActivityItem = {
        id: Date.now().toString(),
        type: 'system',
        content: `changed status to ${newStatus}`,
        user: 'Current User',
        timestamp: new Date().toLocaleString(),
      };

      setActivities([...activities, statusActivity]);
      setEventStatus(newStatus);
      message.success(`Event status changed to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      message.error('Failed to update status');
    }
  };

  // 处理编辑事件
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleUpdate = async (values: any) => {
    try {
      await onUpdateEvent(values);
      setIsEditing(false);

      // 记录活动
      const updateActivity: ActivityItem = {
        id: Date.now().toString(),
        type: 'system',
        content: 'updated event details',
        user: 'Current User',
        timestamp: new Date().toLocaleString(),
      };

      setActivities([...activities, updateActivity]);
    } catch (error) {
      console.error('Failed to update event:', error);
      message.error('Failed to update event');
    }
  };

  // 格式化创建时间
  const formattedCreatedAt = event.createdAt
    ? dayjs(event.createdAt).format('YYYY-MM-DD HH:mm:ss')
    : 'Unknown';

  return (
    <Flex vertical gap={24} style={{ flex: 2 }}>
      <ProCard bordered>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <Text type="secondary">{event.eventNumber}</Text>
            <Title level={3} style={{ margin: '8px 0' }}>{event.eventName}</Title>
          </div>
          <Button icon={<EditOutlined />} onClick={handleEdit}>Edit</Button>
        </div>

        <Space>
          {event.labels.map(label => (
            <Tag key={label} color={label === 'Discussion' ? 'pink' : 'gold'}>
              {label}
            </Tag>
          ))}
          {event.status.map(status => {
            let color = 'default';
            switch (status) {
              case 'Pending': color = 'blue'; break;
              case 'Doing': color = 'gold'; break;
              case 'Finished': color = 'green'; break;
              case 'Overdue': color = 'red'; break;
            }
            return (
              <Tag key={status} color={color}>
                {status}
              </Tag>
            );
          })}
        </Space>

        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
          Created on {formattedCreatedAt}
        </Text>
      </ProCard>

      <ProCard title="Description" bordered>
        <Paragraph>{event.description}</Paragraph>
      </ProCard>

      <CommentSection
        eventId={event.key}
        eventStatus={eventStatus}
        onAddComment={handleAddComment}
        onChangeStatus={handleChangeStatus}
      />

      <ActivityLog activities={activities} loading={loading} />

      <Modal
        title="Edit Event"
        open={isEditing}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <EditEventForm
          event={event}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
        />
      </Modal>
    </Flex>
  );
};

export default MainContent;
