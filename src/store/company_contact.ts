import { defineStore } from 'pinia';
import http from './http';
import { getSessionInfo } from '@/utils/session'
import { useLoadingStore } from '@/store';
import { Pagination } from "@/types"
import { openNotification, successNotification } from '@/utils/notification';


export interface ReportCompanyContact {
  id?: string;
  org_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  remark?: string;
  status?: string;
  company?: any;
  company_id?: string;
  is_enable?: boolean;
  create_at?: string;
  avatar?: string;
}


export const ReportCompanyContactStore = defineStore('reportCompanyContact', {
  state: () => {
    return {
      reportReportCompany: {} as ReportCompanyContact,
      entities: <ReportCompanyContact>[],
      pagination: {} as Pagination,
      queryArgs: { status: "", keyword: "", is_factory: false, is_customer: true },
    }
  },
  getters: {

  },
  actions: {
    async apiSave(data: ReportCompanyContact) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_company_contact/save', 'post_json', data, { headers: { rsessionid: session.sessionid } })
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
    async apiUpdate(data: ReportCompanyContact) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_company_contact/update', 'post_json', data, { headers: { rsessionid: session.sessionid } })
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
    async apiDeleteContact(id: string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_company_contact/delete', 'post_json', { id: id }, { headers: { rsessionid: session.sessionid } })
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
      bodyJson.is_customer = true
      bodyJson.is_factory = false
      return http
        .request('/platform/report_api/report_company_contact/query', 'post_json', bodyJson, { headers: { rsessionid: session.sessionid } })
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
    async apiGetContact(id: string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = { id: id }
      return http
        .request('/platform/report_api/report_company_contact/get', 'post_json', bodyJson, { headers: { rsessionid: session.sessionid } })
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