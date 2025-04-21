import { Line } from '@ant-design/charts';
import { ProCard } from '@ant-design/pro-components';
import { Button, Flex, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLineChart } from '../service';

const { Title } = Typography;

const EventInsightsChart: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchLineChart().then(setData);
  }, []);

  const config = {
    data,
    autoFit: true,
    height: 300,
    xField: 'date',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
  };

  return (
    <Flex vertical gap={8} style={{ width: '100%' }}>
      <Title level={5}>Event Insights</Title>
      <ProCard
        extra={
          <Button type="link" onClick={() => navigate('/analytics')}>
            More
          </Button>
        }
      >
        <Line {...config} />
      </ProCard>
    </Flex>
  );
};

export default EventInsightsChart;
