import { BASE_URL } from '@/services/utils';
import { request } from '@@/plugin-request/request';

export async function getMaintainTime(options?: Record<string, any>) {
  return request<API.ResponseData<API.MaintainTime>>(`${BASE_URL}/mainpage/maintain`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function updateMaintainTime(
  startTime: number,
  endTime: number,
  activate: boolean = false,
  description?: string,
  options?: Record<string, any>,
) {
  return request<API.ResponseData<API.MaintainTime>>(`${BASE_URL}/mainpage/maintain`, {
    method: 'POST',
    data: {
      startTime: startTime,
      endTime: endTime,
      activate: activate,
      description: description,
    },
    ...(options || {}),
  });
}
