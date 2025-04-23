import { ProCard } from '@ant-design/pro-components';
import { Space } from 'antd';
import React from 'react';
import ActivityItem from './ActivityItem';
import { ActivityItem as ActivityItemType } from './types';

interface ActivityLogProps {
  activities: ActivityItemType[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  return (
    <ProCard title="Activity" bordered>
      <Space direction="vertical" style={{ width: '100%' }}>
        {activities.map((item) => (
          <ActivityItem key={item.id} item={item} />
        ))}
      </Space>
    </ProCard>
  );
};

export default ActivityLog;
