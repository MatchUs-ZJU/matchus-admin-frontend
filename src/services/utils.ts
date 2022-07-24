import {RequestConfig} from "@@/plugin-request/request";

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
  if(url === '/admin/login') {
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
