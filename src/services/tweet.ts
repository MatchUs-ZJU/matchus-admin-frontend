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
  return request<API.ResponseData<API.CarouselData>>(`${BASE_URL}/mainpage/tweets`, {
    method: 'GET',
    ...(options || {}),
  });
};

export async function publishTweet(tweetData: TweetsItem, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/mainpage/tweets`, {
    method: 'POST',
    data: {
      ...tweetData,
    },
    ...(options || {}),
  });
}

export async function DeleteTweet(id: number, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/mainpage/tweets`, {
    method: 'POST',
    data: {
      id,
    },
    ...(options || {}),
  });
}
