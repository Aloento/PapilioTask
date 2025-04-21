export default {
  'GET /api/board': (_: any, res: any) => {
    res.json([
      {
        columnTitle: 'Team User Stories',
        count: 2,
        tasks: [
          { id: 1, number: '001', name: 'Design Database', tags: ['Discussion'] },
          { id: 2, number: '002', name: 'Initial API Spec', tags: ['Meeting'] },
        ],
      },
      {
        columnTitle: 'In Progress',
        count: 2,
        tasks: [
          { id: 3, number: '003', name: 'Frontend Setup', tags: ['Meeting'] },
        ],
      },
      // 更多列...
    ]);
  },
};
