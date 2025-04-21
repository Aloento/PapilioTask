import { Bar } from '@ant-design/charts';
import { ProCard } from '@ant-design/pro-components';
import { Button, Flex, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTaskProgress } from '../service';

const { Title } = Typography;

const TaskProgressChart: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchTaskProgress().then(setData);
  }, []);

  const config = {
    data,
    xField: 'type',
    yField: 'count',
    height: 300,
    autoFit: true,
    isStack: false,
    barWidthRatio: 0.7,
    padding: [50, 40, 50, 40],
    label: {
      position: 'right',
      style: {
        fill: '#333',
        fontSize: 14,
        fontWeight: 500,
      },
    },
    yAxis: {
      label: {
        style: {
          fontSize: 14,
          fontWeight: 500,
        },
      },
    },
    xAxis: {
      min: 0,
      label: {
        style: {
          fontSize: 12,
          fill: '#999',
        },
      },
    },
    barStyle: {
      radius: [6, 6, 6, 6],
    },
    meta: {
      type: {
        alias: 'Task Status',
      },
      count: {
        alias: 'Count',
      },
    },
    color: ({ type }: { type: 'Pending' | 'Ongoing' | 'Finished' | 'Overdue' }) => {
      const colorMap: Record<string, string> = {
        Pending: '#F59E0B',
        Ongoing: '#3B82F6',
        Finished: '#10B981',
        Overdue: '#EF4444',
      };
      return colorMap[type] || '#8884d8';
    },
  };

  return (
    <Flex vertical gap={8}>
      <Title level={5}>Task Progress</Title>
      <ProCard
        extra={
          <Button type="link" onClick={() => navigate('/analytics')}>
            More
          </Button>
        }
      >
        <Bar {...config} />
      </ProCard>
    </Flex>
  );
};

export default TaskProgressChart;
