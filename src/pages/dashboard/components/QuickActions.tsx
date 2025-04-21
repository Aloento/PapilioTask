import { ProCard } from '@ant-design/pro-components';
import { Button, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { QUICK_ACTIONS } from '../constants';

const { Text, Title } = Typography;

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Flex vertical gap={8}>
      <Title level={5}>Quick Actions</Title>
      <ProCard
        extra={
          <Button type="link" onClick={() => navigate('/events')}>
            More
          </Button>
        }
      >
        <Flex vertical gap={10}>
          {QUICK_ACTIONS.map((text) => (
            <ProCard bordered key={text}>
              <Flex gap="middle" justify="space-between" align="center">
                <Text style={{ fontSize: '20px' }}>{text}</Text>
              </Flex>
            </ProCard>
          ))}
        </Flex>
      </ProCard>
    </Flex>
  );
};

export default QuickActions;
