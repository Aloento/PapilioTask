import { CommentOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Avatar, List, Space, Spin, Typography } from 'antd';
import React from 'react';
import { ActivityItem } from './types';

const { Text } = Typography;

interface ActivityLogProps {
  activities: ActivityItem[];
  loading?: boolean;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities, loading = false }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <CommentOutlined />;
      case 'system':
        return <InfoCircleOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  return (
    <ProCard title="Activity" bordered>
      <Spin spinning={loading}>
        {activities.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={activities}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar icon={getActivityIcon(item.type)} />
                  }
                  title={
                    <Space>
                      <Text strong>{item.user}</Text>
                      <Text type="secondary">{item.timestamp}</Text>
                    </Space>
                  }
                  description={
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                      {item.type === 'system' ? (
                        <Text>{item.user} {item.content}</Text>
                      ) : (
                        item.content
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Text type="secondary">No activity yet</Text>
        )}
      </Spin>
    </ProCard>
  );
};

export default ActivityLog;
