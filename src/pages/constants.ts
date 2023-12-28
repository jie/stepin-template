import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { ref, reactive } from 'vue';

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
    permissions: ['report:list', 'report:edit', 'report:verify', 'report:delete', 'report:email_customer', 'template:list', 'template:edit', 'template:delete', 'category:list', 'category:edit', 'category:delete', 'staff:list', 'staff:edit', 'staff:delete', 'role:list', 'role:edit', 'role:delete'],
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
    name: '查看报告列表',
    slug: 'report:list',
    sort: 'report'
  },
  {
    name: '查看报告详情',
    slug: 'report:view',
    sort: 'report'
  },
  {
    name: '修改报告',
    slug: 'report:edit',
    sort: 'report'
  },
  {
    name: '审核报告',
    slug: 'report:verify',
    sort: 'report'
  },
  {
    name: '删除报告',
    slug: 'report:delete',
    sort: 'report'
  },
  {
    name: '发送报告给客户',
    slug: 'report:email_customer',
    sort: 'report'
  },
  // template
  {
    name: '查看模版列表',
    slug: 'template:list',
    sort: 'template'
  },
  {
    name: '修改模版',
    slug: 'template:edit',
    sort: 'template'
  },
  {
    name: '删除模版',
    slug: 'template:delete',
    sort: 'template'
  },
  // category
  {
    name: '查看分类列表',
    slug: 'category:list',
    sort: 'category'
  },
  {
    name: '修改分类',
    slug: 'category:edit',
    sort: 'category'
  },
  {
    name: '删除分类',
    slug: 'category:delete',
    sort: 'category'
  },
  // staff
  {
    name: '查看成员列表',
    slug: 'staff:list',
    sort: 'staff'
  },
  {
    name: '修改成员',
    slug: 'staff:edit',
    sort: 'staff'
  },
  {
    name: '删除成员',
    slug: 'staff:delete',
    sort: 'staff'
  },
  // role
  {
    name: '查看角色列表',
    slug: 'role:list',
    sort: 'role'
  },
  {
    name: '修改成员',
    slug: 'role:edit',
    sort: 'role'
  },
  {
    name: '删除成员',
    slug: 'role:delete',
    sort: 'role'
  },
])


