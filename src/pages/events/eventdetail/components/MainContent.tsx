import { ProCard } from '@ant-design/pro-components';
import { Card, Flex, Space, Tag, Typography } from 'antd';
import React from 'react';
import { EventData } from '../types';

const { Title, Text, Paragraph } = Typography;

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

export default MainContent;
