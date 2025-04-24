import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// 获取事件列表（Event Schedule）
const getEventList = async (_: Request, res: Response) => {
  const events = await prisma.event.findMany({
    include: {
      assignee: true,
    },
    orderBy: {
      startDate: 'asc',
    },
  });

  const result = events.map((e) => ({
    key: e.id,
    eventNumber: e.eventNumber,
    eventName: e.name,
    assignees: e.assignee?.username || '',
    timeframe: `${dayjs(e.startDate).format('YYYY/MM/DD')} - ${dayjs(e.endDate).format('YYYY/MM/DD')}`,
    labels: e.labels?.split(',') || [],
    status: [e.status || 'Pending'],
  }));

  res.json(result);
};

// 获取今日的日程安排
const getTodaySchedule = async (_: Request, res: Response) => {
  const todayStart = dayjs().startOf('day').toDate();
  const todayEnd = dayjs().endOf('day').toDate();

  const events = await prisma.event.findMany({
    where: {
      startDate: { lte: todayEnd },
      endDate: { gte: todayStart },
    },
    include: {
      assignee: true,
    },
  });

  const result = events.map((e) => ({
    key: e.id.toString(),
    title: `${e.name} – hosted by ${e.assignee?.username || 'Unassigned'}`,
    time: `${dayjs(e.startDate).format('YYYY/MM/DD HH:mm')} – ${dayjs(e.endDate).format('HH:mm')}`,
    urgent: e.status === 'Overdue',
    url: `/events/eventdetail/${e.id}`,
  }));

  res.json(result);
};

