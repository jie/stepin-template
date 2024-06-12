import { defineStore } from 'pinia';
import http from './http';
import { ref, watch } from 'vue';
import { BaseComponent } from '@/types/components/base';
import { nanoid } from "nanoid";
import { getSessionInfo } from '@/utils/session'
import { useLoadingStore } from '@/store';
import { Pagination } from "@/types"
import { ExpenseType } from './expense_type';
import dayjs from 'dayjs';


export interface ReimRecordItem {
  id?: string;
  expense_type?: ExpenseType;
  charge_to?: string;
  amount?: number;
  currency?: string;
  target_currency?: string;
  remark?: string;
  items?: Array<ReimRecordPoint>;
}



export interface ReimRecordPoint {
  order?: any;
  remark?: string;
  images?: Array<string>;
  amount?: number;
  factory?: string;
  start_at?: dayjs.Dayjs;
  end_at?: dayjs.Dayjs;
  start_location?: string;
  end_location?: string;
  trans_type?: string;
  distance?: number;
  gas_criteria?: number;
  people_num?: number;
  hotel_name?: string;
  factory_name?: string;
  meal_criteria?: number;
  overtime_criteria: number;
  overtime_hours?: number;
  num?: number;
  product_name?: string;
  price?: number;
  purpose?: string;
  dateRange?: Array<dayjs.Dayjs>;
}

export interface ReimShoppingPoint extends ReimRecordPoint {
}

export interface ReimMealPoint extends ReimRecordPoint {

}
export interface ReimAccommondationPoint extends ReimRecordPoint {

}
export interface ReimTransportationPoint extends ReimRecordPoint {

}

export interface ReimOvertimePoint extends ReimRecordPoint {

}
export interface ReimOtherPoint extends ReimRecordPoint {

}

export interface ReimRecord {
  id?: string;
  name?: string;
  totalItems?: object;
  items?: Array<ReimRecordItem>;
  remark?: string;
  status?: string;
  create_at?: string;
}




export const ReimRecordStore = defineStore('reim_record', {
  state: () => {
    return {
      reimRecordEditIndex: null,
      reimRecord: { id: null, items: [], name: "", remark: "", totalItems: "" } as ReimRecord,
      reimRecordItem: { id: null, currency: '1', target_currency: '1', amount: "", items: [] } as ReimRecordItem,
      reimRecordPoint: {
        order: "",
        remark: "",
        images: "",
        amount: "",
        factory: "",
        start_at: "",
        end_at: "",
        start_location: "",
        end_location: "",
        trans_type: "",
        distance: "",
        gas_criteria: "",
        people_num: "",
        hotel_name: "",
        factory_name: "",
        meal_criteria: "",
        overtime_criteria: "",
        overtime_hours: "",
        num: "",
        product_name: "",
        price: "",
        purpose: "",
        dateRange: [],
        images: []
      } as ReimRecordPoint,
      reimShoppingPoint: {
        amount: "",
        product_name: "",
        price: "",
        num: "",
        start_at: "",
        purpose: "",
        remark: "",
        images: []
      } as ReimShoppingPoint,
      reimMealPoint: {
        factory_name: "",
        amount: "",
        start_at: "",
        meal_criteria: "",
        remark: "",
        images: []
      } as ReimMealPoint,
      reimOvertimePoint: {
        order: "",
        amount: "",
        overtime_criteria: "",
        overtime_hours: "",
        factory_name: "",
        remark: "",
        dateRange: [],
        images: []
      } as ReimOvertimePoint,
      reimAccommondationPoint: {
        order: "",
        amount: "",
        factory_name: "",
        people_num: "",
        hotel_name: "",
        start_location: "",
        dateRange: [],
        remark: "",
        images: []
      } as ReimAccommondationPoint,
      reimTransportationPoint: {
        order: "",
        remark: "",
        images: [],
        amount: "",
        start_location: "",
        end_location: "",
        trans_type: "",
        distance: "",
        gas_criteria: "",
        dateRange: []
      } as ReimTransportationPoint,
      reimOtherPoint: {
        amount: "",
        start_at: "",
        remark: "",
        images: []
      } as ReimOtherPoint,
      entities: <ReimRecord>[],
      orderEntities: [],
      pagination: {} as Pagination,
      orderPagination: {} as Pagination,
      queryArgs: { status: "", keyword: "" },
      isNew: false
    }
  },
  getters: {

  },
  actions: {
    resetItem(type) {
      switch (type) {
        case 'meal':
          this.reimMealPoint = {
            factory_name: "",
            amount: "",
            start_at: "",
            meal_criteria: "",
            remark: "",
            images: []
          } as ReimMealPoint
          break
        case 'accommondation':
          this.reimAccommondationPoint = {
            order: "",
            amount: "",
            factory_name: "",
            people_num: "",
            hotel_name: "",
            start_location: "",
            dateRange: [],
            remark: "",
            images: []
          } as ReimAccommondationPoint
          break
        case 'shppping':
          this.reimShoppingPoint = {
            amount: "",
            product_name: "",
            price: "",
            num: "",
            start_at: "",
            purpose: "",
            remark: "",
            images: []
          } as ReimShoppingPoint
          break
        case 'overtime':
          this.reimOvertimePoint = {
            order: "",
            amount: "",
            overtime_criteria: "",
            overtime_hours: "",
            factory_name: "",
            remark: "",
            dateRange: [],
            images: []
          } as ReimOvertimePoint
          break
        case 'transportation':
          this.reimTransportationPoint = {
            order: "",
            remark: "",
            amount: "",
            start_location: "",
            end_location: "",
            trans_type: "",
            distance: "",
            gas_criteria: "",
            dateRange: [],
            images: []
          } as ReimTransportationPoint
          break
        case 'other':
          this.reimOtherPoint = {
            amount: "",
            start_at: "",
            remark: "",
            images: []
          } as ReimOtherPoint
          break
        case 'item':
          this.reimRecordItem = { currency: '1', target_currency: '1', amount: "", items: [] } as ReimRecordItem
          break
        case 'record':
          this.reimRecord = { id: null, items: [], name: "", remark: "", totalItems: "" } as ReimRecord
          break
      }
    },
    async apiSave(data: ReimRecord) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/reim_api/record/save', 'post_json', data, { headers: { reimsessionid: session.sessionid } })
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
            return Promise.reject(response);
          }
        })
        .finally(() => setPageLoading(false));
    },
    async apiUpdate(data: ReimRecord) {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      return http
        .request('/platform/reim_api/record/update', 'post_json', data, { headers: { reimsessionid: session.sessionid } })
        .then((response) => {
          if (response.data?.data) {
            return response.data?.data;
          } else {
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
        .request('/platform/reim_api/record/delete', 'post_json', { id: id }, { headers: { reimsessionid: session.sessionid } })
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
      return http
        .request('/platform/reim_api/record/query', 'post_json', bodyJson, { headers: { reimsessionid: session.sessionid } })
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
    async apiOrdersQuery() {
      const { setPageLoading } = useLoadingStore();
      setPageLoading(true)
      let session = getSessionInfo()
      let bodyJson = {
        ...this.pagination,
        ...this.queryArgs
      }
      return http
        .request('/platform/reim_api/record/orders/query', 'post_json', bodyJson, { headers: { reimsessionid: session.sessionid } })
        .then((response) => {
          console.log('response:', response)
          if (response.data?.data) {
            this.orderPagination.total = response.data?.data?.total
            this.orderEntities = response.data?.data?.entities
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
        .request('/platform/reim_api/record/get', 'post_json', bodyJson, { headers: { reimsessionid: session.sessionid } })
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