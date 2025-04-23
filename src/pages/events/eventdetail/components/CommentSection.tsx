import { ProCard } from '@ant-design/pro-components';
import { Button, Flex, Input, Select, Space } from 'antd';
import React, { useState } from 'react';

const { TextArea } = Input;

interface CommentSectionProps {
  eventStatus: string;
  onAddComment: (comment: string) => void;
  onChangeStatus: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  eventStatus,
  onAddComment,
  onChangeStatus
}) => {
  const [comment, setComment] = useState('');

  const handleAddComment = () => {
    if (!comment.trim()) return;
    onAddComment(comment);
    setComment('');
  };

  return (
    <ProCard title="Add Comment" bordered>
      <Space direction="vertical" style={{ width: '100%' }}>
        <TextArea
          rows={4}
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Flex justify="space-between">
          <Space>
            <Button type="primary" onClick={handleAddComment}>
              Comment
            </Button>
            <Select
              defaultValue="open"
              style={{ width: 120 }}
              options={[
                { value: 'open', label: 'Open' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'review', label: 'Review' },
              ]}
            />
          </Space>
          <Button
            danger={eventStatus === 'open'}
            type={eventStatus === 'open' ? 'primary' : 'default'}
            onClick={onChangeStatus}
          >
            {eventStatus === 'open' ? 'Close Event' : 'Reopen Event'}
          </Button>
        </Flex>
      </Space>
    </ProCard>
  );
};

export default CommentSection;
