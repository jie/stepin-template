import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { ref, reactive } from 'vue';

export const VerifyStatuses = {
  '0': '未通过审核',
  '1': '未审核',
  '2': '审核中',
  '3': '已审核'
}


export const ReportStatuses = {
  '0': '未通过审核',
  '1': '待检验',
  '2': '检验中',
  '3': '已填写',
  '4': '审核中',
  '5': '已审核',
  '6': '已发送',
  '100': '已取消'
}

export type Role = {
  id?: string;
  name?: string;
  role?: string;
  status?: number;
  time?: Dayjs;
  _edit?: boolean;
  _isNew?: boolean;
  permissions?: string[];
};

export type Permission = {
  id?: string;
  name?: string;
  slug?: string;
  sort?: string;
};

export const roles = reactive<Role[]>([
  {
    name: '管理员',
    status: 1,
    time: dayjs(),
    id: "1"
  },
  {
    name: '审核员',
    status: 0,
    permissions: ['report:list', 'report:edit', 'report:verify', 'report:delete', 'report:email_customer', 'template:list', 'template:edit', 'template:delete', 'category:list', 'category:edit', 'category:delete', 'user:list', 'user:edit', 'user:delete', 'role:list', 'role:edit', 'role:delete'],
    time: dayjs(),
    id: "2"
  },
  {
    name: '客户',
    status: 1,
    permissions: ['report:view'],
    time: dayjs(),
    id: "3"
  },
  {
    name: '检验员',
    status: 0,
    permissions: ['report:view', 'report:edit'],
    time: dayjs(),
    id: "4"
    
  },
]);


export const permissions = reactive<Permission[]>([
  {
    "id": "65db5231029d1d4a55472f22",
    "name": "查看报告列表",
    "slug": "report:list"
  },
  {
    "id": "65db5240029d1d4a55472f23",
    "name": "查看报告详情",
    "slug": "report:view"
  },
  {
    "id": "65db5268029d1d4a55472f24",
    "name": "修改报告",
    "slug": "report:edit"
  },
  {
    "id": "65db527a029d1d4a55472f25",
    "name": "审核报告",
    "slug": "report:verify"
  },
  {
    "id": "65db5296029d1d4a55472f26",
    "name": "删除报告",
    "slug": "report:delete"
  },
  {
    "id": "65db52a7029d1d4a55472f27",
    "name": "发送报告给客户",
    "slug": "report:email_customer"
  },
  // template
  // {
  //   "name": "查看模版列表",
  //   "slug": "template:list"
  // },
  // {
  //   "name": "修改模版",
  //   "slug": "template:edit"
  // },
  // {
  //   "name": "删除模版",
  //   "slug": "template:delete"
  // },
  // // category
  // {
  //   "name": "查看分类列表",
  //   "slug": "category:list"
  // },
  // {
  //   "name": "修改分类",
  //   "slug": "category:edit"
  // },
  // {
  //   "name": "删除分类",
  //   "slug": "category:delete"
  // },
  // // user
  // {
  //   "name": "查看成员列表",
  //   "slug": "user:list"
  // },
  // {
  //   "name": "修改成员",
  //   "slug": "user:edit"
  // },
  // {
  //   "name": "删除成员",
  //   "slug": "user:delete"
  // },
  // // role
  // {
  //   "name": "查看角色列表",
  //   "slug": "role:list"
  // },
  // {
  //   "name": "修改成员",
  //   "slug": "role:edit"
  // },
  // {
  //   "name": "删除成员",
  //   "slug": "role:delete"
  // },
])

export type Report = {
  id?:string;
  name?: string;
  customer?: any;
  workers?: any[];
  factory?: any;
  company?: any;
  category?: any;
  report_template?: any;
  status?: string;
  inspect_date?: Dayjs;
  _edit?: boolean;
  _isNew?: boolean;
};


export const customers = reactive([
  {
    id: '1',
    name: '岳阳宝丽纺织品有限公司'
  },
  {
    id: '2',
    name: '宁海南航电器'
  },
  {
    id: '3',
    name: '嵊州三健网业有限公司'
  },
  {
    id: '4',
    name: '福建省创翔鞋业有限公司'
  }
])


