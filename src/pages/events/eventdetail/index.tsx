import { Flex, Typography, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainContent from './components/MainContent';
import SidebarInfo from './components/SidebarInfo';
import { EventData } from '../types';
import { fetchEventDetail, updateEvent, deleteEvent } from '../service';

const { Text } = Typography;

const EventDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取事件详情
  const fetchEvent = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data = await fetchEventDetail(id);
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      message.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  // 更新事件
  const handleUpdateEvent = async (values: any) => {
    if (!id || !event) return;

    setLoading(true);
    try {
      const updated = await updateEvent(id, values);
      setEvent(prev => prev ? { ...prev, ...updated } : null);
      message.success('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      message.error('Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  // 删除事件
  const handleDeleteEvent = async () => {
    if (!id) return;

    setLoading(true);
    try {
      await deleteEvent(id);
      message.success('Event deleted successfully');
      navigate('/events');
    } catch (error) {
      console.error('Error deleting event:', error);
      message.error('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ height: '80vh' }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!event) {
    return <Text type="danger">Event not found.</Text>;
  }

  return (
    <Flex gap={24} style={{ padding: 24 }} align="start">
      {/* 左侧：主要内容 */}
      <MainContent
        event={event}
        onUpdateEvent={handleUpdateEvent}
      />

      {/* 右侧：侧边栏信息 */}
      <SidebarInfo
        event={event}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </Flex>
  );
};

export default EventDetail;
