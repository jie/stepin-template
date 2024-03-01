import { defineStore } from 'pinia';
import http from './http';
import { getSessionInfo } from '@/utils/session'
import { useLoadingStore } from '@/store';
import { Pagination } from "@/types"
import { openNotification, successNotification } from '@/utils/notification';
import { inspect } from 'util';


export interface ReportCategory {
  id?: string;
  name?: string;
  name_en?: string;
  remark?: string;
  children?: Array<ReportCategory>;
  status?: string;
  org_id?: string;
}


export const ReportCategoryStore = defineStore('report_category', {
  state: () => {
    return {
      loading: false,
      entity: {} as ReportCategory,
      entities: <any>[],
      pagination: {} as Pagination,
      queryArgs: { status: "", keyword: ""},
    }
  },
  getters: {

  },
  actions: {
    async apiSave(data: ReportCategory) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_category/save', 'post_json', data, { headers: { rsessionid: session.sessionid } })
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
    async apiUpdate(data: Report) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_category/update', 'post_json', data, { headers: { rsessionid: session.sessionid } })
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
        .request('/platform/report_api/report_category/delete', 'post_json', { id: id }, { headers: { rsessionid: session.sessionid } })
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
        .request('/platform/report_api/report_category/query', 'post_json', bodyJson, { headers: { rsessionid: session.sessionid } })
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
    async apiQueryParent() {
        const { setPageLoading } = useLoadingStore();
        setPageLoading(true)
        this.loading = true
        let session = getSessionInfo()
        let bodyJson = {
          ...this.pagination,
          ...this.queryArgs
        }
        return http
          .request('/platform/report_api/report_category/query_parent', 'post_json', bodyJson, { headers: { rsessionid: session.sessionid } })
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
    async apiQueryByIdsReport(ids: string[]) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = {
        ids: ids
      }
      return http
        .request('/platform/report_api/report_category/query', 'post_json', bodyJson, { headers: { rsessionid: session.sessionid } })
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
    async apiGet(id: string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = { id: id }
      return http
        .request('/platform/report_api/report_category/get', 'post_json', bodyJson, { headers: { rsessionid: session.sessionid } })
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