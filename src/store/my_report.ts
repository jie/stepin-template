import { defineStore } from 'pinia';
import http from './http';
import { getSessionInfo } from '@/utils/session'
import { useLoadingStore } from '@/store';
import { Pagination, statusFormSchema } from "@/types"
import { openNotification, successNotification } from '@/utils/notification';
import { inspect } from 'util';


export const MyReportStore = defineStore('my_report', {
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
        .request('/platform/report_api/report/query_my', 'post_json', bodyJson, { headers: { rsessionid: session.sessionid } })
        .then((response) => {
          console.log('response:', response)
          if (response.data?.data) {
            this.pagination.total = response.data?.data?.total
            this.entities = response.data?.data?.entities.map(item=>{
              if(item.order) {
                item.order_data = {
                  category: item.order.category,
                  company: item.order.company,
                  company_contact: item.order.company_customer,
                  factory_contact: item.order.factory_contacts[0],
                  workers: item.order.workers.map(c=>{return c.worker.name}).join(','),
                }
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
      this.apiQuery()
    }
  },
})