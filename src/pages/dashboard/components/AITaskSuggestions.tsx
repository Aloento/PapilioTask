import { ProCard } from '@ant-design/pro-components';
import { Flex, Typography } from 'antd';
import { AI_SUGGESTIONS } from '../constants';

const { Text, Title } = Typography;

const AITaskSuggestions: React.FC = () => (
  <Flex vertical gap={8}>
    <Title level={5}>AI Task Suggestions</Title>
    <ProCard>
      <Flex vertical gap={8}>
        {AI_SUGGESTIONS.map((text) => (
          <ProCard bordered key={text}>
            <Flex gap="middle" justify="space-between" align="center">
              <Text style={{ fontSize: '18px' }}>{text}</Text>
            </Flex>
          </ProCard>
        ))}
      </Flex>
    </ProCard>
  </Flex>
);

export default AITaskSuggestions;
