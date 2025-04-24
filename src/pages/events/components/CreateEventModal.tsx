import { usePolishText } from '@/services/llm';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Tooltip, message } from 'antd';
import React, { useState } from 'react';
import { createEvent } from '../service';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      // 检查是否处理的是完整事件对象
      if (values.key && values.eventNumber) {
        // 如果是完整事件对象，直接提交
        const result = await createEvent(values);
        message.success('Event created successfully');
        onSubmit(result); // 只在服务调用成功后调用onSubmit
        form.resetFields();
        return;
      }

      // 否则，格式化表单数据
      const formattedValues = {
        title: values.title,
        description: values.description || '',
        timeframe: values.timeframe
          ? values.timeframe.map(date => date.format('YYYY/MM/DD'))
          : undefined,
        assignees: values.assignees || [],
        labels: values.labels || [],
        status: values.status || ['Pending'],
      };

      console.log('Submitting form data:', formattedValues);

      // 直接将API调用结果传给onSubmit，不要再处理一次
      const result = await createEvent(formattedValues);
      message.success('Event created successfully');
      onCancel(); // 关闭模态框
      onSubmit(result); // 回调上层组件更新数据
      form.resetFields();
    } catch (error) {
      console.error('Error creating event:', error);

      // 尝试获取详细错误信息
      let errorMsg = 'Failed to create event';
      if (error.response && error.response.data && error.response.data.error) {
        errorMsg = `${errorMsg}: ${error.response.data.error}`;
      }

      message.error(errorMsg);
    } finally {
      setIsSubmitting(false);
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
        onFinish={handleSubmit}
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

            <Space style={{ marginTop: 16 }}>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
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

            <Form.Item
              label="Timeframe"
              name="timeframe"
              rules={[{ required: true, message: 'Please select a timeframe!' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateEventModal;
