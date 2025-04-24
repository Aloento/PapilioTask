import { usePolishText } from '@/services/llm';
import { ProCard } from '@ant-design/pro-components';
import { Button, Flex, Input, Select, Space, Tooltip } from 'antd';
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
  const [isPolishing, setIsPolishing] = useState(false);
  const { polishText, loadingProgress } = usePolishText();

  const handleAddComment = () => {
    if (!comment.trim()) return;
    onAddComment(comment);
    setComment('');
  };

  const handlePolishComment = async () => {
    if (!comment.trim()) return;
    setIsPolishing(true);

    try {
      const { result } = await polishText(comment);
      if (result) {
        setComment(result);
      }
    } catch (error) {
      console.error('Error polishing text:', error);
    } finally {
      setIsPolishing(false);
    }
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
            <Tooltip title={loadingProgress < 100 ? `模型加载中: ${loadingProgress}%` : '使用AI优化评论文本'}>
              <Button
                onClick={handlePolishComment}
                loading={isPolishing}
                disabled={loadingProgress < 100 || !comment.trim()}
                icon={loadingProgress < 100 ? `${loadingProgress}%` : undefined}
              >
                {loadingProgress < 100 ? `加载中 ${loadingProgress}%` : 'AI润色'}
              </Button>
            </Tooltip>
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
