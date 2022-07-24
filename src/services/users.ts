import {request} from "@@/plugin-request/request";
import {TableListItem} from "@/pages/UserAdmin/data";

export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export function getUserGeneralInfo(
  params: {
    pageIndex?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: TableListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/user/', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
