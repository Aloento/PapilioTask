import { request } from '@umijs/max';

// 获取事件列表
export const fetchEventList = () => request('/api/events/list');

// 获取今日日程
export const fetchTodaySchedule = () => request('/api/events/today');

// 获取事件详情
export const fetchEventDetail = (id: string | number) =>
  request('/api/events/detail', { params: { id } });

// 创建新事件
export const createEvent = (data: any) => {
  return request('/api/events/create', {
    method: 'POST',
    data,
    errorHandler: (error) => {
      console.error('Event creation error:', error);
      // 仍然抛出错误，由组件处理
      return Promise.reject(error);
    }
  });
};

// 更新事件
export const updateEvent = (id: string | number, data: any) =>
  request('/api/events/update', {
    method: 'PUT',
    params: { id },
    data,
  });

// 删除事件
export const deleteEvent = (id: string | number) =>
  request('/api/events/delete', {
    method: 'DELETE',
    params: { id },
  });

// 获取事件评论
export const fetchEventComments = (eventId: string | number) =>
  request('/api/events/comments', {
    params: { eventId }
  });

// 添加评论
export const addEventComment = (eventId: string | number, content: string) =>
  request('/api/events/comments', {
    method: 'POST',
    data: { eventId, content },
  });
