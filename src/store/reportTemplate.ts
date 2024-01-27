import { defineStore, storeToRefs } from 'pinia';
import http from './http';
import { ref, watch } from 'vue';
import { BaseComponent } from '@/types/components/base';
// import { Response } from '@/types';
// import { RouteOption } from '@/router/interface';
// import { addRoutes, removeRoute } from '@/router/dynamicRoutes';
// import { useSettingStore } from './setting';
// import { RouteRecordRaw, RouteMeta } from 'vue-router';
// import { useAuthStore } from '@/plugins';
// import router from '@/router';
// import { useLoadingStore } from '@/store';



export interface ReportTemplate {
  title?: string;
  summary?: string;
  items?: BaseComponent[];
  currentEditComponent?: BaseComponent;
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
  },
})