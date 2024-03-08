import { defineStore } from 'pinia';
import http from './http';
import { getSessionInfo } from '@/utils/session'
import { useLoadingStore } from '@/store';
import { Pagination, statusFormSchema } from "@/types"
import { openNotification, successNotification } from '@/utils/notification';


const permissionInfoKey = "reportPermissionInfo"

export const ReportFillStore = defineStore('report_fill', {
  state: () => {
    return {
      loading: false,
      permissionForm: {
        email: "",
        password: ""
      },
      report: <any>{}
    }
  },
  getters: {

  },
  actions: {
    async apiCheckPermission(data: any) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let permissionInfo
      if(data) {
        permissionInfo = data
      } else {
        permissionInfo = localStorage.getItem(permissionInfoKey)
        if (!permissionInfo) {
          return false
        }
        permissionInfo = JSON.parse(permissionInfo)
        if (!permissionInfo.email || !permissionInfo.password) {
          localStorage.removeItem(permissionInfoKey)
          return false
        }
      }

      let permissionForm = { email: permissionInfo.email, password: permissionInfo.password }
      return http
        .request('/platform/report_api/report_fill/check_permission', 'post_json', permissionForm, {})
        .then((response) => {
          if (response.data?.status) {
            this.permissionForm = permissionForm
            localStorage.setItem(JSON.stringify(permissionForm))
          }
          return response.data?.status;
        })
        .finally(() => setPageLoading(false));
    },
    async apiGet(id: string) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let bodyJson = { id: id }
      return http
        .request('/platform/report_api/report/get', 'post_json', bodyJson, {})
        .then((response) => {
          if (response.data?.data) {
            this.report = response.data?.data?.entity
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async dbSave() {

    },
    async apiSave() {

    },
    async apiUpdate() {

    },
    async apiSubmit(email: string, password: string, values: any) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let bodyJson = { id: this.report.id, email: email, password: password, values: values }
      return http
        .request('/platform/report_api/report/fill', 'post_json', bodyJson, {})
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    }
  },
})