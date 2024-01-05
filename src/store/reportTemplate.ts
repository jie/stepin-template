import { defineStore, storeToRefs } from 'pinia';
import http from './http';
import { ref, watch } from 'vue';
// import { Response } from '@/types';
// import { RouteOption } from '@/router/interface';
// import { addRoutes, removeRoute } from '@/router/dynamicRoutes';
// import { useSettingStore } from './setting';
// import { RouteRecordRaw, RouteMeta } from 'vue-router';
// import { useAuthStore } from '@/plugins';
// import router from '@/router';
// import { useLoadingStore } from '@/store';


export interface templateItem {
  title: string;
  desc?: string;
  type: string;
  key: string;
}

export interface ReportTemplate {
  title?: string;
  summary?: string;
  items?: templateItem[];
}



export const ReportTemplateStore = defineStore('reportTemplate', {
  state: () => {
    return { reportTemplate: {} as ReportTemplate }
  },
  getters: {
  },
  actions: {
    initReportTemplate(data: ReportTemplate) {
      this.reportTemplate = data;
    },
    addComponent(data: templateItem) {
      this.reportTemplate.items?.push(data);
    }
  },
})