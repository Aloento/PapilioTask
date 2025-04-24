import { Request, Response } from 'express';

export default {
  'GET /api/milestone/detail': (_: Request, res: Response) => {
    res.json({
      title: '10.0.0',
      status: 'closed',
      percent: 48,
      open: 1451,
      closed: 1387,
      updatedDaysAgo: 2,
      closedOn: 'Mar 6',
      description: 'Release Candidates',
      issues: [
        {
          id: '#114793',
          title: '[API Proposal]: VectorData.Abstractions',
          labels: ['api-suggestion', 'blocking'],
          author: 'jeffhandley',
          time: '5 minutes ago',
          comments: 1,
        },
      ],
    });
  },
};
