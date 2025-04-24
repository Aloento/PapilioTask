import { usePolishText } from '@/services/llm';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Tooltip } from 'antd';
import React, { useState } from 'react';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

// 创建事件表单组件
const CreateEventModal: React.FC<{
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}> = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [isPolishing, setIsPolishing] = useState(false);
  const [description, setDescription] = useState('');
  const { polishText, loadingProgress } = usePolishText();

  const handlePolishDescription = async () => {
    const currentDescription = form.getFieldValue('description');
    if (!currentDescription?.trim()) return;

    setIsPolishing(true);
    try {
      // 使用流式处理，提供实时更新的回调函数
      await polishText(currentDescription, (updatedText) => {
        form.setFieldsValue({ description: updatedText });
        setDescription(updatedText);
      });
    } catch (error) {
      console.error('Error polishing text:', error);
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <Modal
      title="Create New Event"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        layout="vertical"
        onFinish={onSubmit}
        form={form}
      >
        <Row gutter={32}>
          <Col span={16}>
            <Form.Item
              label="Add a title"
              name="title"
              rules={[{ required: true, message: 'Please input the title!' }]}
            >
              <Input placeholder="Title" />
            </Form.Item>

            <Form.Item label="Add a description" name="description">
              <TextArea
                placeholder="Type your description here..."
                rows={8}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>

            <Tooltip title={loadingProgress < 100 ? `模型加载中: ${loadingProgress}%` : '使用AI优化描述文本'}>
              <Button
                onClick={handlePolishDescription}
                loading={isPolishing}
                disabled={loadingProgress < 100 || !description.trim()}
                icon={loadingProgress < 100 ? null : undefined}
              >
                {isPolishing ? "正在润色..." : loadingProgress < 100 ? `模型加载中 ${loadingProgress}%` : 'AI润色描述'}
              </Button>
            </Tooltip>

            <Space>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </Space>
          </Col>

          <Col span={8}>
            <Form.Item label="Assignees" name="assignees">
              <Select
                mode="multiple"
                placeholder="Select"
                style={{ width: '100%' }}
                options={[
                  { label: 'Tom', value: 'Tom' },
                  { label: 'Hermione', value: 'Hermione' },
                  { label: 'Harry', value: 'Harry' },
                ]}
              />
            </Form.Item>
            <Form.Item label="Labels" name="labels">
              <Select
                mode="multiple"
                placeholder="Select"
                style={{ width: '100%' }}
                options={[
                  { label: 'Discussion', value: 'Discussion' },
                  { label: 'Meeting', value: 'Meeting' },
                ]}
              />
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Select
                mode="multiple"
                placeholder="Select"
                style={{ width: '100%' }}
                options={[
                  { label: 'Pending', value: 'Pending' },
                  { label: 'Doing', value: 'Doing' },
                  { label: 'Finished', value: 'Finished' },
                  { label: 'Overdue', value: 'Overdue' },
                ]}
              />
            </Form.Item>

            <Form.Item label="Projects" name="projects">
              <Select mode="multiple" placeholder="Select" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Milestone" name="milestone">
              <Select mode="multiple" placeholder="Select" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Timeframe" name="timeframe">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateEventModal;
