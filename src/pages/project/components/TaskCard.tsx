import { Avatar, Card, Space, Tag, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, getTagColor } from '../types';

const { Text } = Typography;

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();

  return (
    <Card size="small" bordered style={{ marginBottom: 8 }}>
      <Space direction="vertical">
        <Text type="secondary">
          <strong>{task.number}</strong>
        </Text>
        <Text
          strong
          style={{ color: '#1677ff', cursor: 'pointer' }}
          onClick={() => navigate(`/events/eventdetail/${task.id}`)}
        >
          {task.name}
        </Text>
        <div>
          {task.tags.map((tag: string) => (
            <Tag key={tag} color={getTagColor(tag)}>
              {tag}
            </Tag>
          ))}
          <Avatar
            size={24}
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            style={{ marginLeft: 8 }}
          />
        </div>
      </Space>
    </Card>
  );
};

export default TaskCard;
