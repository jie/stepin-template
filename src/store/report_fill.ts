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
      }
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
  },
})