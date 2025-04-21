import { SoundOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Flex, Typography } from 'antd';
import { RECENT_ACTIVITIES } from '../constants';

const { Text } = Typography;

const RecentActivities: React.FC = () => {
  return (
    <ProCard style={{ marginBlockStart: 8 }} gutter={[16, 16]} wrap>
      {RECENT_ACTIVITIES.map(({ title, description }) => (
        <ProCard bordered key={title}>
          <Flex gap="small" vertical>
            <Flex gap="small">
              <SoundOutlined style={{ fontSize: '18px' }} />
              <Text style={{ fontSize: '16px' }}>{title}</Text>
            </Flex>
            <Text style={{ paddingLeft: 37 }}>{description}</Text>
          </Flex>
        </ProCard>
      ))}
    </ProCard>
  );
};

export default RecentActivities;
