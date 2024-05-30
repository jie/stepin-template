import { defineStore } from 'pinia';
import http from './http';
import { getSessionInfo } from '@/utils/session'
import { useLoadingStore } from '@/store';
import { Pagination, statusFormSchema } from "@/types"
import { openNotification, successNotification } from '@/utils/notification';
import { inspect } from 'util';

export interface ReportTag {
  id?: string;
  name?: string;
  summary?: string;
}


export const ReportTagStore = defineStore('report_tag', {
  state: () => {
    return {
      mode: '',
      loading: false,
      reportTag: {} as ReportTag,
      entities: <any>[],
      tagsOptions: <any>[],
      pagination: {} as Pagination,
      queryArgs: { name: "" },
    }
  },
  getters: {

  },
  actions: {
    async apiSave(data: Report) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/report_api/report_tag/save', 'post_json', data, { headers: { rsessionid: session.sessionid } })
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
        .request('/platform/report_api/report_tag/update', 'post_json', data, { headers: { rsessionid: session.sessionid } })
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
        .request('/platform/report_api/report_tag/delete', 'post_json', { id: id }, { headers: { rsessionid: session.sessionid } })
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
        .request('/platform/report_api/report_tag/query', 'post_json', bodyJson, { headers: { rsessionid: session.sessionid } })
        .then((response) => {
          console.log('response:', response)
          if (response.data?.data) {
            this.pagination.total = response.data?.data?.total
            this.entities = response.data?.data?.entities
            if (this.mode == 'option') {
              this.tagsOptions = response.data?.data?.entities.map(item => {
                return { label: item.name, value: item.id }
              })
            }

            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => { setPageLoading(false); this.loading = false });
    },
    async changePage(args: any) {
      console.log('args:', args)
      this.pagination.page = args.current
      this.pagination.pagesize = args.pageSize
      this.apiQuery()
    }
  },
})