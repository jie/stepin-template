import { defineStore } from 'pinia';
import http from './http';
import { ref, watch } from 'vue';
import { BaseComponent } from '@/types/components/base';
import { nanoid } from "nanoid";
import {getSessionInfo} from '@/utils/session'
import { useLoadingStore } from '@/store';
import {Pagination} from "@/types"


export interface ReimPermission {
  id?: string;
  name?: string;
  slug?: string;
  remark?: string;
  is_enable?: boolean;
  create_at?: string;
}


export const ReimPermissionStore = defineStore('reimPermission', {
  state: () => {
    return { 
      reimPermission: {} as ReimPermission, 
      entities: <ReimPermission>[], 
      pagination: {} as Pagination,
      queryArgs: {status: "", keyword: "", pagesize: 1000},
      isNew: false
    }
  },
  getters: {

  },
  actions: {
    async apiSave(data: ReimPermission) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/reim_api/reim_permission/save', 'post_json', data, {headers: {reimsessionid: session.sessionid}})
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiUpdate(data: ReimPermission) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/reim_api/reim_permission/update', 'post_json', data, {headers: {reimsessionid: session.sessionid}})
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
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
        .request('/platform/reim_api/reim_permission/delete', 'post_json', {id: id}, {headers: {reimsessionid: session.sessionid}})
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
        .request('/platform/reim_api/reim_permission/query', 'post_json', bodyJson, {headers: {reimsessionid: session.sessionid}})
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
    async apiGet(id:string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = {id: id }
      return http
        .request('/platform/reim_api/reim_permission/get', 'post_json', bodyJson, {headers: {reimsessionid: session.sessionid}})
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
      this.apiQuery()
    }
  },
})