export const factories = reactive([
  {
    id: '1',
    name: '岳阳宝丽纺织品工厂'
  },
  {
    id: '2',
    name: '宁海南航电器工厂'
  },
  {
    id: '3',
    name: '嵊州三健网业工厂'
  },
  {
    id: '4',
    name: '福建省创翔工厂'
  }
])

export const workers = reactive([{
  id: '1',
  name: '钟晓平'
}, {
  id: '2',
  name: '许忠周'
}, {
  id: '3',
  name: '杜心良',
}, {
  id: '4',
  name: 'Mahesh Krishnan'
}])

export const categories = reactive([
  {
    id: '1',
    name: '纺织品'
  },
  {
    id: '2',
    name: '电器'
  },
  {
    id: '3',
    name: '药品'
  },
  {
    id: '4',
    name: '鞋类'
  }
])


export const reports = reactive<Report[]>(
//   [
//   {
//     name: '2023-12-20岳阳宝丽纺织品有限公司',
//     customer: '荣恰',
//     category: '纺织品',
//     workers: '钟晓平',
//     status: '0',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-21岳阳宝丽纺织品有限公司',
//     customer: '荣恰',
//     category: '纺织品',
//     workers: '钟晓平',
//     status: '1',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-23宁海南航电器',
//     customer: '三问家居',
//     category: '电器',
//     workers: '许忠周',
//     status: '2',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-24嵊州三健网业有限公司',
//     customer: 'KasutU',
//     category: '药品',
//     workers: '杜心良',
//     status: '3',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-25福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '4',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-26福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '5',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-27福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '6',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-28福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '100',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-20岳阳宝丽纺织品有限公司',
//     customer: '荣恰',
//     category: '纺织品',
//     workers: '钟晓平',
//     status: '0',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-21岳阳宝丽纺织品有限公司',
//     customer: '荣恰',
//     category: '纺织品',
//     workers: '钟晓平',
//     status: '1',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-23宁海南航电器',
//     customer: '三问家居',
//     category: '电器',
//     workers: '许忠周',
//     status: '2',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-24嵊州三健网业有限公司',
//     customer: 'KasutU',
//     category: '药品',
//     workers: '杜心良',
//     status: '3',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-25福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '4',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-26福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '5',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-27福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '6',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-28福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '100',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-20岳阳宝丽纺织品有限公司',
//     customer: '荣恰',
//     category: '纺织品',
//     workers: '钟晓平',
//     status: '0',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-21岳阳宝丽纺织品有限公司',
//     customer: '荣恰',
//     category: '纺织品',
//     workers: '钟晓平',
//     status: '1',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-23宁海南航电器',
//     customer: '三问家居',
//     category: '电器',
//     workers: '许忠周',
//     status: '2',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-24嵊州三健网业有限公司',
//     customer: 'KasutU',
//     category: '药品',
//     workers: '杜心良',
//     status: '3',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-25福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '4',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-26福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '5',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-27福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '6',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-28福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '100',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-20岳阳宝丽纺织品有限公司',
//     customer: '荣恰',
//     category: '纺织品',
//     workers: '钟晓平',
//     status: '0',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-21岳阳宝丽纺织品有限公司',
//     customer: '荣恰',
//     category: '纺织品',
//     workers: '钟晓平',
//     status: '1',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-23宁海南航电器',
//     customer: '三问家居',
//     category: '电器',
//     workers: '许忠周',
//     status: '2',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-24嵊州三健网业有限公司',
//     customer: 'KasutU',
//     category: '药品',
//     workers: '杜心良',
//     status: '3',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-25福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '4',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-26福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '5',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-27福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '6',
//     time: dayjs(),
//   },
//   {
//     name: '2023-12-28福建省创翔鞋业有限公司',
//     customer: '世达外贸',
//     category: '鞋类',
//     workers: 'Mahesh Krishnan',
//     status: '100',
//     time: dayjs(),
//   },
// ]
);



