import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Space, Tag, Tooltip, Typography } from 'antd';
import React from 'react';
import { Label } from '../types';

const { Text } = Typography;

const LabelItem: React.FC<{
  label: Label;
  onSelect: (name: string) => void;
}> = ({ label, onSelect }) => (
  <Row
    justify="space-between"
    align="middle"
    style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}
  >
    <Col flex="300px">
      <Tag
        color={label.color}
        style={{ fontSize: 13, padding: '2px 10px', borderRadius: 12, cursor: 'pointer' }}
        onClick={() => onSelect(label.name)}
      >
        {label.name}
      </Tag>
    </Col>
    <Col flex="auto">
      <Text type="secondary">{label.description}</Text>
    </Col>
    <Col>
      <Tooltip title={`${label.count} open tasks`}>
        <Space>
          <InfoCircleOutlined />
          <Text>{label.count}</Text>
        </Space>
      </Tooltip>
    </Col>
  </Row>
);

export default LabelItem;
