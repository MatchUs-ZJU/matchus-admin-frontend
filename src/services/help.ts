import { request } from '@@/plugin-request/request';
import { BASE_URL } from './utils';

type HelpItem = {
  id?: number;
  question?: string;
  answer?: string;
  sequence?: number;
};

export const getHelpData = async (options?: { [key: string]: any }) => {
  return request<API.ResponseData<HelpItem>>(`${BASE_URL}/mainpage/help`, {
    method: 'GET',
    ...(options || {}),
  });
};

export async function deleteQuestion(id: string | number, options?: { [key: string]: any }) {
  console.log(id);
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/mainpage/help`, {
    method: 'POST',
    data: {
      id: id,
      mark: 2,
    },
    ...(options || {}),
  });
}

export async function editQuestionData(values: HelpItem, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/mainpage/help`, {
    method: 'POST',
    data: {
      ...values,
      mark: 1,
    },
    ...(options || {}),
  });
}

export async function createQuestionData(values: HelpItem, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/mainpage/help`, {
    method: 'POST',
    data: {
      ...values,
      mark: 0,
    },
    ...(options || {}),
  });
}
