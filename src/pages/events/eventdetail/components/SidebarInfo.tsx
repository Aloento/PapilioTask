import { CalendarOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Card, Divider, List, Popconfirm, Select, Space, Tag, Typography, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { EventData } from '../../types';

const { Title } = Typography;

interface SidebarInfoProps {
  event: EventData;
  onUpdateEvent: (values: any) => Promise<void>;
  onDeleteEvent: () => Promise<void>;
}

const SidebarInfo: React.FC<SidebarInfoProps> = ({
  event,
  onUpdateEvent,
  onDeleteEvent
}) => {
  // 状态管理
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    event.participants?.length ? [event.participants[0]] : []
  );
  const [selectedLabels, setSelectedLabels] = useState<string[]>(event.labels || []);
  const [loading, setLoading] = useState(false);

  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss');
  };

  // 处理分配人变更
  const handleAssigneeChange = async (value: string[]) => {
    setLoading(true);
    try {
      await onUpdateEvent({ assignees: value });
      setSelectedAssignees(value);
      message.success('Assignees updated successfully');
    } catch (error) {
      console.error('Failed to update assignees:', error);
      message.error('Failed to update assignees');
    } finally {
      setLoading(false);
    }
  };

  // 处理标签变更
  const handleLabelChange = async (value: string[]) => {
    setLoading(true);
    try {
      await onUpdateEvent({ labels: value });
      setSelectedLabels(value);
      message.success('Labels updated successfully');
    } catch (error) {
      console.error('Failed to update labels:', error);
      message.error('Failed to update labels');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ flex: 1, minWidth: 300 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>Event Details</Title>
        <Popconfirm
          title="Delete this event?"
          description="This action cannot be undone."
          onConfirm={onDeleteEvent}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button danger icon={<DeleteOutlined />}>Delete</Button>
        </Popconfirm>
      </div>

      <List
        itemLayout="horizontal"
        split={false}
        style={{ marginBottom: 24 }}
      >
        <List.Item>
          <List.Item.Meta
            avatar={<CalendarOutlined style={{ fontSize: 24 }} />}
            title="Timeframe"
            description={event.timeframe}
          />
        </List.Item>

        <List.Item>
          <List.Item.Meta
            avatar={<TeamOutlined style={{ fontSize: 24 }} />}
            title="Assignees"
            description={
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Select assignees"
                value={selectedAssignees}
                onChange={handleAssigneeChange}
                loading={loading}
                options={[
                  { label: 'Tom', value: 'Tom' },
                  { label: 'Hermione', value: 'Hermione' },
                  { label: 'Harry', value: 'Harry' },
                  { label: 'Unassigned', value: 'Unassigned' }
                ]}
              />
            }
          />
        </List.Item>

        <List.Item>
          <List.Item.Meta
            title="Labels"
            description={
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Select labels"
                value={selectedLabels}
                onChange={handleLabelChange}
                loading={loading}
                options={[
                  { label: 'Discussion', value: 'Discussion' },
                  { label: 'Meeting', value: 'Meeting' },
                  { label: 'Task', value: 'Task' },
                  { label: 'Bug', value: 'Bug' }
                ]}
              />
            }
          />
        </List.Item>

        <List.Item>
          <List.Item.Meta
            title="Participants"
            description={
              <Space wrap>
                {event.participants.map(participant => (
                  <Tag key={participant}>{participant}</Tag>
                ))}
              </Space>
            }
          />
        </List.Item>
      </List>

      <Divider />

      <Title level={5}>Created & Updated</Title>
      <List
        itemLayout="horizontal"
        split={false}
      >
        <List.Item>
          <List.Item.Meta
            title="Created At"
            description={event.createdAt ? formatDate(event.createdAt.toString()) : 'Unknown'}
          />
        </List.Item>
        <List.Item>
          <List.Item.Meta
            title="Last Updated"
            description={event.updatedAt ? formatDate(event.updatedAt.toString()) : 'Unknown'}
          />
        </List.Item>
      </List>
    </Card>
  );
};

export default SidebarInfo;
