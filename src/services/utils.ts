import {RequestConfig} from "@@/plugin-request/request";

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
  if(url === `${BASE_URL}/login`) {
    return {
      url,
      options: { ...options },
    };
  }

  const authHeader = { Authorization: getToken() };
  return {
    url,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};
