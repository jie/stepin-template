import { defineStore } from 'pinia';
import http from './http';
import { getSessionInfo } from '@/utils/session'
import { useLoadingStore } from '@/store';
import { Pagination } from "@/types"
import { openNotification, successNotification } from '@/utils/notification';
import { inspect } from 'util';


export interface Report {
  id?: string;
  name?: string;
  settings?: any;
  inspect_date?:string;
  report_template_id?: string;
  users?: Array<string>;
  company_id?: string;
  company_contact_id?: string;
  factory_id?: string;
  factory_contact_id?: string;
  workers?: Array<string>;
  category_id?: string;
  address?: any;
  status?: string;
  org_id?: string;
  order_id?: string;
}


export const ReportStore = defineStore('report', {
  state: () => {
    return {
      loading: false,
      reportReport: {} as Report,
      entities: <any>[],
      pagination: {} as Pagination,
      queryArgs: { status: "", keyword: "", worker_name: "", company_name: "", inspect_start: "", inspect_end: "", category_id:""},
    }
  },
  getters: {

  },
  actions: {
    async apiSaveReport(data: Report) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report/save', 'post_json', data, { headers: { rsessionid: session.sessionid } })
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
    async apiUpdateReport(data: Report) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report/update', 'post_json', data, { headers: { rsessionid: session.sessionid } })
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
    async apiDeleteReport(id: string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report/delete', 'post_json', { id: id }, { headers: { rsessionid: session.sessionid } })
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiQueryReport() {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      this.loading = true
      let session = getSessionInfo()
      let bodyJson = {
        ...this.pagination,
        ...this.queryArgs
      }
      return http
        .request('/platform/report_api/report/query', 'post_json', bodyJson, { headers: { rsessionid: session.sessionid } })
        .then((response) => {
          console.log('response:', response)
          if (response.data?.data) {
            this.pagination.total = response.data?.data?.total
            this.entities = response.data?.data?.entities.map(item=>{
              if(item.order) {
                item.category = item.order.category
                item.company = item.order.company
                item.company_contact = item.order.company_customer
                item.factory_contact = item.order.factory_contacts[0]
                item.workers = item.order.workers.map(c=>{return c.worker.name}).join(',')
              }
              return item
            }) 
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => {setPageLoading(false);this.loading = false});
    },
    async apiQueryByIdsReport(ids: string[]) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = {
        ids: ids
      }
      return http
        .request('/platform/report_api/report/query', 'post_json', bodyJson, { headers: { rsessionid: session.sessionid } })
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
    async apiGetReport(id: string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = { id: id }
      return http
        .request('/platform/report_api/report/get', 'post_json', bodyJson, { headers: { rsessionid: session.sessionid } })
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
      this.apiQueryReport()
    }
  },
})