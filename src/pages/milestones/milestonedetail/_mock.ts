import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

function calculateTimeAgo(date: Date) {
  const now = dayjs();
  const updateTime = dayjs(date);
  const minutesAgo = now.diff(updateTime, 'minute');
  const hoursAgo = now.diff(updateTime, 'hour');
  const daysAgo = now.diff(updateTime, 'day');

  return {
    updatedMinutesAgo: minutesAgo,
    updatedHoursAgo: hoursAgo,
    updatedDaysAgo: daysAgo,
  };
}

export default {
  'GET /api/milestone/detail': async (req: Request, res: Response) => {
    try {
      const { title } = req.query;
      console.log('查询里程碑:', title);  // 调试日志

      const milestone = await prisma.milestone.findUnique({
        where: {
          title: String(title)
        },
        include: {
          events: {
            include: {
              assignee: true,
              comments: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });

      console.log('数据库查询结果:', {
        found: !!milestone,
        eventsCount: milestone?.events?.length || 0
      });

      if (!milestone) {
        return res.status(404).json({
          success: false,
          errorMessage: '里程碑不存在'
        });
      }

      const events = milestone.events.map(event => ({
        id: `#${event.id}`,
        title: `${event.eventNumber} - ${event.name}`,
        labels: [event.status || 'new'],
        author: event.assignee?.username || 'admin',
        time: dayjs(event.createdAt).fromNow(),
        comments: event.comments.length || 0
      }));

      console.log('转换后的事件数据:', {
        eventsCount: events.length,
        firstEvent: events[0]
      });

      const timeAgo = calculateTimeAgo(milestone.updatedAt);

      res.json({
        success: true,
        data: {
          title: milestone.title,
          status: milestone.status,
          percent: milestone.percent,
          open: milestone.openCount,
          closed: milestone.closedCount,
          ...timeAgo,
          closedOn: milestone.status === 'closed' ?
            dayjs(milestone.updatedAt).format('MMM D') : undefined,
          description: milestone.description,
          events
        }
      });
    } catch (error) {
      console.error('获取里程碑详情失败:', error);
      res.status(500).json({
        success: false,
        errorMessage: '获取里程碑详情失败',
        details: error instanceof Error ? error.message : '未知错误'
      });
    }
  },

  'POST /api/milestone/:title/events': async (req: Request, res: Response) => {
    try {
      const { title } = req.params;
      const { eventNumber } = req.body;

      console.log('正在关联事件:', { title, eventNumber }); // 调试日志

      // 查找对应的里程碑和事件
      const milestone = await prisma.milestone.findUnique({
        where: { title: String(title) }
      });

      console.log('找到里程碑:', milestone); // 调试日志

      const event = await prisma.event.findFirst({
        where: {
          eventNumber: String(eventNumber),
          milestone: { is: null } // 确保事件未被关联到其他里程碑
        }
      });

      console.log('找到事件:', event); // 调试日志

      if (!milestone || !event) {
        return res.status(404).json({
          success: false,
          errorMessage: '里程碑或事件不存在'
        });
      }

      // 更新事件，关联到里程碑
      const updatedEvent = await prisma.event.update({
        where: { id: event.id },
        data: {
          milestone: {
            connect: { id: milestone.id }
          }
        },
        include: {
          assignee: true
        }
      });

      // 更新里程碑的未完成事件计数
      await prisma.milestone.update({
        where: { id: milestone.id },
        data: {
          openCount: { increment: 1 }
        }
      });

      res.json({
        success: true,
        data: {
          id: `#${updatedEvent.id}`,
          title: `${updatedEvent.eventNumber} - ${updatedEvent.name}`,
          labels: [updatedEvent.status || 'new'],
          author: updatedEvent.assignee?.username || 'admin',
          time: 'just now',
          comments: 0
        }
      });
    } catch (error) {
      console.error('关联事件失败:', error);
      res.status(500).json({
        success: false,
        errorMessage: '关联事件失败',
        details: error instanceof Error ? error.message : '未知错误'
      });
    }
  },

  'GET /api/milestone/:title/available-events': async (req: Request, res: Response) => {
    try {
      const { title } = req.params;

      // 查找不在任何里程碑中的事件
      const events = await prisma.event.findMany({
        where: {
          milestone: {
            is: null  // 没有关联任何里程碑
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json({
        success: true,
        data: events.map(event => ({
          label: `${event.eventNumber} - ${event.name} (${event.status})`,
          value: event.eventNumber,
          status: event.status
        }))
      });
    } catch (error) {
      console.error('获取可用事件列表失败:', error);
      res.status(500).json({
        success: false,
        errorMessage: '获取可用事件列表失败'
      });
    }
  }
};
