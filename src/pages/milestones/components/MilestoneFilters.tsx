import { CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Space, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

interface MilestoneFiltersProps {
  statusFilter: 'open' | 'closed';
  setStatusFilter: (status: 'open' | 'closed') => void;
  searchText: string;
  setSearchText: (text: string) => void;
  openCount: number;
  closedCount: number;
  onAddMilestone: () => void;
}

const MilestoneFilters: React.FC<MilestoneFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  searchText,
  setSearchText,
  openCount,
  closedCount,
  onAddMilestone,
}) => (
  <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
    <Col>
      <Space>
        <CheckCircleOutlined />
        <Title level={4} style={{ margin: 0 }}>Milestones</Title>
      </Space>
    </Col>
    <Col>
      <Space>
        <Input
          allowClear
          placeholder="Search milestones"
          style={{ width: 200 }}
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          type="default"
          style={{
            backgroundColor: statusFilter === 'open' ? '#f6f8fa' : undefined,
            border: statusFilter === 'open' ? '1px solid #d0d7de' : undefined,
            fontWeight: statusFilter === 'open' ? 600 : undefined,
          }}
          onClick={() => setStatusFilter('open')}
        >
          {openCount} Open
        </Button>
        <Button
          type="default"
          style={{
            backgroundColor: statusFilter === 'closed' ? '#f6f8fa' : undefined,
            border: statusFilter === 'closed' ? '1px solid #d0d7de' : undefined,
            fontWeight: statusFilter === 'closed' ? 600 : undefined,
          }}
          onClick={() => setStatusFilter('closed')}
        >
          {closedCount} Closed
        </Button>
        <Button type="primary" onClick={onAddMilestone}>
          Add Milestone
        </Button>
      </Space>
    </Col>
  </Row>
);

export default MilestoneFilters;