// 获取事件详情
const getEventDetail = async (req: Request, res: Response) => {
  const id = parseInt(req.query.id as string, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const e = await prisma.event.findUnique({
    where: { id },
    include: { assignee: true },
  });

  if (!e) {
    return res.status(404).json({ error: 'Event not found' });
  }

  res.json({
    key: e.id,
    eventNumber: e.eventNumber,
    eventName: e.name,
    description: e.description || 'No description provided.',
    timeframe: `${dayjs(e.startDate).format('YYYY/MM/DD')} - ${dayjs(e.endDate).format('YYYY/MM/DD')}`,
    labels: e.labels?.split(',') || [],
    status: [e.status || 'Pending'],
    participants: [e.assignee?.username || 'Unassigned'],
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  });
};

// 创建新事件
const createEvent = async (req: Request, res: Response) => {
  try {
    console.log('Received request body:', req.body);

    // 如果传入了完整的事件对象（包含key和eventNumber）
    if (req.body.key && req.body.eventNumber) {
      const { key, eventNumber, eventName, assignees, timeframe, labels, status } = req.body;

      // 查找是否已存在此事件
      const existingEvent = await prisma.event.findUnique({
        where: { id: parseInt(key.toString()) }
      });

      // 如果存在，则视为复制操作；不存在，创建新事件
      if (existingEvent) {
        // 生成新的eventNumber
        const lastEvent = await prisma.event.findFirst({
          orderBy: { id: 'desc' },
        });
        const nextNumber = lastEvent ? parseInt(lastEvent.eventNumber.split('-')[1]) + 1 : 1001;
        const newEventNumber = `EVT-${nextNumber}`;

        // 处理assignee
        let assigneeId = null;
        if (assignees) {
          const assigneeString = typeof assignees === 'string' ? assignees : '';
          if (assigneeString.trim()) {
            const user = await prisma.user.findFirst({
              where: { username: assigneeString }
            });
            if (user) assigneeId = user.id;
          }
        }

        // 处理timeframe
        let startDate = new Date();
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 7); // 默认一周

        if (timeframe) {
          if (typeof timeframe === 'string') {
            const parts = timeframe.split(' - ');
            if (parts.length === 2) {
              startDate = new Date(parts[0]);
              endDate = new Date(parts[1]);
            }
          } else if (Array.isArray(timeframe)) {
            startDate = new Date(timeframe[0]);
            endDate = new Date(timeframe[1]);
          }
        }

        // 创建新事件
        const newEvent = await prisma.event.create({
          data: {
            eventNumber: newEventNumber,
            name: eventName,
            description: existingEvent.description,
            startDate,
            endDate,
            labels: Array.isArray(labels) ? labels.join(',') : null,
            status: Array.isArray(status) && status.length > 0 ? status[0] : 'Pending',
            assigneeId,
          },
          include: { assignee: true },
        });

        return res.status(201).json({
          key: newEvent.id,
          eventNumber: newEvent.eventNumber,
          eventName: newEvent.name,
          assignees: newEvent.assignee?.username || '',
          timeframe: `${dayjs(newEvent.startDate).format('YYYY/MM/DD')} - ${dayjs(newEvent.endDate).format('YYYY/MM/DD')}`,
          labels: newEvent.labels?.split(',') || [],
          status: [newEvent.status || 'Pending'],
        });
      }
    }

    // 如果不是完整事件对象，则按普通方式处理
    const { title, description, assignees, timeframe, labels, status } = req.body;

    // 获取title（可能在eventName字段中）
    const finalTitle = title || req.body.eventName;

    if (!finalTitle || !timeframe) {
      return res.status(400).json({
        error: 'Title and timeframe are required',
        receivedData: req.body
      });
    }

    // 生成唯一的事件编号
    const eventNumber = await generateUniqueEventNumber();

    // 处理assignee
    let assigneeId = null;
    if (assignees) {
      if (Array.isArray(assignees) && assignees.length > 0) {
        const user = await prisma.user.findFirst({
          where: { username: assignees[0] }
        });
        if (user) assigneeId = user.id;
      } else if (typeof assignees === 'string' && assignees.trim()) {
        const user = await prisma.user.findFirst({
          where: { username: assignees }
        });
        if (user) assigneeId = user.id;
      }
    }

    // 解析timeframe
    let startDate, endDate;
    if (Array.isArray(timeframe)) {
      startDate = new Date(timeframe[0]);
      endDate = new Date(timeframe[1]);
    } else if (typeof timeframe === 'string') {
      const parts = timeframe.split(' - ');
      if (parts.length === 2) {
        startDate = new Date(parts[0]);
        endDate = new Date(parts[1]);
      } else {
        startDate = new Date();
        endDate = new Date();
        endDate.setDate(endDate.getDate() + 7); // 默认一周
      }
    } else {
      startDate = new Date();
      endDate = new Date();
      endDate.setDate(endDate.getDate() + 7); // 默认一周
    }

    const newEvent = await prisma.event.create({
      data: {
        eventNumber,
        name: finalTitle,
        description: description || null,
        startDate,
        endDate,
        labels: labels && Array.isArray(labels) && labels.length > 0 ? labels.join(',') : null,
        status: status && Array.isArray(status) && status.length > 0 ? status[0] : 'Pending',
        assigneeId,
      },
      include: {
        assignee: true,
      },
    });

    res.status(201).json({
      key: newEvent.id,
      eventNumber: newEvent.eventNumber,
      eventName: newEvent.name,
      description: newEvent.description,
      assignees: newEvent.assignee?.username || '',
      timeframe: `${dayjs(newEvent.startDate).format('YYYY/MM/DD')} - ${dayjs(newEvent.endDate).format('YYYY/MM/DD')}`,
      labels: newEvent.labels?.split(',') || [],
      status: [newEvent.status || 'Pending'],
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      error: 'Failed to create event',
      message: error.message,
      stack: error.stack
    });
  }
};

// 生成唯一的事件编号
async function generateUniqueEventNumber() {
  // 获取最后一个事件编号
  const lastEvent = await prisma.event.findFirst({
    orderBy: {
      id: 'desc',
    },
  });

  // 生成新编号
  let nextNumber = lastEvent ? parseInt(lastEvent.eventNumber.split('-')[1]) + 1 : 1001;
  let eventNumber = `EVT-${nextNumber}`;

  // 检查编号是否已存在，如果存在则递增
  let exists = await prisma.event.findUnique({ where: { eventNumber } });
  while (exists) {
    nextNumber++;
    eventNumber = `EVT-${nextNumber}`;
    exists = await prisma.event.findUnique({ where: { eventNumber } });
  }

  return eventNumber;
}

