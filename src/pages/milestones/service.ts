import { request } from '@umijs/max';
import { Milestone } from './types';

export interface ResponseData<T = any> {
  data: T;
  success: boolean;
  errorMessage?: string;
}

// 获取里程碑列表
export async function getMilestones(params?: { status?: string; query?: string }) {
  return request<ResponseData<Milestone[]>>('/api/milestones', {
    method: 'GET',
    params,
  }).then(res => res.data || []); // 确保返回数组
}

// 获取单个里程碑
export async function getMilestone(id: number) {
  return request<ResponseData<Milestone>>(`/api/milestones/${id}`).then(res => res.data);
}

// 创建里程碑
export async function createMilestone(milestone: Partial<Milestone>) {
  return request<ResponseData<Milestone>>('/api/milestones', {
    method: 'POST',
    data: milestone,
  });
}

// 更新里程碑
export async function updateMilestone(id: string, milestone: Partial<Milestone>) {
  return request<ResponseData<Milestone>>(`/api/milestones/${id}`, {
    method: 'PUT',
    data: milestone,
  });
}

// 删除里程碑
export async function deleteMilestone(id: string) {
  return request<ResponseData>(`/api/milestones/${id}`, {
    method: 'DELETE',
  });
}

// 关闭里程碑
export async function closeMilestone(id: number) {
  return request<ResponseData<Milestone>>(`/api/milestones/${id}/close`, {
    method: 'PUT',
  }).then(res => res.data);
}

// 重新打开里程碑
export async function reopenMilestone(id: number) {
  return request<ResponseData<Milestone>>(`/api/milestones/${id}/reopen`, {
    method: 'PUT',
  }).then(res => res.data);
}
