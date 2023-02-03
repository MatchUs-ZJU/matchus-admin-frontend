import { request } from '@@/plugin-request/request';
import { extend } from 'umi-request';
import { ActivityItem } from '@/pages/data';
import { BASE_URL } from '@/services/utils';
import { MatchResultItem, UserMatchInfo } from '@/pages/ActivityAdmin/data';
import type { activity } from '@/pages/ActivityCreation';

export async function getActivityList(options?: { [key: string]: any }) {
  return request<API.ResponseData<{ activityList: ActivityItem[] }>>(`${BASE_URL}/activity/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 活动信息管理
export async function getActivityMatchInfo(
  params: {
    type: number;
    activityId?: string;
    name?: string;
    answerDay?: string;
    studentNumber?: string;
    twcResult?: number;
    twc?: number;
    refund?: number;
    pageIndex?: number;
    pageSize?: number;
  },
  options?: {
    [key: string]: any;
  },
) {
  return request<API.ResponseData<{ records: MatchResultItem[] } & API.PaginationResult>>(
    `${BASE_URL}/activity/info`,
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

export async function modifyFailReason(
  activityId: string | number,
  studentNumber: string,
  reason: string,
  options?: { [key: string]: any },
) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/activity/modFailMsg`, {
    method: 'POST',
    data: {
      activityId,
      studentNumber,
      reason,
    },
    ...(options || {}),
  });
}

export async function modifySurveyState(
  activityId: string | number,
  userId: string,
  isFill: number,
  options?: { [key: string]: any },
) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/activity/modFillSurvey`, {
    method: 'POST',
    data: {
      activityId,
      userId,
      isFill,
    },
    ...(options || {}),
  });
}

export async function outPool(
  activityId: string | number,
  studentNumber: string,
  out: number,
  options?: { [key: string]: any },
) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/activity/outPool`, {
    method: 'POST',
    data: {
      activityId,
      studentNumber,
      out,
    },
    ...(options || {}),
  });
}

export async function editTwc(
  activityId: string | number,
  studentNumber: string,
  choice: number,
  options?: { [key: string]: any },
) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/activity/modTwc`, {
    method: 'POST',
    data: {
      activityId,
      studentNumber,
      choice,
    },
    ...(options || {}),
  });
}

export async function getUserMatchInfo(
  params: {
    studentNumber: string;
    activityId: string | number;
  },
  options?: {
    [key: string]: any;
  },
) {
  return request<API.ResponseData<UserMatchInfo>>(`${BASE_URL}/activity/match/info`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function publishActivity(activityContent: activity, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/create-activity/put`, {
    method: 'POST',
    data: {
      ...activityContent,
    },
    ...(options || {}),
  });
}

export async function getHistoryActivity(options?: { [key: string]: any }) {
  return request<API.ResponseData<activity[]>>(`${BASE_URL}/mainpage/create-activity`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function deleteActivity(term: number, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/activity/delete`, {
    method: 'POST',
    data: {
      term,
    },
    ...(options || {}),
  });
}

export async function getExportedTable(
  activityId: number | undefined,
  options?: { [key: string]: any },
) {
  return request<BlobPart>(`${BASE_URL}/activity/outputData`, {
    method: 'GET',
    data: {
      activityId,
    },
    responseType: 'blob',
    ...(options || {}),
  });
}

export async function getExportedExample(options?: { [key: string]: any }) {
  return request<BlobPart>(`${BASE_URL}/activity/importExample`, {
    method: 'GET',
    responseType: 'blob',
    ...(options || {}),
  });
}

export async function uploadFile(activityId: number, file: File, options?: { [key: string]: any }) {
  let form = new FormData();
  form.append('activityId', String(activityId));
  form.append('file', file);

  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/activity/importResult`, {
    method: 'POST',
    data: form,
    ...(options || {}),
    requestType: 'form',
  });
}
