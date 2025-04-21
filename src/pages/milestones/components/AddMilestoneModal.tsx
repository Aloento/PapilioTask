import { DatePicker, Form, Input, Modal, Select } from 'antd';
import React from 'react';
import { Event } from '../types';

interface AddMilestoneModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  form: any;
  events: Event[];
}

const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  form,
  events
}) => (
  <Modal
    title="Create New Milestone"
    open={visible}
    onCancel={onCancel}
    onOk={onSubmit}
    okText="Create"
    cancelText="Cancel"
  >
    <Form layout="vertical" form={form}>
      <Form.Item
        label="Milestone Name"
        name="name"
        rules={[{ required: true, message: 'Please enter milestone name' }]}
      >
        <Input placeholder="e.g.: New Feature Beta" />
      </Form.Item>
      <Form.Item
        label="Related Event"
        name="eventId"
        rules={[{ required: true, message: 'Please select a related event' }]}
      >
        <Select
          showSearch
          placeholder="Select related event"
          optionFilterProp="children"
          filterOption={(input, option) =>
            ((option?.children as unknown) as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {events
            .filter((e) => e.status !== 'Finished')
            .map((e) => (
              <Select.Option key={e.id} value={e.id}>
                {e.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Timeframe"
        name="timeframe"
      >
        <DatePicker.RangePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
      >
        <Input.TextArea placeholder="Describe the goals and scope of this milestone..." rows={4} />
      </Form.Item>
    </Form>
  </Modal>
);

export default AddMilestoneModal;
