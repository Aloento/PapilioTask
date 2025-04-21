import { ProCard } from '@ant-design/pro-components';
import { Avatar, Button, Flex, Space, Tag, Typography } from 'antd';
import React from 'react';
import { EventData } from '../types';

const { Text } = Typography;

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

export default SidebarInfo;
