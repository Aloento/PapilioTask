import { Form, FormInstance, Select } from 'antd';
import React from 'react';

interface CreateEventFormProps {
  form: FormInstance;
  eventNumbers: string[];
  eventNames: string[];
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({
  form,
  eventNumbers,
  eventNames,
}) => {
  return (
    <Form layout="vertical" form={form}>
      <Form.Item
        name="eventNumber"
        label="事件编号"
        rules={[{ required: true, message: '请选择事件编号' }]}
      >
        <Select
          placeholder="选择事件编号"
          options={eventNumbers.map((e) => ({ value: e }))}
        />
      </Form.Item>

      <Form.Item
        name="eventName"
        label="事件名称"
        rules={[{ required: true, message: '请选择事件名称' }]}
      >
        <Select
          placeholder="选择事件名称"
          options={eventNames.map((e) => ({ value: e }))}
        />
      </Form.Item>
    </Form>
  );
};

export default CreateEventForm;
