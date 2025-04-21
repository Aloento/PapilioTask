import React from 'react';
import { Col, Progress, Row, Space, Tag, Typography } from 'antd';
import { Milestone } from '../types';

const { Title, Text } = Typography;

interface MilestoneHeaderProps {
  milestone: Milestone;
}

const MilestoneHeader: React.FC<MilestoneHeaderProps> = ({ milestone }) => {
  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
      <Col>
        <Title level={2} style={{ margin: 0 }}>
          {milestone.title}
        </Title>
        <Space style={{ marginTop: 8 }}>
          <Tag color="purple">Open</Tag>
          <Text type="secondary">No due date</Text>
          <Text type="secondary">Closed {milestone.closedOn}</Text>
        </Space>
      </Col>
      <Col style={{ textAlign: 'right' }}>
        <Text strong style={{ marginRight: 12 }}>
          {milestone.percent}% complete
        </Text>
        <Progress
          percent={milestone.percent}
          strokeColor="#2da44e"
          showInfo={false}
          style={{ width: 300 }}
        />
      </Col>
    </Row>
  );
};

export default MilestoneHeader;
