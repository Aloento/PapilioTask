import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Request, Response } from 'express';

dayjs.extend(relativeTime);

const prisma = new PrismaClient();

// ✅ 从 Prisma 查询事件列表
const getEventList = async (_: Request, res: Response) => {
  const events = await prisma.event.findMany({
    include: { assignee: true },
    orderBy: { startDate: 'asc' },
  });

  const result = events.map((e) => ({
    key: e.id,
    eventNumber: e.eventNumber,
    eventName: e.name,
    assignees: e.assignee?.username || '',
    timeframe: `${dayjs(e.startDate).format('YYYY/MM/DD')} - ${dayjs(e.endDate).format('YYYY/MM/DD')}`,
    labels: e.labels?.split(',') || [],
    status: e.status ? [e.status] : ['Pending'],
  }));

  res.json(result);
};

// ✅ 查询事件详情
const getEventDetail = async (req: Request, res: Response) => {
  const id = parseInt(req.query.id as string, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  const e = await prisma.event.findUnique({
    where: { id },
    include: { assignee: true },
  });

  if (!e) return res.status(404).json({ error: 'Event not found' });

  res.json({
    key: e.id,
    eventNumber: e.eventNumber,
    eventName: e.name,
    description: 'This is a detailed view of the event.',
    timeframe: `${dayjs(e.startDate).format('YYYY/MM/DD')} - ${dayjs(e.endDate).format('YYYY/MM/DD')}`,
    labels: e.labels?.split(',') || [],
    status: e.status ? [e.status] : ['Pending'],
    participants: [e.assignee?.username || 'Unassigned'],
  });
};

// 获取标签统计信息
const getLabelStats = async (_: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      select: {
        status: true,
        labels: true,
      }
    });

    const labelStats = new Map<string, { count: number; color: string }>();

    // 确保每个事件都至少有一个标签（状态）
    events.forEach(event => {
      // 添加状态作为标签
      if (event.status) {
        const statusLabel = labelStats.get(event.status) || {
          count: 0,
          color: getColorForStatus(event.status)
        };
        statusLabel.count += 1;
        labelStats.set(event.status, statusLabel);
      }

      // 处理自定义标签
      const customLabels = event.labels?.split(',').filter(Boolean) || [];
      customLabels.forEach(label => {
        const existingLabel = labelStats.get(label) || {
          count: 0,
          color: getColorForLabel(label)
        };
        existingLabel.count += 1;
        labelStats.set(label, existingLabel);
      });
    });

    const result = Array.from(labelStats.entries()).map(([name, stats]) => ({
      name,
      description: getLabelDescription(name),
      color: stats.color,
      count: stats.count
    }));

    console.log('标签统计结果:', result); // 调试日志
    res.json(result);
  } catch (error) {
    console.error('获取标签统计失败:', error);
    res.status(500).json({
      success: false,
      error: '获取标签统计失败',
      details: error instanceof Error ? error.message : '未知错误'
    });
  }
};

// 获取事件列表（作为 issues 展示）
const getIssuesList = async (_: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        assignee: true,
        comments: true,
        milestone: true // 改为小写的 milestone
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('获取到的事件数量:', events.length); // 调试日志

    const result = events.map(event => {
      // 合并状态和标签
      const allLabels = [
        ...(event.labels?.split(',') || []),
        event.status
      ].filter(Boolean);

      console.log('处理事件:', event.eventNumber, '标签:', allLabels); // 调试日志

      const createdTime = dayjs(event.createdAt);
      return {
        id: event.eventNumber,
        title: event.name,
        labels: allLabels,
        author: event.assignee?.username || 'unassigned',
        time: createdTime.fromNow(),
        comments: event.comments.length || 0,
        milestone: event.milestone?.title // 改为小写的 milestone
      };
    });

    res.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    console.error('获取事件列表错误:', errorMessage);
    res.status(500).json({
      success: false,
      error: '获取事件列表失败',
      details: errorMessage
    });
  }
};

// 辅助函数
function getColorForLabel(label: string): string {
  const colorMap: Record<string, string> = {
    'Meeting': 'blue',
    'Discussion': 'cyan',
    'Doing': 'processing',
    'Done': 'success',
    'Pending': 'gold',
    'Ongoing': 'blue',
    'Finished': 'green'
  };
  return colorMap[label] || 'blue';
}

function getColorForStatus(status: string): string {
  const statusColors: Record<string, string> = {
    'Pending': 'gold',
    'Ongoing': 'blue',
    'Finished': 'green'
  };
  return statusColors[status] || 'default';
}

function getLabelDescription(label: string): string {
  const descriptions: Record<string, string> = {
    'Pending': '待处理的事件',
    'Ongoing': '进行中的事件',
    'Finished': '已完成的事件',
    'api-approved': 'API已通过审核',
    'api-needs-work': 'API需要修改',
    'api-ready-for-review': '准备审核',
    'api-suggestion': '早期讨论',
    'apx': 'Intel APX相关'
  };
  return descriptions[label] || '事件标签';
}

export default {
  'GET /api/labels/list': getLabelStats,
  'GET /api/issues/list': getIssuesList,
  'GET /api/events/list': getEventList,
  'GET /api/events/detail': getEventDetail
};
