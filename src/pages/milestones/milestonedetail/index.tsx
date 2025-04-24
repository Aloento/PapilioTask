import {
  LeftOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { history, useParams, useRequest } from '@umijs/max';
import {
  Button,
  Col,
  Form,
  message,
  Modal,
  Row,
  Typography,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import AddEventForm from './components/AddEventForm';
import EventList from './components/EventList';
import MilestoneHeader from './components/MilestoneHeader';
import MilestoneTabs from './components/MilestoneTabs';
import { addEventToMilestone, fetchAvailableEvents, fetchMilestoneDetail } from './service';
import { Event, Milestone } from './types';

const { Text } = Typography;

const MilestoneDetailPage: React.FC = () => {
  const { title } = useParams();
  const [tab, setTab] = useState<'open' | 'closed'>('open');
  const [modalVisible, setModalVisible] = useState(false);
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const [loading, setLoading] = useState(false);
  const [eventList, setEventList] = useState<Event[]>([]);
  const [form] = Form.useForm();
  const [events, setEvents] = useState<{ label: string; value: string }[]>([]);

  const fetchData = async () => {
    if (!title) return;
    setLoading(true);
    try {
      const data = await fetchMilestoneDetail(decodeURIComponent(title));
      setMilestone(data);
    } catch (error) {
      message.error('Failed to fetch milestone details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [title]);

  useEffect(() => {
    if (milestone) {
      setEventList(milestone.events || []);
    }
  }, [milestone]);

  const eventsFiltered = useMemo(() => {
    return eventList.filter((e) => {
      if (tab === 'open') {
        return e.labels.includes('Pending') || e.labels.includes('Ongoing');
      }
      return e.labels.includes('Finished');
    });
  }, [eventList, tab]);

  const { data: eventsList, loading: eventsLoading } = useRequest(
    () => fetchAvailableEvents(decodeURIComponent(title || '')),
    {
      refreshDeps: [title],
      formatResult: (res) => res.data
    }
  );

  useEffect(() => {
    if (eventsList) {
      setEvents(eventsList);
    }
  }, [eventsList]);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (!milestone) {
    return (
      <div style={{ padding: 24 }}>
        <Text type="danger">Milestone not found.</Text>
      </div>
    );
  }

  const handleCreateEvent = async () => {
    try {
      const values = await form.validateFields();
      console.log('选中的事件:', values.eventNumber);

      await addEventToMilestone(decodeURIComponent(title || ''), values.eventNumber);
      message.success('事件添加成功！');
      form.resetFields();
      setModalVisible(false);
      fetchData();
    } catch (err) {
      console.error('添加事件失败:', err);
      message.error('添加事件失败');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 头部 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Button
            type="link"
            icon={<LeftOutlined />}
            onClick={() => history.push('/milestones')}
          >
            Back to Milestone List
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ background: '#2da44e', borderColor: '#2da44e' }}
            onClick={() => setModalVisible(true)}
          >
            Add Event
          </Button>
        </Col>
      </Row>

      {/* 里程碑头部信息 */}
      <MilestoneHeader milestone={milestone} />

      {/* 标签页 */}
      <MilestoneTabs
        activeTab={tab}
        onTabChange={setTab}
        openCount={milestone.open}
        closedCount={milestone.closed}
      />

      {/* 事件列表 */}
      <EventList events={eventsFiltered} />

      {/* 创建事件模态框 */}
      <Modal
        open={modalVisible}
        title="Add Event to Milestone"
        onCancel={() => setModalVisible(false)}
        onOk={handleCreateEvent}
        okText="Add"
        cancelText="Cancel"
        width={480}
      >
        <AddEventForm
          form={form}
          events={events}
          loading={eventsLoading}
        />
      </Modal>
    </div>
  );
};

export default MilestoneDetailPage;
