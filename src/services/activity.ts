import {request} from "@@/plugin-request/request";
import {ActivityItem} from "@/pages/data";
import {BASE_URL} from "@/services/utils";
import {MatchResultItem, UserMatchInfo} from "@/pages/ActivityAdmin/data";

export async function getActivityList(
  options?: {
    [key: string]: any
  }) {
  return request<API.ResponseData<{ activityList: ActivityItem[] }>>(`${BASE_URL}/activity/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 活动信息管理
export async function getActivityMatchInfo(
  params: {
    type: number,
    activityId?: string,
    name?: string,
    answerDay?: string,
    studentNumber?: string,
    twcResult?: number,
    twc?: number,
    refund?: number,
    pageIndex?: number,
    pageSize?: number
  },
  options?: {
    [key: string]: any
  }) {
  return request<API.ResponseData<{ records: MatchResultItem[] } & API.PaginationResult>>(`${BASE_URL}/activity/info`, {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {}),
  });
}

export async function modifyFailReason(activityId: string | number, studentNumber: string, reason: string, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/activity/modFailMsg`, {
    method: 'POST',
    data: {
      activityId,
      studentNumber,
      reason
    },
    ...(options || {}),
  });
}

export async function outPool(activityId: string | number, studentNumber: string, out: number, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/activity/outPool`, {
    method: 'POST',
    data: {
      activityId,
      studentNumber,
      out
    },
    ...(options || {}),
  });
}

export async function editTwc(activityId: string | number, studentNumber: string, choice: number, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/activity/modTwc`, {
    method: 'POST',
    data: {
      activityId,
      studentNumber,
      choice
    },
    ...(options || {}),
  });
}

export async function getUserMatchInfo(
  params: {
    studentNumber: string,
    activityId: string | number
  },
  options?: {
    [key: string]: any
  }) {
  return request<API.ResponseData<UserMatchInfo>>(`${BASE_URL}/activity/match/info`, {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {}),
  });
}

