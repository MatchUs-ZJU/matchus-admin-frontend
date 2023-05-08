import { request } from '@@/plugin-request/request';
import { BASE_URL } from '@/services/utils';
import { UserGeneralInfoItem } from '@/pages/UserGeneral/data';
import { UserRegisterInfoItem } from '@/pages/RegisterAdmin/data';
import { PersonInfoItem } from '@/pages/PersonAdmin/data';
import {luckyInfoOfUser, luckyEditInfo, userAppearancePair} from '@/pages/PersonAdmin';

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

// 用户管理
export function getUserGeneralInfo(
  params: {
    id?: number;
    nickname?: string;
    realname?: string;
    studentNumber?: string;
    gender?: number;
    userType?: number;
    phoneNumber?: string;
    faculty?: number;
    identified?: number;
    orderBy?: string;
    pageIndex?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.ResponseData<{ records: UserGeneralInfoItem[] } & API.PaginationResult>>(
    `${BASE_URL}/register/info`,
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

export async function deleteUser(id: string | number, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/user/delUser`, {
    method: 'POST',
    params: {
      id: id,
    },
    ...(options || {}),
  });
}

export async function editBlackList(
  id: string | number,
  operation: number,
  options?: { [key: string]: any },
) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/user/blacklist`, {
    method: 'POST',
    data: {
      userId: id,
      isBlack: operation,
    },
    ...(options || {}),
  });
}

// 活动管理
export async function getUserRegisterInfo(
  params: {
    id?: number;
    nickname?: string;
    realname?: string;
    studentNumber?: string;
    gender?: number;
    userType?: number;
    phoneNumber?: string;
    faculty?: number;
    identified?: number;
    orderBy?: string;
    pageIndex?: number;
    pageSize?: number;
  },
  options?: {
    [key: string]: any;
  },
) {
  return request<API.ResponseData<{ records: UserRegisterInfoItem[] } & API.PaginationResult>>(
    `${BASE_URL}/register/info`,
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

export async function checkRegisterInfo(
  id: string | number,
  identified: number,
  reason?: string,
  options?: { [key: string]: any },
) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/register/check`, {
    method: 'POST',
    data: { id, identified, reason },
    ...(options || {}),
  });
}

export async function editRegisterInfo(
  id: string | number,
  formData: any,
  options?: { [key: string]: any },
) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/register/info`, {
    method: 'POST',
    data: {
      ...formData,
      id,
    },
    ...(options || {}),
  });
}

// 个人信息管理
export async function getPersonalInfo(
  params: {
    id?: number;
    realname?: string;
    studentNumber?: string;
    gender?: number;
    userType?: number;
    phoneNumber?: string;
    wechatNumber?: string;
    faculty?: number;
    name?: string;
    appearance?: number;
    rate?: number;
    pageIndex?: number;
    pageSize?: number;
  },
  options?: {
    [key: string]: any;
  },
) {
  return request<API.ResponseData<{ records: PersonInfoItem[] } & API.PaginationResult>>(
    `${BASE_URL}/user/info`,
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

export async function rateAppearance(
  id: string | number,
  appearance: number,
  options?: { [key: string]: any },
) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/user/appearance`, {
    method: 'POST',
    data: {
      userId: id,
      appearance,
    },
    ...(options || {}),
  });
}

export function getUserLuckRecord(userId?: number, options?: { [key: string]: any }) {
  return request<API.ResponseData<luckyInfoOfUser>>(`${BASE_URL}/user/lucky`, {
    method: 'GET',
    params: {
      userId,
    },
    ...(options || {}),
  });
}

export function getUserAIScore(userId?: number, options?: { [key: string]: any }) {
  return request<API.ResponseData<number>>(`${BASE_URL}/user/ai`, {
    method: 'GET',
    params: {
      userId,
    },
    ...(options || {}),
  });
}

export function getUserAppearancePair(userId?: number, options?: { [key: string]: any }){
  return request<API.ResponseData<userAppearancePair>>(`${BASE_URL}/user/getAppearancePair`,{
    method: 'GET',
    params:{
      userId,
    },
    ...(options || {})
  });
}
export async function editUserLuck(
  values: luckyEditInfo,
  userId: number,
  options?: { [key: string]: any },
) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/user/lucky`, {
    method: 'POST',
    data: {
      activityId: values.activityId,
      reason: values.reason,
      subtotal: values.subtotal,
      mark: 0,
      userId: userId,
    },
    ...(options || {}),
  });
}

export async function deleteUserLuck(luckyId: number, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/user/lucky`, {
    method: 'POST',
    data: {
      mark: 1,
      luckyId: luckyId,
    },
    ...(options || {}),
  });
}
