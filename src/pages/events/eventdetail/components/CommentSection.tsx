import { usePolishText } from '@/services/llm';
import { ProCard } from '@ant-design/pro-components';
import { Button, Flex, Input, Select, Space, Tooltip, message } from 'antd';
import React, { useState } from 'react';
import { addEventComment } from '../../service';

const { TextArea } = Input;

interface CommentSectionProps {
  eventId: React.Key;
  eventStatus: string;
  onAddComment: (comment: any) => void;
  onChangeStatus: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  eventId,
  eventStatus,
  onAddComment,
  onChangeStatus
}) => {
  const [comment, setComment] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { polishText, loadingProgress } = usePolishText();

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      // 调用API添加评论
      const result = await addEventComment(eventId, comment);
      // 通知父组件更新评论列表
      onAddComment(result);
      setComment('');
      message.success('Comment added successfully');
    } catch (error) {
      console.error('Failed to add comment:', error);
      message.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePolishComment = async () => {
    if (!comment.trim()) return;
    setIsPolishing(true);

    try {
      // 使用流式处理，提供实时更新的回调函数
      await polishText(comment, (updatedText) => {
        setComment(updatedText);
      });
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
            <Button
              type="primary"
              onClick={handleAddComment}
              loading={isSubmitting}
              disabled={!comment.trim()}
            >
              Comment
            </Button>
            <Tooltip title={loadingProgress < 100 ? `模型加载中: ${loadingProgress}%` : '使用AI优化评论文本'}>
              <Button
                onClick={handlePolishComment}
                loading={isPolishing}
                disabled={loadingProgress < 100 || !comment.trim()}
                style={loadingProgress < 100 ? {
                  background: `linear-gradient(to right, #f0f0f0 ${loadingProgress}%, white ${loadingProgress}%)`
                } : {}}
              >
                {isPolishing ? "正在润色..." : loadingProgress < 100 ? `模型加载中 ${loadingProgress}%` : 'AI润色评论'}
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
