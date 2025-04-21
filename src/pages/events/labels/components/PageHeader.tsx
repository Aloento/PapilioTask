import { TagOutlined } from '@ant-design/icons';
import { Col, Input, Row, Space, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

const PageHeader: React.FC<{
  selectedLabel: string | null;
  searchKeyword: string;
  onSearchChange: (value: string) => void;
}> = ({ selectedLabel, searchKeyword, onSearchChange }) => (
  <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
    <Col>
      <Space>
        <TagOutlined />
        <Title level={4} style={{ margin: 0 }}>
          Labels
        </Title>
      </Space>
    </Col>
    <Col>
      {!selectedLabel && (
        <Input.Search
          allowClear
          placeholder="Search all labels"
          style={{ width: 300 }}
          value={searchKeyword}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      )}
    </Col>
  </Row>
);

export default PageHeader;
