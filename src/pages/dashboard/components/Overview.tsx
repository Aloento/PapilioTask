import { SoundOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Flex, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { fetchOverview } from '../service';

const { Text } = Typography;

const Overview: React.FC = () => {
  const [overview, setOverview] = useState({ pending: 0, inProgress: 0, completed: 0, overdue: 0 });

  useEffect(() => {
    fetchOverview().then(setOverview);
  }, []);

  const items = [
    { label: 'Pending Tasks', value: overview.pending },
    { label: 'In progress', value: overview.inProgress },
    { label: 'Completed Tasks', value: overview.completed },
    { label: 'Overdue Tasks', value: overview.overdue },
  ];

  return (
    <ProCard style={{ marginBlockStart: 8 }} gutter={[16, 16]} wrap>
      {items.map(({ label, value }) => (
        <ProCard bordered key={label}>
          <Flex gap="middle" justify="space-between" align="center">
            <Flex gap="middle">
              <SoundOutlined style={{ fontSize: '18px' }} />
              <Text style={{ fontSize: '16px' }}>{label}</Text>
            </Flex>
            <Text style={{ fontSize: '18px' }}>{value}</Text>
          </Flex>
        </ProCard>
      ))}
    </ProCard>
  );
};

export default Overview;
