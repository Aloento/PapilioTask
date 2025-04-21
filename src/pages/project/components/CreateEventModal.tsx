import { Col, Input, Modal, Row, Select, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph } = Typography;
const { Option } = Select;

interface CreateEventModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  eventName: string;
  setEventName: (name: string) => void;
  selectedColumn: string;
  setSelectedColumn: (column: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  columnTypes: string[];
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  eventName,
  setEventName,
  selectedColumn,
  setSelectedColumn,
  selectedTag,
  setSelectedTag,
  columnTypes,
}) => (
  <Modal
    title="Create New Event"
    open={visible}
    onCancel={onCancel}
    onOk={onSubmit}
    okText="Create project"
    cancelText="Cancel"
  >
    <Row gutter={32}>
      <Col span={8}>
        <Title level={5}>New board</Title>
        <Paragraph>
          Start with a board to spread your issues and pull requests across customizable
          columns. Easily switch to a table or roadmap layout at any time.
        </Paragraph>
      </Col>
      <Col span={16}>
        <Title level={5}>Event name</Title>
        <Input
          placeholder="e.g. @yourname's awesome project"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />

        <Title level={5} style={{ marginTop: 16 }}>
          Type
        </Title>
        <Select
          placeholder="Select column"
          style={{ width: '100%' }}
          value={selectedColumn}
          onChange={(value) => setSelectedColumn(value)}
        >
          {columnTypes.map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>

        <Title level={5} style={{ marginTop: 16 }}>
          Label
        </Title>
        <Select
          value={selectedTag}
          onChange={(value) => setSelectedTag(value)}
          style={{ width: '100%' }}
        >
          <Option value="Discussion">Discussion</Option>
          <Option value="Meeting">Meeting</Option>
        </Select>
      </Col>
    </Row>
  </Modal>
);

export default CreateEventModal;
