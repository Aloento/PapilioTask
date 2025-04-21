import { Button, Space } from 'antd';
import React from 'react';
import { NotificationChannel, NotificationType } from '../types';

interface NotificationToggleProps {
    type: NotificationType;
    currentChannel: NotificationChannel;
    onToggle: (type: NotificationType, channel: NotificationChannel) => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({ type, currentChannel, onToggle }) => (
    <Space>
        <Button
            type={currentChannel === 'github' ? 'primary' : 'default'}
            onClick={() => onToggle(type, 'github')}
        >
            On GitHub
        </Button>
        <Button
            type={currentChannel === 'email' ? 'primary' : 'default'}
            onClick={() => onToggle(type, 'email')}
        >
            Email
        </Button>
    </Space>
);

export default NotificationToggle;
