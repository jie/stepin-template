import { defineStore } from 'pinia';
import http from './http';
import { ref, watch } from 'vue';
import { BaseComponent } from '@/types/components/base';
import { nanoid } from "nanoid";
import {getSessionInfo} from '@/utils/session'
import { useLoadingStore } from '@/store';
import {Pagination} from "@/types"



export interface ReimRole {
  id?: string;
  name?: string;
  permission?: any[];
  remark?: string;
  status?: string;
  create_at?: string;
}


export const ReimRoleStore = defineStore('reimRole', {
  state: () => {
    return { 
      reportReimRole: {} as ReimRole, 
      entities: <ReimRole>[], 
      pagination: {} as Pagination,
      queryArgs: {status: "", keyword: ""},
      isNew: false
    }
  },
  getters: {

  },
  actions: {
    async apiSave(data: ReimRole) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/reim_api/reim_role/save', 'post_json', data, {headers: {reimsessionid: session.sessionid}})
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiUpdate(data: ReimRole) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/reim_api/reim_role/update', 'post_json', data, {headers: {reimsessionid: session.sessionid}})
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
        .request('/platform/reim_api/reim_role/delete', 'post_json', {id: id}, {headers: {reimsessionid: session.sessionid}})
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
        .request('/platform/reim_api/reim_role/query', 'post_json', bodyJson, {headers: {reimsessionid: session.sessionid}})
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
        .request('/platform/reim_api/reim_role/get', 'post_json', bodyJson, {headers: {reimsessionid: session.sessionid}})
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