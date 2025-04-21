import React from 'react';
import { Typography, Row, Col, Progress } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
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
      ? `${m.updatedMinutesAgo} 分钟前`
      : m.updatedHoursAgo
        ? `约 ${m.updatedHoursAgo} 小时前`
        : m.updatedDaysAgo !== undefined
          ? `${m.updatedDaysAgo} 天前`
          : `未知时间`;

    return (
      <Text type="secondary">
        {m.closedOn ? (
          <>
            <Text strong>已关闭</Text> 于 {m.closedOn} <ClockCircleOutlined /> 最后更新 {updatedText}
          </>
        ) : (
          <>
            无截止日期 <ClockCircleOutlined /> 最后更新 {updatedText}
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
            {milestone.percent}% 已完成
          </Text>{' '}
          <Text type="secondary">
            &nbsp;&nbsp; {milestone.open.toLocaleString()} 开放 &nbsp; {milestone.closed.toLocaleString()} 已关闭
          </Text>
        </Col>
      </Row>
    </div>
  );
};

export default MilestoneItem;
