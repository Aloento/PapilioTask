import {
  LeftOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { history, useParams } from '@umijs/max';
import {
  Button,
  Col,
  Form,
  message,
  Modal,
  Row,
  Typography,
} from 'antd';
import React, { useMemo, useState } from 'react';
import CreateEventForm from './components/CreateEventForm';
import IssuesList from './components/IssuesList';
import MilestoneHeader from './components/MilestoneHeader';
import MilestoneTabs from './components/MilestoneTabs';
import { Issue, Milestone } from './types';

const { Text } = Typography;

const mockMilestones: Milestone[] = [
  {
    title: '10.0.0',
    status: 'closed',
    percent: 48,
    open: 1451,
    closed: 1387,
    updatedDaysAgo: 2,
    closedOn: 'Mar 6',
    description: 'Release Candidates for .NET 10',
    issues: [
      {
        id: '#114793',
        title: '[API Proposal]: VectorData.Abstractions',
        labels: ['api-suggestion', 'blocking'],
        author: 'jeffhandley',
        time: '5 minutes ago',
        comments: 1,
      },
    ],
  },
];

const eventNumbers = ['EVT-001', 'EVT-002', 'EVT-003'];
const eventNames = ['Marketing Sync', 'Design Review', 'Product Launch'];

const MilestoneDetailPage: React.FC = () => {
  const { title } = useParams();
  const [tab, setTab] = useState<'open' | 'closed'>('open');
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const milestone = mockMilestones.find(
    (m) =>
      decodeURIComponent(m.title).toLowerCase() ===
      (title || '').toLowerCase()
  );

  const [issueList, setIssueList] = useState(milestone?.issues || []);

  const issues = useMemo(() => {
    return issueList.filter((i) => (tab === 'open' ? true : false));
  }, [issueList, tab]);

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

      const newIssue: Issue = {
        id: `#${Math.floor(Math.random() * 1000000)}`,
        title: `${values.eventNumber} - ${values.eventName}`,
        labels: ['new'],
        author: 'admin',
        time: 'just now',
        comments: 0,
      };

      setIssueList((prev) => [newIssue, ...prev]);
      message.success('Task created successfully!');
      form.resetFields();
      setModalVisible(false);
    } catch (err) {
      console.log(err);
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

      {/* 问题列表 */}
      <IssuesList issues={issues} />

      {/* 创建事件模态框 */}
      <Modal
        open={modalVisible}
        title="Create New Event"
        onCancel={() => setModalVisible(false)}
        onOk={handleCreateEvent}
        okText="Create"
        cancelText="Cancel"
        width={480}
      >
        <CreateEventForm form={form} eventNumbers={eventNumbers} eventNames={eventNames} />
      </Modal>
    </div>
  );
};

export default MilestoneDetailPage;
