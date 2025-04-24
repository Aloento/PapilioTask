import { Form, Select, Spin } from 'antd';
import React from 'react';

interface AddEventFormProps {
  form: any;
  events: { label: string; value: string }[];
  loading: boolean;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ form, events, loading }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="eventNumber"
        label="选择事件"
        rules={[{ required: true, message: '请选择一个事件' }]}
      >
        <Select
          showSearch
          placeholder="选择要添加的事件"
          loading={loading}
          notFoundContent={loading ? <Spin size="small" /> : '没有可选的事件'}
          options={events}
          filterOption={true}
          optionFilterProp="label"
          style={{ width: '100%' }}
          listHeight={300}
          defaultOpen={true}  // 默认打开下拉列表
          virtual={false}     // 禁用虚拟滚动以显示所有选项
        />
      </Form.Item>
    </Form>
  );
};

export default AddEventForm;
