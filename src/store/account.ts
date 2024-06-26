import { defineStore } from 'pinia';
import http from './http';
import { Response } from '@/types';
import { useMenuStore } from './menu';
import { useAuthStore } from '@/plugins';
import { useLoadingStore } from './loading';
import {getSessionInfo} from '@/utils/session'
import { message } from 'ant-design-vue';
import router from '@/router';
export interface Profile {
  account: Account;
  permissions: string[];
  role: string;
}
export interface Account {
  email: string;
  avatar: string;
  gender: number;
}

export type TokenResult = {
  token: string;
  expires: number;
};
export const useAccountStore = defineStore('account', {
  state() {
    return {
      account: {} as Account,
      permissions: [] as string[],
      role: '',
      logged: true,
      permission_keys: [] as string[],
    };
  },
  actions: {
    async login(email: string, password: string) {
      return http
        .request('/platform/reim_api/reim_user/login', 'post_json', { email, password })
        .then(async (response) => {
          console.log('response1:', response)
          console.log('response?.data?.status:', response?.data?.status)
          if (response?.data?.status) {
            this.logged = true;
            // http.setAuthorization(`Bearer ${response.data.token}`, new Date(response.data.expires));
            // localStorage.setItem("reim_session", JSON.stringify(response.data.data))
            http.setAuthorization(response.data.data, new Date(response.data.expires))
            useMenuStore().getMenuList();
            return response.data.data.user_data
          } else {
            message.error(response.data.message)
            return Promise.reject(response);
          }
        });
    },
    async logout() {
      return new Promise<boolean>((resolve) => {
        localStorage.removeItem('stepin-menu');
        http.removeAuthorization();
        this.logged = false;
        resolve(true);
      });
    },
    async profile() {
      const { setAuthLoading } = useLoadingStore();
      setAuthLoading(true);
      let session = getSessionInfo()
      console.log('session:', session)
      return http
        .request<Account, Response<Profile>>('/platform/reim_api/reim_user/profile', 'post_json', {}, {headers: {reimsessionid: session.sessionid}})
        .then((response) => {
          console.log('profile-response:', response)
          if (response.code === 200) {
            const { setAuthorities } = useAuthStore();
            // const { account, permissions, role } = response.data;
            // this.account = account;
            // this.permissions = permissions;
            // this.role = role;
            setAuthorities(['admin']);
            // const { account, permissions, role } = response.data;
            this.account = response.data?.data?.user_data
            console.log('this.account:', this.account)
            return response.data?.data?.user_data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setAuthLoading(false));
    },
    setLogged(logged: boolean) {
      this.logged = logged;
    },
    async apiFillFormLogin(email: string, password: string) {
      return http
        .request('/platform/reim_api/report_fill/login', 'post_json', { email, password })
        .then(async (response) => {
          console.log('response:', response)
          if (response?.data?.status) {
            localStorage.setItem("fill_session", JSON.stringify({
              email: email,
              password: password,
              ...response.data.data
            }))
            return response.data.data.user_data;
          } else {
            return Promise.reject(response);
          }
        });
    },
    async systemLogin(staff_id: string) {
      return http
        .request('/platform/reim_api/reim_user/login_system_user', 'post_json', { staff_id })
        .then(async (response) => {
          console.log('response1:', response)
          console.log('response?.data?.status:', response?.data?.status)
          if (response?.data?.status) {
            this.logged = true;
            // http.setAuthorization(`Bearer ${response.data.token}`, new Date(response.data.expires));
            // localStorage.setItem("reim_session", JSON.stringify(response.data.data))
            http.setAuthorization(response.data.data, new Date(response.data.expires))
            await useMenuStore().getMenuList();
            return response.data.data.user_data;
          } else {
            message.error(response.data.message)
            return Promise.reject(response);
          }
        });
    },
  },
});
