import { defineStore } from 'pinia';
import http from './http';
import { getSessionInfo } from '@/utils/session'
import { useLoadingStore } from '@/store';
import { Pagination } from "@/types"
import { openNotification, successNotification } from '@/utils/notification';


export interface ReimUser {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  mobile?: string;
  remark?: string;
  status?: string;
  roles?: Array<string>;
  is_admin?: boolean;
  country_id?: string;
  province_id?: boolean;
  city_id?: boolean;
  region_id?: boolean;
  address?: boolean;
  is_enable?: boolean;
  create_at?: string;
  avatar?: string;
  worker?:any;
  staff?:any;
}


export const ReimUserStore = defineStore('reimUser', {
  state: () => {
    return {
      reimUser: {} as ReimUser,
      entities: <ReimUser>[],
      pagination: {} as Pagination,
      queryArgs: { status: "", keyword: "" },
    }
  },
  getters: {

  },
  actions: {
    async apiSave(data: ReimUser) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/reim_api/reim_user/save', 'post_json', data, { headers: { reimsessionid: session.sessionid } })
        .then((response) => {
          if (response.data?.status) {
            successNotification("Saved")
            return response.data?.data;
          } else {
            openNotification({ type: "error", message: "Fail to save", description: response.data?.message || "Fail to save" })
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiUpdate(data: ReimUser) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/reim_api/reim_user/update', 'post_json', data, { headers: { reimsessionid: session.sessionid } })
        .then((response) => {
          if (response.data?.status) {
            successNotification("Updated")
            return response.data?.data;
          } else {
            openNotification({ type: "error", message: "Fail to update", description: response.data?.message || "Fail to update" })
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiDelete(id: string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/reim_api/reim_user/delete', 'post_json', { id: id }, { headers: { reimsessionid: session.sessionid } })
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiSetStatus(record) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/reim_api/reim_user/set_status', 'post_json', record, { headers: { reimsessionid: session.sessionid } })
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiQuery() {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = {
        ...this.pagination,
        ...this.queryArgs
      }
      return http
        .request('/platform/reim_api/reim_user/query', 'post_json', bodyJson, { headers: { reimsessionid: session.sessionid } })
        .then((response) => {
          console.log('response:', response)
          if (response.data?.data) {
            this.pagination.total = response.data?.data?.total
            this.entities = response.data?.data?.entities
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiGet(id: string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = { id: id }
      return http
        .request('/platform/reim_api/reim_user/get', 'post_json', bodyJson, { headers: { reimsessionid: session.sessionid } })
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiQueryByIds(ids: string[]) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = {
        ids: ids
      }
      return http
        .request('/platform/reim_api/reim_user/query', 'post_json', bodyJson, { headers: { reimsessionid: session.sessionid } })
        .then((response) => {
          console.log('response:', response)
          if (response.data?.data) {
            this.pagination.total = response.data?.data?.total
            this.pagination.pagesize = response.data?.data?.total
            this.pagination.page = 1
            this.entities = response.data?.data?.entities
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async changePage(args: any) {
      console.log('args:', args)
      this.pagination.page = args.current
      this.pagination.pagesize = args.pageSize
      this.apiQuery()
    }
  },
})