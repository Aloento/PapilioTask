import { request } from '@umijs/max';

export const fetchMilestoneDetail = (title: string) => {
  return request('/api/milestone/detail', {
    method: 'GET',
    params: { title }
  }).then(res => {
    if (!res.success) {
      throw new Error(res.errorMessage);
    }
    return res.data;
  });
};

// 获取可用事件列表
export const fetchEventsList = () => {
  return request('/api/events/list', {
    method: 'GET'
  });
};

export const createMilestoneEvent = (title: string, event: { eventNumber: string; eventName: string }) => {
  return request(`/api/milestone/${encodeURIComponent(title)}/events`, {
    method: 'POST',
    data: event,
  });
};

export const addEventToMilestone = (title: string, eventNumber: string) => {
  return request(`/api/milestone/${encodeURIComponent(title)}/events`, {
    method: 'POST',
    data: { eventNumber }
  });
};

export const fetchAvailableEvents = (title: string) => {
  return request(`/api/milestone/${encodeURIComponent(title)}/available-events`);
};
