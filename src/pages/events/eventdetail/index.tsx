import { Flex, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainContent from './components/MainContent';
import SidebarInfo from './components/SidebarInfo';
import { EventData, mockData } from './types';

const { Text } = Typography;

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
