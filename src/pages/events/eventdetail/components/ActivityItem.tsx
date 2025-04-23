import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Flex, Tag, Typography } from 'antd';
import React from 'react';
import { ActivityItem as ActivityItemType } from './types';

const { Text, Paragraph } = Typography;

interface ActivityItemProps {
  item: ActivityItemType;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ item }) => {
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

export default ActivityItem;
