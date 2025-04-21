import { Button, Card, Divider, message, Typography } from 'antd';
import React from 'react';
import { NotificationChannel, NotificationType } from '../types';
import NotificationToggle from './NotificationToggle';

const { Paragraph, Link } = Typography;

interface SubscriptionsSectionProps {
    notifyWatching: NotificationChannel;
    notifyParticipating: NotificationChannel;
    customizeUpdates: boolean;
    toggleNotification: (type: NotificationType, channel: NotificationChannel) => void;
    setCustomizeUpdates: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubscriptionsSection: React.FC<SubscriptionsSectionProps> = ({
    notifyWatching,
    notifyParticipating,
    customizeUpdates,
    toggleNotification,
    setCustomizeUpdates
}) => (
    <Card title="Subscriptions" style={{ marginBottom: 24 }}>
        <Paragraph>
            <strong>Watching</strong>
            <br />
            Notifications for all repositories, teams, or conversations you're watching.{' '}
            <Link>View watched repositories</Link>.
        </Paragraph>
        <NotificationToggle
            type="watching"
            currentChannel={notifyWatching}
            onToggle={toggleNotification}
        />

        <Divider />

        <Paragraph>
            <strong>Participating, @mentions and custom</strong>
            <br />
            Notifications for the conversations you are participating in, or if someone cites you with an @mention.
        </Paragraph>
        <NotificationToggle
            type="participating"
            currentChannel={notifyParticipating}
            onToggle={toggleNotification}
        />

        <Divider />

        <Paragraph>
            <strong>Customize email updates</strong>
            <br />
            Choose which additional events you'll receive emails for when participating or watching.
        </Paragraph>
        <Button
            type={customizeUpdates ? 'primary' : 'default'}
            onClick={() => {
                setCustomizeUpdates((prev) => !prev);
                message.success(`Customize email updates ${!customizeUpdates ? 'enabled' : 'disabled'}`);
            }}
        >
            {customizeUpdates ? 'Enabled: Reviews, Pushes, Comments' : 'Enable custom updates'}
        </Button>
    </Card>
);

export default SubscriptionsSection;
