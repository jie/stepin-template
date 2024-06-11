import { AxiosRequestConfig, AxiosResponse } from 'axios';
import createHttp from '@/utils/axiosHttp';
import { isResponse } from '@/types';
import NProgress from 'nprogress';
import { message } from 'ant-design-vue';

const http = createHttp({
  timeout: 10000,
  baseURL: '',
  withCredentials: true,
  xsrfCookieName: 'Authorization',
  xsrfHeaderName: 'Authorization',
});


http.interceptors.response.use(

  (response) => {
    console.log('axios:', response)
    if (response?.data?.status === false && response?.data?.message === "session_required") {
      let session = localStorage.getItem('reim_session')
      if(session) {
        localStorage.removeItem('reim_session')
        message.error('Session Expired, please login again.');
      }

      return Promise.reject('session_required')
    }
    return response
  },
  (error) => {

    return Promise.reject(error) // 错误继续返回给到具体页面
  }
)


const isAxiosResponse = (obj: any): obj is AxiosResponse => {
  return typeof obj === 'object' && obj.status && obj.statusText && obj.headers && obj.config;
};

// progress 进度条 -- 开启
http.interceptors.request.use((req: AxiosRequestConfig) => {
  if (!NProgress.isStarted()) {
    NProgress.start();
  }
  return req;
});

// 解析响应结果
http.interceptors.response.use(
  (rep: AxiosResponse<String>) => {
    const { data } = rep;
    if (isResponse(data)) {
      return data.code === 0 ? data : Promise.reject(data);
    }
    return Promise.reject({ message: rep.statusText, code: rep.status, data });
  },
  (error) => {
    if (error.response && isAxiosResponse(error.response)) {
      return Promise.reject({
        message: error.response.statusText,
        code: error.response.status,
        data: error.response.data,
      });
    }
    return Promise.reject(error);
  }
);

// progress 进度条 -- 关闭
http.interceptors.response.use(
  (rep) => {
    if (NProgress.isStarted()) {
      NProgress.done();
    }
    return rep;
  },
  (error) => {
    if (NProgress.isStarted()) {
      NProgress.done();
    }
    return error;
  }
);

export default http;
