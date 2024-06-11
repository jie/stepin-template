import { defineStore } from 'pinia';
import http from './http';
import { getSessionInfo } from '@/utils/session'
import { useLoadingStore } from '@/store';
import { Pagination } from "@/types"
import { openNotification, successNotification } from '@/utils/notification';
import { inspect } from 'util';


export interface ReportSystemConfig {
  id?: string;
  date_type?: string;
  key?: string;
  value?: any;
  desc?: string;
  status?: string;
  org_id?: string;
}


export const ReportSystemConfigStore = defineStore('reim_system_config', {
  state: () => {
    return {
      loading: false,
      isNew: false,
      reportSystemConfig: {} as ReportSystemConfig,
      entities: <any>[],
      pagination: {} as Pagination,
      queryArgs: { status: "", keyword: ""},
    }
  },
  getters: {

  },
  actions: {
    async apiSave(data: ReportSystemConfig) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/reim_api/reim_system_config/save', 'post_json', data, { headers: { reimsessionid: session.sessionid } })
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
    async apiUpdate(data: ReportSystemConfig) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/reim_api/reim_system_config/update', 'post_json', data, { headers: { reimsessionid: session.sessionid } })
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
        .request('/platform/reim_api/reim_system_config/delete', 'post_json', { id: id }, { headers: { reimsessionid: session.sessionid } })
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
      this.loading = true
      let session = getSessionInfo()
      let bodyJson = {
        ...this.pagination,
        ...this.queryArgs
      }
      return http
        .request('/platform/reim_api/reim_system_config/query', 'post_json', bodyJson, { headers: { reimsessionid: session.sessionid } })
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
        .finally(() => {setPageLoading(false);this.loading = false});
    },
    async apiGet(id: string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = { id: id }
      return http
        .request('/platform/reim_api/reim_system_config/get', 'post_json', bodyJson, { headers: { reimsessionid: session.sessionid } })
        .then((response) => {
          if (response.data?.data) {
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