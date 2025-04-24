import { ClockCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Popconfirm, Progress, Row, Space, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { Milestone } from '../types';

const { Title, Text, Paragraph } = Typography;

interface MilestoneItemProps {
  milestone: Milestone;
  index: number;
  onEdit?: (milestone: Milestone) => void;
  onDelete?: (milestone: Milestone) => void;
}

const MilestoneItem: React.FC<MilestoneItemProps> = ({ milestone, index, onEdit, onDelete }) => {
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
      <Row justify="space-between" align="middle">
        <Col>
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
        </Col>
        <Col>
          <Space>
            <Button
              icon={<EditOutlined />}
              type="text"
              onClick={() => onEdit?.(milestone)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定要删除这个里程碑吗？"
              onConfirm={() => onDelete?.(milestone)}
              okText="确定"
              cancelText="取消"
            >
              <Button icon={<DeleteOutlined />} type="text" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        </Col>
      </Row>
      <Row justify="space-between" align="middle">
        <Col flex="auto">
          <div style={{ maxWidth: 600 }}>
            <Progress
              percent={milestone.percent || 0}
              strokeColor="green"
              showInfo={false}
            />
          </div>
        </Col>
        <Col>
          <Text style={{ color: '#1a7f37', fontWeight: 500 }}>
            {milestone.percent || 0}% complete
          </Text>{' '}
          <Text type="secondary">
            &nbsp;&nbsp; {milestone.openCount?.toLocaleString() || 0} open &nbsp;
            {milestone.closedCount?.toLocaleString() || 0} closed
          </Text>
        </Col>
      </Row>
    </div>
  );
};

export default MilestoneItem;
