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
        label="Event Number"
        rules={[{ required: true, message: 'Please select an event number' }]}
      >
        <Select
          placeholder="Select event number"
          options={eventNumbers.map((e) => ({ value: e }))}
        />
      </Form.Item>

      <Form.Item
        name="eventName"
        label="Event Name"
        rules={[{ required: true, message: 'Please select an event name' }]}
      >
        <Select
          placeholder="Select event name"
          options={eventNames.map((e) => ({ value: e }))}
        />
      </Form.Item>
    </Form>
  );
};

export default CreateEventForm;
