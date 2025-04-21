import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { Dayjs } from 'dayjs';
import React from 'react';
import { useNavigate } from 'react-router-dom';

// 组件解构
const { Title } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// 表单值类型定义
interface EventFormValues {
  title: string;
  description?: string;
  assignees?: string[];
  labels?: string[];
  type?: string;
  projects?: string;
  milestone?: string;
  timeframe?: [Dayjs, Dayjs];
  createMore?: boolean;
}

/**
 * 事件创建表单页面
 */
const EventFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<EventFormValues>();

  // 表单提交处理
  const handleSubmit = (values: EventFormValues) => {
    console.log('表单提交:', values);
    navigate('/'); // 返回主页
  };

  // 取消操作
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Card>
        <Title level={4}>创建新事件</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          <Row gutter={32}>
            {/* 左侧区域 - 主要信息 */}
            <Col span={16}>
              <Form.Item
                label="事件标题"
                name="title"
                rules={[{ required: true, message: '请输入事件标题！' }]}
              >
                <Input placeholder="输入标题" />
              </Form.Item>

              <Form.Item label="事件描述" name="description">
                <TextArea
                  placeholder="在此输入事件详细描述..."
                  rows={8}
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Form.Item name="createMore" valuePropName="checked">
                <Checkbox>创建后继续添加</Checkbox>
              </Form.Item>

              <Space size="middle">
                <Button onClick={handleCancel}>取消</Button>
                <Button type="primary" htmlType="submit">创建事件</Button>
              </Space>
            </Col>

            {/* 右侧区域 - 附加信息 */}
            <Col span={8}>
              <Form.Item label="指派成员" name="assignees">
                <Select
                  placeholder="选择成员"
                  mode="multiple"
                  allowClear
                />
              </Form.Item>

              <Form.Item label="标签" name="labels">
                <Select
                  placeholder="选择标签"
                  mode="multiple"
                  allowClear
                />
              </Form.Item>

              <Form.Item label="类型" name="type">
                <Select placeholder="选择类型">
                  <Select.Option value="bug">Bug</Select.Option>
                  <Select.Option value="feature">功能</Select.Option>
                  <Select.Option value="task">任务</Select.Option>
                  <Select.Option value="improvement">改进</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="所属项目" name="projects">
                <Select placeholder="选择项目" allowClear />
              </Form.Item>

              <Form.Item label="里程碑" name="milestone">
                <Select placeholder="选择里程碑" allowClear />
              </Form.Item>

              <Form.Item label="时间范围" name="timeframe">
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default EventFormPage;
