import { MessageOutlined } from '@ant-design/icons';
import { Col, Row, Space, Tag, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { Issue } from '../types';

const { Text } = Typography;

interface IssuesListProps {
  issues: Issue[];
}

const IssuesList: React.FC<IssuesListProps> = ({ issues }) => {
  return (
    <div
      style={{
        border: '1px solid #d8dee4',
        borderTop: 'none',
        borderRadius: '0 0 6px 6px',
        padding: '24px',
        background: '#fff',
        textAlign: issues.length === 0 ? 'center' : 'left',
      }}
    >
      {issues.length === 0 ? (
        <>
          <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 8 }}>
            此里程碑中没有开放的问题
          </Text>
          <Text style={{ fontSize: 14 }}>
            向里程碑添加问题以帮助组织您的工作。查找并添加{' '}
            <a href="#" style={{ color: '#0969da' }}>
              没有里程碑的问题
            </a>
            。
          </Text>
        </>
      ) : (
        issues.map((issue) => (
          <Row
            key={issue.id}
            justify="space-between"
            align="middle"
            style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}
          >
            <Col>
              <Link to={`/events/eventdetail/${issue.id.replace('#', '')}`}>
                <Text strong style={{ fontSize: 16 }}>{issue.title}</Text>
              </Link>
              <div style={{ marginTop: 4 }}>
                {issue.labels.map((l) => (
                  <Tag key={l}>{l}</Tag>
                ))}
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  {issue.id} opened {issue.time} by {issue.author}
                </Text>
              </div>
            </Col>
            <Col>
              <Space>
                <MessageOutlined />
                <Text type="secondary">{issue.comments}</Text>
              </Space>
            </Col>
          </Row>
        ))
      )}
    </div>
  );
};

export default IssuesList;
