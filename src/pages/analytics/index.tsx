import { Bar, Line, Pie } from '@ant-design/charts';
import { ProCard } from '@ant-design/pro-components';
import { Col, Row, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

// 封装图表配置
const chartConfigs = {
  priority: {
    data: [
      { type: '高优先级', value: 20 },
      { type: '中优先级', value: 15 },
      { type: '低优先级', value: 30 },
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
      { type: '需求变更', value: 25 },
      { type: 'Bug修复', value: 35 },
      { type: '功能开发', value: 20 },
      { type: '维护工作', value: 15 },
      { type: '其他任务', value: 5 },
    ],
    xField: 'value',
    yField: 'type',
    seriesField: 'type',
    height: 240,
    legend: { position: 'bottom' },
  },

  completion: {
    data: [
      { date: '周一', value: 40 },
      { date: '周二', value: 50 },
      { date: '周三', value: 70 },
      { date: '周四', value: 20 },
      { date: '周五', value: 60 },
    ],
    xField: 'date',
    yField: 'value',
    point: { size: 5, shape: 'circle' },
    height: 240,
  },

  taskAssignment: {
    data: [
      { type: '张三', value: 25 },
      { type: '李四', value: 20 },
      { type: '王五', value: 30 },
      { type: '赵六', value: 15 },
      { type: '钱七', value: 10 },
    ],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.5,
    statistic: { title: { content: '任务分配' } },
    height: 240,
    legend: { position: 'bottom' },
  },

  responseRate: {
    data: [
      { date: '第1周', value: 85 },
      { date: '第2周', value: 90 },
      { date: '第3周', value: 88 },
      { date: '第4周', value: 95 },
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
      { type: '个人任务', value: 60 },
      { type: '二人协作', value: 25 },
      { type: '多人协作', value: 15 },
    ],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.5,
    statistic: { title: { content: '协作方式' } },
    height: 240,
    legend: { position: 'bottom' },
  },

  processingTime: {
    data: [
      { date: '1月', value: 24 },
      { date: '2月', value: 18 },
      { date: '3月', value: 15 },
      { date: '4月', value: 12 },
      { date: '5月', value: 10 },
    ],
    xField: 'date',
    yField: 'value',
    point: { size: 5, shape: 'circle' },
    height: 240,
    meta: {
      value: { formatter: (v: number) => `${v}小时` }
    },
  },

  overdueEvents: {
    data: [
      { date: '1月', value: 8 },
      { date: '2月', value: 5 },
      { date: '3月', value: 3 },
      { date: '4月', value: 6 },
      { date: '5月', value: 2 },
    ],
    xField: 'date',
    yField: 'value',
    point: { size: 5, shape: 'circle' },
    height: 240,
  },

  completionRate: {
    data: [
      { date: '1月', value: 75 },
      { date: '2月', value: 82 },
      { date: '3月', value: 88 },
      { date: '4月', value: 90 },
      { date: '5月', value: 95 },
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

// 图表区域组件
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

// 单个图表组件
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
        title="事件分类统计"
        charts={
          <>
            <ChartItem
              title="事件优先级分布"
              chart={<Bar {...chartConfigs.priority} />}
            />
            <ChartItem
              title="事件类型分布"
              chart={<Bar {...chartConfigs.eventTypes} />}
            />
            <ChartItem
              title="完成情况统计"
              chart={<Line {...chartConfigs.completion} />}
            />
          </>
        }
      />

      <AnalyticsSection
        title="团队协作分析"
        charts={
          <>
            <ChartItem
              title="任务分配最多的成员"
              chart={<Pie {...chartConfigs.taskAssignment} />}
            />
            <ChartItem
              title="团队成员响应率"
              chart={<Line {...chartConfigs.responseRate} />}
            />
            <ChartItem
              title="任务协作频率"
              chart={<Pie {...chartConfigs.collaboration} />}
            />
          </>
        }
      />

      <AnalyticsSection
        title="事件处理效率"
        charts={
          <>
            <ChartItem
              title="平均处理时间"
              chart={<Line {...chartConfigs.processingTime} />}
            />
            <ChartItem
              title="逾期事件统计"
              chart={<Line {...chartConfigs.overdueEvents} />}
            />
            <ChartItem
              title="事件完成率趋势"
              chart={<Line {...chartConfigs.completionRate} />}
            />
          </>
        }
      />
    </div>
  );
};

export default AnalyticsOverviewPage;
