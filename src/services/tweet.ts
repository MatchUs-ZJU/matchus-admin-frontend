import { request } from '@@/plugin-request/request';
import { BASE_URL } from './utils';
type TweetsItem = {
  id?: number;
  title?: string;
  description?: string;
  tag?: string;
  date?: string;
  url?: string;
  image?: string;
};
export const getTweetsData = async (options?: { [key: string]: any }) => {
  return request<API.ResponseData<API.CarouselData>>(`${BASE_URL}/mainpage/article`, {
    method: 'GET',
    ...(options || {}),
  });
};

export async function publishTweet(tweetData: TweetsItem, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/mainpage/article`, {
    method: 'POST',
    data: {
      ...tweetData,
      mark: 1,
    },
    ...(options || {}),
  });
}
export async function createTweet(tweetData: TweetsItem, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/mainpage/article`, {
    method: 'POST',
    data: {
      ...tweetData,
      mark: 0,
    },
    ...(options || {}),
  });
}

export async function DeleteTweet(id: number, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/mainpage/article`, {
    method: 'POST',
    data: {
      id,
      mark: 2,
    },
    ...(options || {}),
  });
}
