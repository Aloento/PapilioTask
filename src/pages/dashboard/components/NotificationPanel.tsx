import { SoundOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Flex, Typography } from 'antd';
import { NOTIFICATIONS } from '../constants';

const { Text } = Typography;

const NotificationPanel: React.FC = () => {
  return (
    <ProCard style={{ marginBlockStart: 8 }} gutter={[16, 16]} wrap>
      {NOTIFICATIONS.map((text) => (
        <ProCard bordered key={text}>
          <Flex gap="middle" justify="space-between" align="center">
            <SoundOutlined style={{ fontSize: '20px' }} />
            <Text style={{ fontSize: '18px' }}>{text}</Text>
          </Flex>
        </ProCard>
      ))}
    </ProCard>
  );
};

export default NotificationPanel;
