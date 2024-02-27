import { defineStore } from 'pinia';
import http from './http';
import { getSessionInfo } from '@/utils/session'
import { useLoadingStore } from '@/store';
import { Pagination } from "@/types"
import { openNotification, successNotification } from '@/utils/notification';


export interface ReportCompany {
  id?: string;
  shortname?: string;
  org_id?: string;
  name?: string;
  remark?: string;
  status?: string;
  is_customer?: boolean;
  is_enable?: boolean;
  create_at?: string;
  avatar?: string;
}


export const ReportCompanyStore = defineStore('reportCompany', {
  state: () => {
    return {
      reportReportCompany: {} as ReportCompany,
      entities: <ReportCompany>[],
      pagination: {} as Pagination,
      queryArgs: { status: "", keyword: "", is_factory: false, is_customer: true },
    }
  },
  getters: {

  },
  actions: {
    async apiSaveReportCompany(data: ReportCompany) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_company/save', 'post_json', data, { headers: { rsessionid: session.sessionid } })
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
    async apiUpdateReportCompany(data: ReportCompany) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_company/update', 'post_json', data, { headers: { rsessionid: session.sessionid } })
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
    async apiDeleteReportCompany(id: string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_company/delete', 'post_json', { id: id }, { headers: { rsessionid: session.sessionid } })
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiQueryReportCompany() {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = {
        ...this.pagination,
        ...this.queryArgs
      }
      bodyJson.is_customer = true
      bodyJson.is_factory = false
      return http
        .request('/platform/report_api/report_company/query', 'post_json', bodyJson, { headers: { rsessionid: session.sessionid } })
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
    async apiGetReportCompany(id: string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = { id: id }
      return http
        .request('/platform/report_api/report_company/get', 'post_json', bodyJson, { headers: { rsessionid: session.sessionid } })
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
      this.apiQueryReportCompany()
    }
  },
})