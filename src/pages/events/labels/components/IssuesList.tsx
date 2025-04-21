import { MessageOutlined } from '@ant-design/icons';
import { Avatar, Card, List, Space, Tag } from 'antd';
import React from 'react';
import { Issue } from '../types';

const IssuesList: React.FC<{
  issues: Issue[];
  selectedLabel: string;
  onBackClick: () => void;
}> = ({ issues, selectedLabel, onBackClick }) => (
  <Card
    title={`Issues tagged with "${selectedLabel}"`}
    extra={<a onClick={onBackClick}>← Back</a>}
  >
    <List
      dataSource={issues}
      itemLayout="vertical"
      renderItem={(item) => (
        <List.Item
          key={item.id}
          actions={[<Space key="comments"><MessageOutlined /> {item.comments}</Space>]}
        >
          <List.Item.Meta
            avatar={<Avatar>{item.author[0].toUpperCase()}</Avatar>}
            title={<a href={`/issues/${item.id}`}>{item.title}</a>}
            description={`#${item.id} opened ${item.time} by ${item.author}`}
          />
          <div>
            {item.labels.map((l) => (
              <Tag key={l}>{l}</Tag>
            ))}
          </div>
        </List.Item>
      )}
    />
  </Card>
);

export default IssuesList;
