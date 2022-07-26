import {request} from "@@/plugin-request/request";
import {BASE_URL} from "@/services/utils";
import {UserGeneralInfoItem} from "@/pages/UserGeneral/data";

export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.LoginResult>>(`${BASE_URL}/login`, {
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
    id?: number,
    nickName?: string,
    realName?: string,
    studentNumber?: string,
    gender?: number,
    userType?: number,
    phoneNumber?: string,
    faculty?: number,
    identified?: number,
    orderBy?: string,
    pageIndex?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.ResponseData<{ records: UserGeneralInfoItem[] } & API.PaginationResult>>(`${BASE_URL}/user/info`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function deleteUser(id: string | number, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/user/delUser`, {
    method: 'POST',
    params: {
      id: id
    },
    ...(options || {}),
  });
}

export async function editBlackList(id: string | number, operation: number, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/user/blacklist`, {
    method: 'POST',
    params: {
      userId: id,
      isBlack: operation
    },
    ...(options || {}),
  });
}

