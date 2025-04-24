import { MessageOutlined } from '@ant-design/icons';
import { Col, Row, Space, Tag, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types';

const { Text } = Typography;

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <div
      style={{
        border: '1px solid #d8dee4',
        borderTop: 'none',
        borderRadius: '0 0 6px 6px',
        padding: '24px',
        background: '#fff',
        textAlign: events.length === 0 ? 'center' : 'left',
      }}
    >
      {events.length === 0 ? (
        <>
          <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 8 }}>
            该里程碑下暂无进行中的事件
          </Text>
          <Text style={{ fontSize: 14 }}>
            添加事件到里程碑以帮助组织工作。点击
            <a href="#" style={{ color: '#0969da' }}>
              添加事件
            </a>
            。
          </Text>
        </>
      ) : (
        events.map((event) => (
          <Row
            key={event.id}
            justify="space-between"
            align="middle"
            style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}
          >
            <Col>
              <Link to={`/events/eventdetail/${event.id.replace('#', '')}`}>
                <Text strong style={{ fontSize: 16 }}>{event.title}</Text>
              </Link>
              <Space size="small" style={{ marginLeft: 8 }}>
                {event.labels.map((label) => (
                  <Tag key={label} color="blue">
                    {label}
                  </Tag>
                ))}
              </Space>
            </Col>
            <Col>
              <Space size="middle">
                <Text type="secondary">{event.time}</Text>
                <MessageOutlined />
                <Text type="secondary">{event.comments}</Text>
              </Space>
            </Col>
          </Row>
        ))
      )}
    </div>
  );
};

export default EventList;
