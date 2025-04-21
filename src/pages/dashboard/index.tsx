import { Flex, Typography } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Overview from './components/Overview';
import NotificationPanel from './components/NotificationPanel';
import RecentActivities from './components/RecentActivities';
import EventInsightsChart from './components/EventInsightsChart';
import TaskProgressChart from './components/TaskProgressChart';
import QuickActions from './components/QuickActions';
import AITaskSuggestions from './components/AITaskSuggestions';
import PriorityPieChart from './components/PriorityPieChart';
import CalendarCard from './components/CalendarCard';

dayjs.extend(relativeTime);

const { Title } = Typography;

const Dashboard: React.FC = () => {
  return (
    <Flex gap="middle" vertical>
      <Flex gap={24} wrap="wrap" style={{ width: '100%' }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <Title level={5}>Overview</Title>
          <Overview />
        </div>

        <div style={{ flex: 1, minWidth: 300 }}>
          <Title level={5}>Notifications</Title>
          <NotificationPanel />
        </div>

        <div style={{ flex: 1, minWidth: 300 }}>
          <Title level={5}>Recent Activities</Title>
          <RecentActivities />
        </div>
      </Flex>

      <Flex gap="middle">
        <Flex gap={24} wrap="wrap" style={{ width: '100%' }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <EventInsightsChart />
          </div>
          <div style={{ flex: 1, minWidth: 300 }}>
            <TaskProgressChart />
          </div>
          <div style={{ flex: 1, minWidth: 300 }}>
            <QuickActions />
          </div>
        </Flex>
      </Flex>

      <Flex gap="middle">
        <Flex gap={24} wrap="wrap" style={{ width: '100%' }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <AITaskSuggestions />
          </div>
          <div style={{ flex: 1, minWidth: 300 }}>
            <PriorityPieChart />
          </div>
          <div style={{ flex: 1, minWidth: 300 }}>
            <CalendarCard />
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
