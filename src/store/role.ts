import { defineStore } from 'pinia';
import http from './http';
import { ref, watch } from 'vue';
import { BaseComponent } from '@/types/components/base';
import { nanoid } from "nanoid";
import {getSessionInfo} from '@/utils/session'
import { useLoadingStore } from '@/store';
import {Pagination} from "@/types"

interface ReportReportRoleSettings {
  allowSelectImageFromAlbum?: boolean;
}


export interface ReportRole {
  id?: string;
  name?: string;
  permission?: any[];
  remark?: string;
  status?: string;
  create_at?: string;
}


export const ReportRoleStore = defineStore('reportRole', {
  state: () => {
    return { 
      reportReportRole: {} as ReportRole, 
      entities: <ReportRole>[], 
      pagination: {} as Pagination,
      queryArgs: {status: "", keyword: ""},
      isNew: false
    }
  },
  getters: {

  },
  actions: {
    async apiSaveReportRole(data: ReportRole) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_role/save', 'post_json', data, {headers: {rsessionid: session.sessionid}})
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiUpdateReportRole(data: ReportRole) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_role/update', 'post_json', data, {headers: {rsessionid: session.sessionid}})
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiDeleteReportRole(id: string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_role/delete', 'post_json', {id: id}, {headers: {rsessionid: session.sessionid}})
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiQueryReportRole() {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = {
        ...this.pagination,
        ...this.queryArgs
      }
      return http
        .request('/platform/report_api/report_role/query', 'post_json', bodyJson, {headers: {rsessionid: session.sessionid}})
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
    async apiGetReportRole(id:string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = {id: id }
      return http
        .request('/platform/report_api/report_role/get', 'post_json', bodyJson, {headers: {rsessionid: session.sessionid}})
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async changePage(args:any) {
      console.log('args:', args)
      this.pagination.page = args.current
      this.pagination.pagesize = args.pageSize
      this.apiQueryReportRole()
    }
  },
})