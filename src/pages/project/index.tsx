import { PlusOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const getTagColor = (tag: string) => {
  switch (tag) {
    case 'Discussion':
      return 'pink';
    case 'Meeting':
      return 'gold';
    default:
      return 'blue';
  }
};

const TaskCard = ({ task }: any) => {
  const navigate = useNavigate();

  return (
    <Card size="small" bordered style={{ marginBottom: 8 }}>
      <Space direction="vertical">
        <Text type="secondary">
          <strong>{task.number}</strong>
        </Text>
        <Text
          strong
          style={{ color: '#1677ff', cursor: 'pointer' }}
          onClick={() => navigate(`/events/eventdetail/${task.id}`)}
        >
          {task.name}
        </Text>
        <div>
          {task.tags.map((tag: string) => (
            <Tag key={tag} color={getTagColor(tag)}>
              {tag}
            </Tag>
          ))}
          <Avatar
            size={24}
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            style={{ marginLeft: 8 }}
          />
        </div>
      </Space>
    </Card>
  );
};

const columnTypes = ['Team User Stories', 'In Progress', 'Urgent', 'Performance', 'Done'];

const EventBoardPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  const [boardData, setBoardData] = useState<any[]>([
    { columnTitle: 'Team User Stories', count: 2, tasks: [] },
    { columnTitle: 'In Progress', count: 2, tasks: [] },
    { columnTitle: 'Urgent', count: 2, tasks: [] },
    { columnTitle: 'Performance', count: 1, tasks: [] },
    { columnTitle: 'Done', count: 2, tasks: [] },
  ]);

  const [filteredBoard, setFilteredBoard] = useState(boardData);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedTag, setSelectedTag] = useState('Meeting');
  const navigate = useNavigate();

  const handleCreate = () => {
    handleAddEvent();
  };

  const generateUniqueEventNumber = () => {
    const allNumbers = boardData
      .flatMap((col) => col.tasks.map((task) => task.number))
      .filter(Boolean);

    const maxNumber = allNumbers.reduce((max, num) => {
      const match = num.match(/^PRJ-(\d+)$/);
      if (match) {
        const numPart = parseInt(match[1], 10);
        return Math.max(max, numPart);
      }
      return max;
    }, 0);

    const nextNumber = maxNumber + 1;
    return `PRJ-${String(nextNumber).padStart(3, '0')}`;
  };

  const handleAddEvent = () => {
    if (!newEventName || !selectedColumn) {
      message.error('Please fill all fields');
      return;
    }

    const newTask = {
      id: Date.now(),
      number: generateUniqueEventNumber(),
      name: newEventName,
      tags: [selectedTag],
    };

    const updatedBoard = boardData.map((col) => {
      if (col.columnTitle === selectedColumn) {
        return {
          ...col,
          count: col.count + 1,
          tasks: [...col.tasks, newTask],
        };
      }
      return col;
    });

    setBoardData(updatedBoard);
    setFilteredBoard(updatedBoard);
    setIsModalVisible(false);
    setNewEventName('');
    setSelectedColumn('');
    setSelectedTag('Meeting');
    setSearchKeyword('');
    setSearchActive(false);
    message.success('Event added!');
  };

  const handleSearch = () => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) {
      message.warning('Please enter a keyword.');
      return;
    }

    const filtered = boardData.map((col) => {
      const filteredTasks = col.tasks.filter((task: any) =>
        task.name.toLowerCase().includes(keyword),
      );
      return {
        ...col,
        tasks: filteredTasks,
        count: filteredTasks.length,
      };
    });

    setFilteredBoard(filtered);
    setSearchActive(true);
  };

  const handleResetSearch = () => {
    setFilteredBoard(boardData);
    setSearchKeyword('');
    setSearchActive(false);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 顶部输入区域 */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Input.Search
              placeholder="Event Name"
              style={{ width: 300 }}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              allowClear
              enterButton
            />
            <Space>
              <Button onClick={handleResetSearch} disabled={!searchActive}>
                Reset
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Add Event
              </Button>
            </Space>
          </Space>
        </Space>
      </Card>

      {/* 看板列 */}
      <Row gutter={16} wrap>
        {filteredBoard.map((column) => (
          <Col key={column.columnTitle} flex="1 0 220px">
            <Card
              title={
                <Space>
                  <span>{column.columnTitle}</span>
                  <Text type="secondary">{column.count}</Text>
                </Space>
              }
              bordered
              bodyStyle={{ padding: 12 }}
            >
              {column.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </Card>
          </Col>
        ))}
      </Row>

      {/* 弹窗 */}
      <Modal
        title="Create New Event"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleCreate}
        okText="Create project"
        cancelText="Cancel"
      >
        <Row gutter={32}>
          <Col span={8}>
            <Title level={5}>New board</Title>
            <Paragraph>
              Start with a board to spread your issues and pull requests across customizable
              columns. Easily switch to a table or roadmap layout at any time.
            </Paragraph>
          </Col>
          <Col span={16}>
            <Title level={5}>Event name</Title>
            <Input
              placeholder="e.g. @yourname's awesome project"
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
            />

            <Title level={5} style={{ marginTop: 16 }}>
              Type
            </Title>
            <Select
              placeholder="Select column"
              style={{ width: '100%' }}
              value={selectedColumn}
              onChange={(value) => setSelectedColumn(value)}
            >
              {columnTypes.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>

            <Title level={5} style={{ marginTop: 16 }}>
              Label
            </Title>
            <Select
              value={selectedTag}
              onChange={(value) => setSelectedTag(value)}
              style={{ width: '100%' }}
            >
              <Option value="Discussion">Discussion</Option>
              <Option value="Meeting">Meeting</Option>
            </Select>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default EventBoardPage;
