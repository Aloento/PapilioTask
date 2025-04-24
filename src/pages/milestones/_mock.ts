import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export default {
  'GET /api/milestones': async (req: Request, res: Response) => {
    try {
      const { status, query } = req.query;

      const milestones = await prisma.milestone.findMany({
        where: {
          AND: [
            status ? { status: String(status) } : {},
            query ? { title: { contains: String(query) } } : {}
          ]
        },
        include: {
          events: true
        }
      });

      res.json({
        data: milestones,
        success: true
      });
    } catch (error) {
      console.error('获取里程碑失败:', error);
      res.status(500).json({
        success: false,
        errorMessage: '获取里程碑失败'
      });
    }
  },

  'POST /api/milestones': async (req: Request, res: Response) => {
    try {
      const milestone = await prisma.milestone.create({
        data: {
          title: req.body.title,
          description: req.body.description,
          status: req.body.status || 'open',
          percent: req.body.percent || 0,
          openCount: req.body.openCount || 0,
          closedCount: req.body.closedCount || 0,
          eventId: req.body.eventId,
          dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null
        },
        include: {
          events: true
        }
      });

      res.json({
        data: milestone,
        success: true
      });
    } catch (error) {
      console.error('创建里程碑失败:', error);
      res.status(500).json({
        success: false,
        errorMessage: '创建里程碑失败'
      });
    }
  },

  'PUT /api/milestones/:id': async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const milestone = await prisma.milestone.update({
        where: { id: Number(id) },
        data: {
          title: req.body.title,
          description: req.body.description,
          status: req.body.status,
          percent: req.body.percent,
          openCount: req.body.openCount,
          closedCount: req.body.closedCount,
          eventId: req.body.eventId,
          dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null
        },
        include: {
          events: true
        }
      });

      res.json({
        data: milestone,
        success: true
      });
    } catch (error) {
      console.error('更新里程碑失败:', error);
      res.status(500).json({
        success: false,
        errorMessage: '更新里程碑失败'
      });
    }
  },

  'DELETE /api/milestones/:id': async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.milestone.delete({
        where: { id: Number(id) }
      });

      res.json({
        success: true,
        data: { message: '删除成功' }
      });
    } catch (error) {
      console.error('删除里程碑失败:', error);
      res.status(500).json({
        success: false,
        errorMessage: '删除里程碑失败'
      });
    }
  }
};
