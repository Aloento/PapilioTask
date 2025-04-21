import { request } from '@umijs/max';

export const fetchBoardData = () => {
  return request('/api/board', {
    method: 'GET',
  });
};
