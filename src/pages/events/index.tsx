import {
  ColumnHeightOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Dropdown,
  Input,
  Menu,
  Pagination,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ColumnSettingModal from './components/ColumnSettingModal';
import CreateEventModal from './components/CreateEventModal';
import NotificationCard from './components/NotificationCard';
import TodaySchedule from './components/TodaySchedule';
import { fetchEventList } from './service';
import { ColumnItem, EventItem, ScheduleItem } from './types';

const { Title } = Typography;

// 主页面组件
const EventSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [columnModalVisible, setColumnModalVisible] = useState(false);
  const [tableSize, setTableSize] = useState<SizeType>('middle');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);

  const [tableData, setTableData] = useState<EventItem[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState<EventItem[]>([]);

  // 获取事件列表数据
  useEffect(() => {
    fetchEventList().then((res) => {
      setTableData(res);
      setFilteredData(res);
    });
  }, []);

  // 定义表格列
  const getInitialColumns = (): ColumnItem[] => [
    {
      title: 'Event Number',
      dataIndex: 'eventNumber',
      key: 'eventNumber',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: 'Event Name',
      dataIndex: 'eventName',
      key: 'eventName',
      render: (text: string, record: EventItem) => (
        <a
          onClick={() => navigate(`/events/eventdetail/${record.key}`)}
          style={{ color: '#1677ff' }}
        >
          {text}
        </a>
      ),
      filters: [
        { text: 'Event 1', value: 'Event 1' },
        { text: 'Event 2', value: 'Event 2' },
        { text: 'Event 3', value: 'Event 3' },
      ],
      onFilter: (value, record) => record.eventName.includes(value),
    },
    {
      title: 'Assignees',
      dataIndex: 'assignees',
      key: 'assignees',
      filters: [
        { text: 'text', value: 'text' },
        { text: 'text 1', value: 'text 1' },
      ],
      onFilter: (value, record) => record.assignees === value,
    },
    {
      title: 'Timeframe',
      dataIndex: 'timeframe',
      key: 'timeframe',
      filters: [
        { text: 'time', value: 'time' },
        { text: 'time 1', value: 'time 1' },
      ],
      onFilter: (value, record) => record.assignees === value,
    },
    {
      title: 'Labels',
      dataIndex: 'labels',
      key: 'labels',
      render: (labels: string[]) => (
        <>
          {labels.map((label) => (
            <Tag key={label} color={label === 'Discussion' ? 'pink' : 'gold'}>
              {label}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string[]) => (
        <>
          {status.map((s) => {
            let color = 'default';
            switch (s) {
              case 'Pending':
                color = 'blue';
                break;
              case 'Doing':
                color = 'gold';
                break;
              case 'Finished':
                color = 'green';
                break;
              case 'Overdue':
                color = 'red';
                break;
            }

            return (
              <Tag key={s} color={color}>
                {s}
              </Tag>
            );
          })}
        </>
      ),
    }
  ];

  const columns = useMemo(() => getInitialColumns(), []);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    columns.map((col) => col.key),
  );
  const [columnFixedState, setColumnFixedState] = useState<
    Record<string, 'left' | 'right' | undefined>
  >({});

  // 今日日程数据
  const scheduleData: ScheduleItem[] = [
    {
      key: '1',
      title: 'The curse of revision - Hermione',
      time: '2025/03/05 – 2025/03/12',
      urgent: true,
      url: 'www.revision.com',
    },
    {
      key: '2',
      title: 'Meeting - Sponsor of the meeting: Tom',
      time: '2025/03/05 12:00 – 15:00',
      urgent: true,
      url: 'www.revision.com',
    },
  ];

  // 刷新表格数据
  const handleRefresh = () => setTableData([...tableData]);

  // 处理表格密度变更
  const handleDensityChange = ({ key }: { key: string }) => {
    setTableSize(key as SizeType);
  };

  // 处理表格列的显示和固定状态
  const displayedColumns = useMemo(() => {
    const left: ColumnItem[] = [],
      right: ColumnItem[] = [],
      normal: ColumnItem[] = [];
    columns.forEach((col) => {
      if (!visibleColumnKeys.includes(col.key)) return;
      const fixed = columnFixedState[col.key];
      const newCol = { ...col, fixed };
      if (fixed === 'left') left.push(newCol);
      else if (fixed === 'right') right.push(newCol);
      else normal.push(newCol);
    });
    return [...left, ...normal, ...right];
  }, [visibleColumnKeys, columnFixedState, columns]);

  // 密度调整菜单
  const densityMenu = (
    <Menu onClick={handleDensityChange} selectedKeys={[tableSize!]}>
      <Menu.Item key="default">默认</Menu.Item>
      <Menu.Item key="middle">中等</Menu.Item>
      <Menu.Item key="small">紧凑</Menu.Item>
    </Menu>
  );

  // 创建新事件
  const handleCreateEvent = (values: any) => {
    const newKey = Date.now();
    const newEventNumber = `EVT-${1000 + tableData.length + 1}`;

    const newItem: EventItem = {
      key: newKey,
      eventNumber: newEventNumber,
      eventName: values.title || 'Untitled',
      assignees: values.assignees?.join(', ') || '',
      timeframe: values.timeframe
        ? `${values.timeframe[0].format('YYYY/MM/DD')} - ${values.timeframe[1].format(
          'YYYY/MM/DD',
        )}`
        : '',
      labels: values.labels || [],
      status: values.status?.length > 0 ? values.status : ['Pending'],
    };

    setTableData((prev) => {
      const updated = [newItem, ...prev];
      setFilteredData(updated);
      return updated;
    });
    setIsEventModalVisible(false);
  };

  // 搜索事件
  const handleSearch = (value: string) => {
    const lower = value.toLowerCase();
    const filtered = tableData.filter((item) =>
      item.eventName.toLowerCase().includes(lower),
    );
    setFilteredData(filtered);
  };

  return (
    <div style={{ padding: 24 }}>
      {tableData.length > 0 && (
        <NotificationCard data={tableData[0]} />
      )}

      <TodaySchedule data={scheduleData} />

      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Event Schedule
          </Title>
        </Col>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsEventModalVisible(true)}
            >
              Add Event
            </Button>
            <Button type="primary">Export</Button>
            <Tooltip title="刷新">
              <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
            </Tooltip>
            <Dropdown overlay={densityMenu} trigger={['click']}>
              <Tooltip title="密度">
                <Button icon={<ColumnHeightOutlined />} />
              </Tooltip>
            </Dropdown>
            <Tooltip title="列设置">
              <Button icon={<SettingOutlined />} onClick={() => setColumnModalVisible(true)} />
            </Tooltip>
          </Space>
        </Col>
      </Row>

      <Table
        columns={displayedColumns}
        size={tableSize}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        dataSource={filteredData}
        rowKey="key"
        bordered
        pagination={false}
        scroll={{ x: 'max-content' }}
      />

      <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
        <Col>
          <Pagination defaultCurrent={1} total={50} pageSize={10} showSizeChanger />
        </Col>
        <Col>
          <Input.Search
            placeholder="Search"
            allowClear
            style={{ width: 200 }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
          />
        </Col>
      </Row>

      <ColumnSettingModal
        visible={columnModalVisible}
        onClose={() => setColumnModalVisible(false)}
        columns={columns}
        visibleColumnKeys={visibleColumnKeys}
        setVisibleColumnKeys={setVisibleColumnKeys}
        columnFixedState={columnFixedState}
        setColumnFixedState={setColumnFixedState}
      />

      <CreateEventModal
        visible={isEventModalVisible}
        onCancel={() => setIsEventModalVisible(false)}
        onSubmit={handleCreateEvent}
      />
    </div>
  );
};

export default EventSchedulePage;
