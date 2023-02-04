import { request } from '@@/plugin-request/request';
import { BASE_URL } from './utils';
export const getCarouselData = async (options?: { [key: string]: any }) => {
  return request<API.ResponseData<API.CarouselData>>(`${BASE_URL}/mainpage/pics`, {
    method: 'GET',
    ...(options || {}),
  });
};

export async function editCarouselInfo(formData: any, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/mainpage/pics`, {
    method: 'POST',
    data: {
      ...formData,
      mark: 1,
    },
    ...(options || {}),
  });
}

export async function DeleteCarousel(id: string | number, options?: { [key: string]: any }) {
  console.log('给的id是' + id);
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/mainpage/pics`, {
    method: 'POST',
    data: {
      id: id,
      mark: 2,
    },
    ...(options || {}),
  });
}
