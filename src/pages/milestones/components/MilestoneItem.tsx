import { ClockCircleOutlined } from '@ant-design/icons';
import { Col, Progress, Row, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { Milestone } from '../types';

const { Title, Text, Paragraph } = Typography;

interface MilestoneItemProps {
  milestone: Milestone;
  index: number;
}

const MilestoneItem: React.FC<MilestoneItemProps> = ({ milestone, index }) => {
  const renderDateLine = (m: Milestone) => {
    const updatedText = m.updatedMinutesAgo
      ? `${m.updatedMinutesAgo} minutes ago`
      : m.updatedHoursAgo
        ? `about ${m.updatedHoursAgo} hours ago`
        : m.updatedDaysAgo !== undefined
          ? `${m.updatedDaysAgo} days ago`
          : `unknown time`;

    return (
      <Text type="secondary">
        {m.closedOn ? (
          <>
            <Text strong>Closed</Text> on {m.closedOn} <ClockCircleOutlined /> Last updated {updatedText}
          </>
        ) : (
          <>
            No due date <ClockCircleOutlined /> Last updated {updatedText}
          </>
        )}
      </Text>
    );
  };

  return (
    <div style={{
      padding: '20px 24px',
      borderTop: index !== 0 ? '1px solid #d8dee4' : undefined,
    }}>
      <Title level={5} style={{ marginBottom: 4 }}>
        <Link to={`/milestones/${encodeURIComponent(milestone.title)}`}>
          {milestone.title}
        </Link>
      </Title>
      {renderDateLine(milestone)}
      {milestone.description && (
        <Paragraph style={{ marginTop: 8, marginBottom: 12 }}>
          {milestone.description}
        </Paragraph>
      )}
      <Row justify="space-between" align="middle">
        <Col flex="auto">
          <div style={{ maxWidth: 600 }}>
            <Progress percent={milestone.percent} strokeColor="green" showInfo={false} />
          </div>
        </Col>
        <Col>
          <Text style={{ color: '#1a7f37', fontWeight: 500 }}>
            {milestone.percent}% complete
          </Text>{' '}
          <Text type="secondary">
            &nbsp;&nbsp; {milestone.open.toLocaleString()} open &nbsp; {milestone.closed.toLocaleString()} closed
          </Text>
        </Col>
      </Row>
    </div>
  );
};

export default MilestoneItem;
