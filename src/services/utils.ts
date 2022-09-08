import {RequestConfig} from "@@/plugin-request/request";
import {loginPath} from "@/utils/constant";
import {message} from "antd";
import {history} from 'umi';

export const BASE_URL = '/api/admin'

export const setToken = (token: string) => {
  localStorage.setItem('token', token)
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const removeToken = () => {
  localStorage.removeItem('token')
}

export const authHeaderInterceptor = (url: string, options: RequestConfig) => {
  if (url === `${BASE_URL}/login`) {
    return {
      url,
      options: {...options},
    };
  }

  const authHeader = {Authorization: getToken()};
  return {
    url,
    options: {...options, interceptors: true, headers: authHeader},
  };
};


export const parseResponseInterceptor = async (response: Response) => {
  if (response.status >= 300 || response.status < 200) {
    return response
  } else {
    const data: API.ResponseData<any> = await response.clone().json()
    if (!data.success) {
      // 鉴权失败
      if(data.code === '1002') {
        await message.warn('登录状态过期，请重新登录')
        removeToken()
        history.push(loginPath)
      }
    }
    return response
  }
}
