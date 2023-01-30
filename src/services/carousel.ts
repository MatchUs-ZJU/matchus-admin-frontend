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
    },
    ...(options || {}),
  });
}

export async function DeleteCarousel(id: string | number, options?: { [key: string]: any }) {
  return request<API.ResponseData<API.NormalSuccessData>>(`${BASE_URL}/mainpage/tweet`, {
    method: 'POST',
    data: {
      id: id,
    },
    ...(options || {}),
  });
}
