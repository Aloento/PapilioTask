import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Button, message, Space } from 'antd';
import { EventData } from '../types';
import dayjs from 'dayjs';
import { usePolishText } from '@/services/llm';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface EditEventFormProps {
  event: EventData;
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
}

const EditEventForm: React.FC<EditEventFormProps> = ({ event, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const { polishText, loadingProgress } = usePolishText();

  // 从timeframe字符串解析日期范围
  const parseTimeframe = (timeframe: string) => {
    const dates = timeframe.split(' - ').map(date => dayjs(date));
    return dates.length === 2 ? dates : [dayjs(), dayjs().add(1, 'day')];
  };

  // 初始化表单值
  const initialValues = {
    title: event.eventName,
    description: event.description,
    timeframe: parseTimeframe(event.timeframe),
    assignees: event.participants,
    labels: event.labels,
    status: event.status,
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await onSubmit(values);
      message.success('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      message.error('Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  // 处理AI润色描述
  const handlePolishDescription = async () => {
    const currentDescription = form.getFieldValue('description');
    if (!currentDescription?.trim()) return;

    setIsPolishing(true);
    try {
      await polishText(currentDescription, (updatedText) => {
        form.setFieldsValue({ description: updatedText });
      });
    } catch (error) {
      console.error('Error polishing text:', error);
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="title"
        label="Event Name"
        rules={[{ required: true, message: 'Please enter event name' }]}
      >
        <Input placeholder="Event Name" />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <TextArea rows={6} placeholder="Event Description" />
      </Form.Item>

      <Button
        onClick={handlePolishDescription}
        loading={isPolishing}
        disabled={loadingProgress < 100}
        style={{ marginBottom: 16 }}
      >
        {isPolishing ? "AI polishing..." : "Polish with AI"}
      </Button>

      <Form.Item
        name="timeframe"
        label="Timeframe"
        rules={[{ required: true, message: 'Please select timeframe' }]}
      >
        <RangePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="assignees" label="Assignees">
        <Select
          mode="multiple"
          placeholder="Select assignees"
          options={[
            { label: 'Tom', value: 'Tom' },
            { label: 'Hermione', value: 'Hermione' },
            { label: 'Harry', value: 'Harry' },
          ]}
        />
      </Form.Item>

      <Form.Item name="labels" label="Labels">
        <Select
          mode="multiple"
          placeholder="Select labels"
          options={[
            { label: 'Discussion', value: 'Discussion' },
            { label: 'Meeting', value: 'Meeting' },
          ]}
        />
      </Form.Item>

      <Form.Item name="status" label="Status">
        <Select
          mode="multiple"
          placeholder="Select status"
          options={[
            { label: 'Pending', value: 'Pending' },
            { label: 'Doing', value: 'Doing' },
            { label: 'Finished', value: 'Finished' },
            { label: 'Overdue', value: 'Overdue' },
          ]}
        />
      </Form.Item>

      <Space>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save Changes
        </Button>
      </Space>
    </Form>
  );
};

export default EditEventForm;
