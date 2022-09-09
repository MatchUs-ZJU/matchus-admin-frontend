import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import type {Settings as LayoutSettings} from '@ant-design/pro-components';
import {PageLoading, SettingDrawer} from '@ant-design/pro-components';
import type {RunTimeLayoutConfig} from 'umi';
import {history} from 'umi';
import defaultSettings from '../config/defaultSettings';
import {RequestConfig} from "@@/plugin-request/request";
import UnAccessiblePage from "@/pages/403";
import {authHeaderInterceptor, getToken, parseResponseInterceptor, removeToken} from "@/services/utils";
import {ResponseError} from "umi-request";
import {message} from "antd";
import {loginPath} from "@/utils/constant";

// const isDev = process.env.NODE_ENV === 'development';

export const initialStateConfig = {
  loading: <PageLoading/>,
};

// Request网络请求配置
export const request: RequestConfig = {
  timeout: 10000,
  errorConfig: {
    adaptor: (resData: API.ResponseData<any>) => {
      return {
        ...resData,
        success: resData.success,
        errorMessage: resData.msg,
        errorCode: resData.code,
        data: resData.data
      };
    },
  },
  errorHandler: async (error: ResponseError) => {
    if(error.name === 'BizError' && !error.data.success) {
      const resData = error.data
      await message.error(`业务请求失败: ${resData.code ? (resData.code + ' - ' + resData.msg) : '服务器业务发生不明错误'}`)
      // 鉴权失败
      if(resData.code === '1002') {
        await message.warn('登录状态过期，请重新登录')
        removeToken()
        history.push(loginPath)
      }
    } else if(error.name === 'ResponseError') {
      const errorStatus = error.response?.status
      const errorStatusText = error.response?.statusText
      await message.error(`网络请求失败: ${errorStatus ? (errorStatus + ' - ' + errorStatusText) : '网络或服务器内部发生不明错误'}`)
    }
  },
  requestInterceptors: [authHeaderInterceptor],
}

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
}> {
  // 单用户模式下不需要获取用户信息
  // const fetchUserInfo = async () => {
  //   try {
  //     const msg = await queryCurrentUser();
  //     return msg.data;
  //   } catch (error) {
  //     history.push(loginPath);
  //   }
  //   return undefined;
  // };

  // 如果不是登录页面，检查token是否存在，如果不存在则登录状态失效
  if (history.location.pathname !== loginPath) {
    const token = getToken()

    if (!token) {
      history.push(loginPath);
      return {
        currentUser: undefined,
        settings: defaultSettings
      }
    }

    return {
      currentUser: {
        name: 'admin',
        avatar: 'https://s1.ax1x.com/2022/07/24/jjE18x.png',
        access: 'admin',
        currentAuthority: 'admin'
      },
      settings: defaultSettings,
    };
  }

  return {
    settings: defaultSettings,
  };
}

export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {
  return {
    rightContentRender: () => <RightContent/>,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer/>,
    onPageChange: () => {
      const {location} = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    unAccessible: <UnAccessiblePage/>,
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

