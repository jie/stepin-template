import { defineStore } from 'pinia';
import http from './http';
import { ref, watch } from 'vue';
import { BaseComponent } from '@/types/components/base';
import { nanoid } from "nanoid";
import {getSessionInfo} from '@/utils/session'
import { useLoadingStore } from '@/store';
import {Pagination} from "@/types"

interface ReportTemplateSettings {
  allowSelectImageFromAlbum?: boolean;
}



export interface ReportTemplate {
  id?: string;
  title?: string;
  summary?: string;
  settings?: ReportTemplateSettings;
  items?: BaseComponent[];
  currentEditComponent?: BaseComponent;
}


export const ReportTemplateStore = defineStore('reportTemplate', {
  state: () => {
    return { 
      reportTemplate: {} as ReportTemplate, 
      entities: <ReportTemplate>[], 
      pagination: {} as Pagination,
      queryArgs: {status: "", keyword: ""},
    }
  },
  getters: {

  },
  actions: {
    initReportTemplate(data: ReportTemplate) {
      this.reportTemplate = data;
    },
    addComponents(coms: BaseComponent[]) {
      for(let com of coms) {
        this.addComponent(com);
      }
    },
    addComponent(com: BaseComponent) {
      com.beforeAdd();
      this.reportTemplate.items?.push(com);
      com.afterAdd();
    },
    delComponent(com: BaseComponent) {
      com.beforeDel();
      // remove com from reportTemplate.items by com.key
      this.reportTemplate.items?.splice(this.reportTemplate.items?.findIndex((item) => item.key === com.key), 1);
      com.afterDel();
    },
    setCurrentEditComponent(com: BaseComponent) {
      this.reportTemplate.currentEditComponent = com;
    },
    async apiSaveTemplate(data: ReportTemplate) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_template/save', 'post_json', data, {headers: {rsessionid: session.sessionid}})
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiUpdateTemplate(data: ReportTemplate) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_template/update', 'post_json', data, {headers: {rsessionid: session.sessionid}})
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiDeleteTemplate(id: string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_template/delete', 'post_json', {id: id}, {headers: {rsessionid: session.sessionid}})
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiQueryTemplate() {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = {
        ...this.pagination,
        ...this.queryArgs
      }
      return http
        .request('/platform/report_api/report_template/query', 'post_json', bodyJson, {headers: {rsessionid: session.sessionid}})
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
    async apiGetTemplate(id:string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = {id: id }
      return http
        .request('/platform/report_api/report_template/get', 'post_json', bodyJson, {headers: {rsessionid: session.sessionid}})
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
        .request('/platform/report_api/report_template/query', 'post_json', bodyJson, { headers: { rsessionid: session.sessionid } })
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
    async changePage(args:any) {
      console.log('args:', args)
      this.pagination.page = args.current
      this.pagination.pagesize = args.pageSize
      this.apiQueryTemplate()
    }
  },
})