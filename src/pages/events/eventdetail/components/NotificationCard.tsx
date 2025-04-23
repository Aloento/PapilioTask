import { ProCard } from '@ant-design/pro-components';
import { Button, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const NotificationCard: React.FC = () => {
  return (
    <ProCard title="Notification" bordered>
      <Button type="primary" block>
        Subscribe
      </Button>
      <Text type="secondary">You're not receiving notifications from this thread.</Text>
    </ProCard>
  );
};

export default NotificationCard;
