import { ProCard } from '@ant-design/pro-components';
import { Calendar, Flex, Typography } from 'antd';

const { Title } = Typography;

const CalendarCard: React.FC = () => (
  <Flex vertical gap={8}>
    <Title level={5}>Calendar</Title>
    <ProCard bordered style={{ height: '100%' }}>
      <Calendar fullscreen={false} />
    </ProCard>
  </Flex>
);

export default CalendarCard;