// 更新事件
const updateEvent = async (req: Request, res: Response) => {
  const id = parseInt(req.query.id as string, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const { title, description, assignees, timeframe, labels, status } = req.body;

  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // 处理assignee
    let assigneeId = event.assigneeId;
    if (assignees && assignees.length > 0) {
      const user = await prisma.user.findFirst({
        where: {
          username: assignees[0], // 目前只支持单个assignee
        }
      });
      if (user) {
        assigneeId = user.id;
      }
    }

    // 解析timeframe
    let startDate = event.startDate;
    let endDate = event.endDate;
    if (timeframe) {
      if (Array.isArray(timeframe)) {
        startDate = new Date(timeframe[0]);
        endDate = new Date(timeframe[1]);
      } else if (typeof timeframe === 'string') {
        const dates = timeframe.split(' - ').map(d => new Date(d));
        if (dates.length === 2) {
          [startDate, endDate] = dates;
        }
      }
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        name: title || event.name,
        description: description !== undefined ? description : event.description,
        startDate,
        endDate,
        labels: labels && labels.length > 0 ? labels.join(',') : event.labels,
        status: status && status.length > 0 ? status[0] : event.status,
        assigneeId,
      },
      include: {
        assignee: true,
      },
    });

    res.json({
      key: updatedEvent.id,
      eventNumber: updatedEvent.eventNumber,
      eventName: updatedEvent.name,
      assignees: updatedEvent.assignee?.username || '',
      timeframe: `${dayjs(updatedEvent.startDate).format('YYYY/MM/DD')} - ${dayjs(updatedEvent.endDate).format('YYYY/MM/DD')}`,
      labels: updatedEvent.labels?.split(',') || [],
      status: [updatedEvent.status || 'Pending'],
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

// 删除事件
const deleteEvent = async (req: Request, res: Response) => {
  const id = parseInt(req.query.id as string, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await prisma.event.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

// 获取事件评论
const getEventComments = async (req: Request, res: Response) => {
  const eventId = parseInt(req.query.eventId as string, 10);
  if (isNaN(eventId)) {
    return res.status(400).json({ error: 'Invalid Event ID' });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { eventId },
      orderBy: { createdAt: 'asc' },
      include: { user: true },
    });

    const result = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      type: 'comment',
      user: comment.user?.username || 'Anonymous',
      timestamp: comment.createdAt.toLocaleString(),
      createdAt: comment.createdAt,
    }));

    // 添加事件创建和状态变更记录
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { assignee: true },
    });

    if (event) {
      // 添加事件创建记录
      const createActivity = {
        id: `system-create-${eventId}`,
        content: 'created this event',
        type: 'system',
        user: event.assignee?.username || 'System',
        timestamp: event.createdAt.toLocaleString(),
        createdAt: event.createdAt,
      };

      // 如果状态不是默认状态，添加状态变更记录
      const statusActivity = event.status !== 'Pending' ? {
        id: `system-status-${eventId}`,
        content: `changed status to ${event.status}`,
        type: 'system',
        user: event.assignee?.username || 'System',
        timestamp: event.updatedAt.toLocaleString(),
        createdAt: event.updatedAt,
      } : null;

      const activities = [createActivity];
      if (statusActivity) activities.push(statusActivity);

      // 合并所有活动并按创建时间排序
      const allActivities = [...activities, ...result].sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      return res.json(allActivities);
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// 添加评论
const addComment = async (req: Request, res: Response) => {
  const eventId = parseInt(req.body.eventId as string, 10);
  const { content } = req.body;

  if (isNaN(eventId) || !content) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
    // 检查事件是否存在
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // 创建新评论
    const comment = await prisma.comment.create({
      data: {
        content,
        eventId,
        // userId: req.user?.id, // 实际应用中应使用当前登录用户ID
      },
      include: { user: true },
    });

    res.status(201).json({
      id: comment.id,
      content: comment.content,
      type: 'comment',
      user: comment.user?.username || 'Current User',
      timestamp: comment.createdAt.toLocaleString(),
      createdAt: comment.createdAt,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

export default {
  'GET /api/events/list': getEventList,
  'GET /api/events/today': getTodaySchedule,
  'GET /api/events/detail': getEventDetail,
  'POST /api/events/create': createEvent,
  'PUT /api/events/update': updateEvent,
  'DELETE /api/events/delete': deleteEvent,
  'GET /api/events/comments': getEventComments,
  'POST /api/events/comments': addComment,
};
