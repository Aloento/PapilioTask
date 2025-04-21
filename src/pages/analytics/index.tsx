import { Bar, Line, Pie } from '@ant-design/charts';
import { ProCard } from '@ant-design/pro-components';
import { Col, Row, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

// Chart configurations
const chartConfigs = {
  priority: {
    data: [
      { type: 'High Priority', value: 20 },
      { type: 'Medium Priority', value: 15 },
      { type: 'Low Priority', value: 30 },
    ],
    xField: 'value',
    yField: 'type',
    seriesField: 'type',
    height: 240,
    legend: { position: 'bottom' },
    color: ['#ff4d4f', '#faad14', '#52c41a'],
  },

  eventTypes: {
    data: [
      { type: 'Requirement Change', value: 25 },
      { type: 'Bug Fix', value: 35 },
      { type: 'Feature Development', value: 20 },
      { type: 'Maintenance', value: 15 },
      { type: 'Other Tasks', value: 5 },
    ],
    xField: 'value',
    yField: 'type',
    seriesField: 'type',
    height: 240,
    legend: { position: 'bottom' },
  },

  completion: {
    data: [
      { date: 'Monday', value: 40 },
      { date: 'Tuesday', value: 50 },
      { date: 'Wednesday', value: 70 },
      { date: 'Thursday', value: 20 },
      { date: 'Friday', value: 60 },
    ],
    xField: 'date',
    yField: 'value',
    point: { size: 5, shape: 'circle' },
    height: 240,
  },

  taskAssignment: {
    data: [
      { type: 'Zhang San', value: 25 },
      { type: 'Li Si', value: 20 },
      { type: 'Wang Wu', value: 30 },
      { type: 'Zhao Liu', value: 15 },
      { type: 'Qian Qi', value: 10 },
    ],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.5,
    statistic: { title: { content: 'Task Assignment' } },
    height: 240,
    legend: { position: 'bottom' },
  },

  responseRate: {
    data: [
      { date: 'Week 1', value: 85 },
      { date: 'Week 2', value: 90 },
      { date: 'Week 3', value: 88 },
      { date: 'Week 4', value: 95 },
    ],
    xField: 'date',
    yField: 'value',
    point: { size: 5, shape: 'circle' },
    height: 240,
    meta: {
      value: {
        min: 0,
        max: 100,
        formatter: (v: number) => `${v}%`
      }
    },
  },

  collaboration: {
    data: [
      { type: 'Individual Tasks', value: 60 },
      { type: 'Two-person Collaboration', value: 25 },
      { type: 'Team Collaboration', value: 15 },
    ],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.5,
    statistic: { title: { content: 'Collaboration Type' } },
    height: 240,
    legend: { position: 'bottom' },
  },

  processingTime: {
    data: [
      { date: 'Jan', value: 24 },
      { date: 'Feb', value: 18 },
      { date: 'Mar', value: 15 },
      { date: 'Apr', value: 12 },
      { date: 'May', value: 10 },
    ],
    xField: 'date',
    yField: 'value',
    point: { size: 5, shape: 'circle' },
    height: 240,
    meta: {
      value: { formatter: (v: number) => `${v} hours` }
    },
  },

  overdueEvents: {
    data: [
      { date: 'Jan', value: 8 },
      { date: 'Feb', value: 5 },
      { date: 'Mar', value: 3 },
      { date: 'Apr', value: 6 },
      { date: 'May', value: 2 },
    ],
    xField: 'date',
    yField: 'value',
    point: { size: 5, shape: 'circle' },
    height: 240,
  },

  completionRate: {
    data: [
      { date: 'Jan', value: 75 },
      { date: 'Feb', value: 82 },
      { date: 'Mar', value: 88 },
      { date: 'Apr', value: 90 },
      { date: 'May', value: 95 },
    ],
    xField: 'date',
    yField: 'value',
    point: { size: 5, shape: 'circle' },
    height: 240,
    meta: {
      value: {
        min: 0,
        max: 100,
        formatter: (v: number) => `${v}%`
      }
    },
  },
};

// Analytics section component
interface AnalyticsSectionProps {
  title: string;
  charts: React.ReactNode;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ title, charts }) => (
  <ProCard
    title={title}
    style={{ marginBottom: 24 }}
    bordered
    headerBordered
  >
    <Row gutter={24}>{charts}</Row>
  </ProCard>
);

// Single chart component
interface ChartItemProps {
  title: string;
  chart: React.ReactNode;
}

const ChartItem: React.FC<ChartItemProps> = ({ title, chart }) => (
  <Col span={8}>
    <Title level={5}>{title}</Title>
    {chart}
  </Col>
);

const AnalyticsOverviewPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <AnalyticsSection
        title="Event Classification Statistics"
        charts={
          <>
            <ChartItem
              title="Event Priority Distribution"
              chart={<Bar {...chartConfigs.priority} />}
            />
            <ChartItem
              title="Event Type Distribution"
              chart={<Bar {...chartConfigs.eventTypes} />}
            />
            <ChartItem
              title="Completion Statistics"
              chart={<Line {...chartConfigs.completion} />}
            />
          </>
        }
      />

      <AnalyticsSection
        title="Team Collaboration Analysis"
        charts={
          <>
            <ChartItem
              title="Team Members with Most Assignments"
              chart={<Pie {...chartConfigs.taskAssignment} />}
            />
            <ChartItem
              title="Team Response Rate"
              chart={<Line {...chartConfigs.responseRate} />}
            />
            <ChartItem
              title="Task Collaboration Frequency"
              chart={<Pie {...chartConfigs.collaboration} />}
            />
          </>
        }
      />

      <AnalyticsSection
        title="Event Processing Efficiency"
        charts={
          <>
            <ChartItem
              title="Average Processing Time"
              chart={<Line {...chartConfigs.processingTime} />}
            />
            <ChartItem
              title="Overdue Events Statistics"
              chart={<Line {...chartConfigs.overdueEvents} />}
            />
            <ChartItem
              title="Event Completion Rate Trend"
              chart={<Line {...chartConfigs.completionRate} />}
            />
          </>
        }
      />
    </div>
  );
};

export default AnalyticsOverviewPage;
