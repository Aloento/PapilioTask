import { Pie } from '@ant-design/charts';
import { ProCard } from '@ant-design/pro-components';
import { Flex, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { fetchPriorityDistribution } from '../service';

const { Title } = Typography;

const PriorityPieChart: React.FC = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPriorityDistribution().then(setData);
  }, []);

  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
    },
  };

  return (
    <Flex vertical gap={8}>
      <Title level={5}>Priority</Title>
      <ProCard>
        <Pie {...config} />
      </ProCard>
    </Flex>
  );
};

export default PriorityPieChart;
