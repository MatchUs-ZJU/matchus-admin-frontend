import { BASE_URL } from '@/services/utils';
import { request } from '@@/plugin-request/request';
export async function getHistoryData(options?: { [key: string]: any }) {
  return request<API.ResponseData<API.HistoryData>>(`/api/admin/mainpage/history`, {
    method: 'GET',
    ...(options || {}),
  });
}
export async function editHistoryData(HistoryData: any, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/mainpage/history`, {
    method: 'POST',
    data: {
      ...HistoryData,
    },
    ...(options || {}),
  });
}
