import React from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
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
    title="创建新里程碑"
    open={visible}
    onCancel={onCancel}
    onOk={onSubmit}
    okText="创建"
    cancelText="取消"
  >
    <Form layout="vertical" form={form}>
      <Form.Item
        label="里程碑名称"
        name="name"
        rules={[{ required: true, message: '请输入里程碑名称' }]}
      >
        <Input placeholder="例如：新功能测试版" />
      </Form.Item>
      <Form.Item
        label="关联事件"
        name="eventId"
        rules={[{ required: true, message: '请选择关联事件' }]}
      >
        <Select
          showSearch
          placeholder="选择关联事件"
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
        label="时间范围"
        name="timeframe"
      >
        <DatePicker.RangePicker style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="描述"
        name="description"
      >
        <Input.TextArea placeholder="描述此里程碑的目标和范围..." rows={4} />
      </Form.Item>
    </Form>
  </Modal>
);

export default AddMilestoneModal;
