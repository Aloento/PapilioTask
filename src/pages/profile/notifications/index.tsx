import { message, Modal, Typography } from 'antd';
import React, { useState } from 'react';
import DefaultEmailSection from './components/DefaultEmailSection';
import SubscriptionsSection from './components/SubscriptionsSection';
import { NotificationChannel, NotificationType } from './types';

const { Title } = Typography;

const NotificationsPage: React.FC = () => {
  // 状态管理
  const [email, setEmail] = useState('n563212895131017@outlook.com');
  const [notifyWatching, setNotifyWatching] = useState<NotificationChannel>('email');
  const [notifyParticipating, setNotifyParticipating] = useState<NotificationChannel>('github');
  const [customizeUpdates, setCustomizeUpdates] = useState(false);

  // 处理自定义路由
  const handleCustomRouting = () => {
    Modal.info({
      title: 'Custom Email Routing',
      content: (
        <div>
          <p>You can set custom email routes in your organization settings.</p>
        </div>
      ),
      onOk() { },
    });
  };

  // 切换通知类型
  const toggleNotification = (
    type: NotificationType,
    channel: NotificationChannel
  ) => {
    if (type === 'watching') {
      setNotifyWatching(channel);
      message.success(`Watching notifications set to ${channel}`);
    } else {
      setNotifyParticipating(channel);
      message.success(`Participating notifications set to ${channel}`);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Notifications</Title>

      <DefaultEmailSection
        email={email}
        setEmail={setEmail}
        handleCustomRouting={handleCustomRouting}
      />

      <SubscriptionsSection
        notifyWatching={notifyWatching}
        notifyParticipating={notifyParticipating}
        customizeUpdates={customizeUpdates}
        toggleNotification={toggleNotification}
        setCustomizeUpdates={setCustomizeUpdates}
      />
    </div>
  );
};

export default NotificationsPage;
