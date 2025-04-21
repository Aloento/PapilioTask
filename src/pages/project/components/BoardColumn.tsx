import { Card, Space, Typography } from 'antd';
import React from 'react';
import { BoardColumn } from '../types';
import TaskCard from './TaskCard';

const { Text } = Typography;

interface BoardColumnProps {
  column: BoardColumn;
}

const BoardColumnComponent: React.FC<BoardColumnProps> = ({ column }) => (
  <Card
    title={
      <Space>
        <span>{column.columnTitle}</span>
        <Text type="secondary">{column.count}</Text>
      </Space>
    }
    variant="outlined"
    styles={{ body: { padding: 12 } }}
  >
    {column.tasks.map((task) => (
      <TaskCard key={task.id} task={task} />
    ))}
  </Card>
);

export default BoardColumnComponent;
