import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, message, Row, Space } from 'antd';
import React, { useState } from 'react';
import BoardColumnComponent from './components/BoardColumn';
import CreateEventModal from './components/CreateEventModal';
import { BoardColumn, columnTypes, Task } from './types';

// 主页面组件
const ProjectBoardPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  // 初始化看板数据
  const [boardData, setBoardData] = useState<BoardColumn[]>([
    { columnTitle: 'Team User Stories', count: 2, tasks: [] },
    { columnTitle: 'In Progress', count: 2, tasks: [] },
    { columnTitle: 'Urgent', count: 2, tasks: [] },
    { columnTitle: 'Performance', count: 1, tasks: [] },
    { columnTitle: 'Done', count: 2, tasks: [] },
  ]);

  const [filteredBoard, setFilteredBoard] = useState<BoardColumn[]>(boardData);

  // 模态框状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedTag, setSelectedTag] = useState('Meeting');

  // 生成唯一事件编号
  const generateUniqueEventNumber = (): string => {
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

    return `PRJ-${String(maxNumber + 1).padStart(3, '0')}`;
  };

  // 添加新事件
  const handleAddEvent = () => {
    if (!newEventName || !selectedColumn) {
      message.error('请填写所有必填字段');
      return;
    }

    const newTask: Task = {
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
    resetModalForm();
    message.success('事件已添加！');
  };

  // 重置表单
  const resetModalForm = () => {
    setIsModalVisible(false);
    setNewEventName('');
    setSelectedColumn('');
    setSelectedTag('Meeting');
    setSearchKeyword('');
    setSearchActive(false);
  };

  // 搜索功能
  const handleSearch = () => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) {
      message.warning('请输入搜索关键词');
      return;
    }

    const filtered = boardData.map((col) => {
      const filteredTasks = col.tasks.filter((task) =>
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

  // 重置搜索
  const handleResetSearch = () => {
    setFilteredBoard(boardData);
    setSearchKeyword('');
    setSearchActive(false);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* 搜索和操作区域 */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Input.Search
              placeholder="搜索事件名称"
              style={{ width: 300 }}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              allowClear
              enterButton
            />
            <Space>
              <Button onClick={handleResetSearch} disabled={!searchActive}>
                重置
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                添加事件
              </Button>
            </Space>
          </Space>
        </Space>
      </Card>

      {/* 看板列表 */}
      <Row gutter={16} wrap>
        {filteredBoard.map((column) => (
          <Col key={column.columnTitle} flex="1 0 220px">
            <BoardColumnComponent column={column} />
          </Col>
        ))}
      </Row>

      {/* 创建事件模态框 */}
      <CreateEventModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleAddEvent}
        eventName={newEventName}
        setEventName={setNewEventName}
        selectedColumn={selectedColumn}
        setSelectedColumn={setSelectedColumn}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        columnTypes={columnTypes}
      />
    </div>
  );
};

export default ProjectBoardPage;
