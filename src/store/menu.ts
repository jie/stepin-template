import { defineStore, storeToRefs } from 'pinia';
import http from './http';
import { ref, toRaw, watch } from 'vue';
import { Response } from '@/types';
import { RouteOption } from '@/router/interface';
import { addRoutes, removeRoute } from '@/router/dynamicRoutes';
import {
  isRoleHasPermission,
  getUserPermissions
} from '@/router/permissionUtils';
import { useSettingStore } from './setting';
import { RouteRecordRaw, RouteMeta } from 'vue-router';
import { useAuthStore } from '@/plugins';
import router from '@/router';
import { useLoadingStore } from '@/store';
import routes from '@/router/routes';
import {i18n} from "@/lang/i18n"
const presetList = [
  {
    id: 1,
    name: 'dashboard',
    title: '工作台',
    icon: 'DashboardOutlined',
    badge: 'new',
    target: '_self',
    path: '/report_system/workplace/dashboard',
    component: '@/pages/dashboard',
    renderMenu: false,
    parent: null,
    permission: "dashboard:list",
    cacheable: false,
  },
  {
    id: 2,
    name: 'report',
    title: '报告',
    icon: 'ProfileOutlined',
    badge: '',
    target: '_self',
    path: '/report_system/workplace/report',
    component: '@/pages/report',
    renderMenu: true,
    parent: null,
    permission: "report:list",
    cacheable: false,
  },
  {
    id: 3,
    name: 'templates',
    title: '模版',
    icon: 'ProjectOutlined',
    badge: '',
    target: '_self',
    path: '/report_system/workplace/templates',
    component: '@/pages/template',
    renderMenu: true,
    parent: null,
    permission: "template:list",
    cacheable: false,
  },
  {
    id: 5,
    name: 'my_report',
    title: '我的报告',
    icon: 'ProjectOutlined',
    badge: '',
    target: '_self',
    path: '/report_system/workplace/my_report',
    component: '@/pages/my_report',
    renderMenu: true,
    parent: null,
    permission: "my_report:list",
    cacheable: false,
  },
  {
    id: 31,
    name: 'design',
    title: '模版设计',
    icon: 'ProjectOutlined',
    badge: '',
    target: '_self',
    path: '/report_system/workplace/template/design',
    component: '@/pages/designer',
    renderMenu: false,
    parent: 3,
    permission: "template:design",
    cacheable: false,
  },
  {
    id: 4,
    name: 'category',
    title: '分类',
    icon: 'PartitionOutlined',
    badge: '',
    target: '_self',
    path: '/report_system/workplace/category',
    component: '@/pages/category',
    renderMenu: true,
    parent: null,
    permission: "category:list",
    cacheable: false,
  },
  {
    id: 5,
    name: 'company',
    title: '客户',
    icon: 'SolutionOutlined',
    badge: '',
    target: '_self',
    path: '/report_system/workplace/company',
    component: '@/pages/company',
    renderMenu: true,
    parent: null,
    permission: "company:list",
    cacheable: false,
  },
  // {
  //   id: 6,
  //   name: 'company_contact',
  //   title: '客户联系人',
  //   icon: 'SolutionOutlined',
  //   badge: '',
  //   target: '_self',
  //   path: '/workplace/company_contact',
  //   component: '@/pages/company_contact',
  //   renderMenu: true,
  //   parent: null,
  //   permission: null,
  //   cacheable: false,
  // },
  // {
  //   id: 7,
  //   name: 'factory',
  //   title: '工厂',
  //   icon: 'SolutionOutlined',
  //   badge: '',
  //   target: '_self',
  //   path: '/workplace/factory',
  //   component: '@/pages/factory',
  //   renderMenu: true,
  //   parent: null,
  //   permission: null,
  //   cacheable: false,
  // },
  // {
  //   id: 8,
  //   name: 'factory_contact',
  //   title: '工厂联系人',
  //   icon: 'SolutionOutlined',
  //   badge: '',
  //   target: '_self',
  //   path: '/workplace/factory_contact',
  //   component: '@/pages/factory_contact',
  //   renderMenu: true,
  //   parent: null,
  //   permission: null,
  //   cacheable: false,
  // },
  {
    id: 9,
    name: 'user',
    title: '用户',
    icon: 'UserOutlined',
    badge: '',
    target: '_self',
    path: '/report_system/workplace/user',
    component: '@/pages/user',
    renderMenu: true,
    parent: null,
    permission: "user:list",
    cacheable: false,
  },
  {
    id: 10,
    name: 'role',
    title: '权限',
    icon: 'UsergroupAddOutlined',
    badge: '',
    target: '_self',
    path: '/report_system/workplace/role',
    component: '@/pages/role',
    renderMenu: true,
    parent: null,
    permission: "role:list",
    cacheable: false,
  },
  {
    id: 11,
    name: 'settings',
    title: '组织设置',
    icon: 'SettingOutlined',
    badge: '',
    target: '_self',
    path: '/report_system/workplace/settings',
    component: '@/pages/settings',
    renderMenu: true,
    parent: null,
    permission: "org:list",
    cacheable: false,
  },
  {
    id: 12,
    name: 'system_settings',
    title: '系统设置',
    icon: 'KeyOutlined',
    badge: '',
    target: '_self',
    path: '/report_system/workplace/system_settings',
    component: '@/pages/system_settings',
    renderMenu: true,
    parent: null,
    permission: "system_settings:list",
    cacheable: false,
  },
  {
    id: 13,
    name: 'defect',
    title: '缺陷管理',
    icon: 'BugOutlined',
    badge: '',
    target: '_self',
    path: '/report_system/workplace/defect',
    component: '@/pages/defect',
    renderMenu: true,
    parent: null,
    permission: "defect:list",
    cacheable: false,
  },
  {
    id: 14,
    name: 'report_fill',
    title: '填写报告',
    icon: 'KeyOutlined',
    badge: '',
    target: '_self',
    path: '/public/report/fill/:reportId',
    component: '@/pages/report_fill',
    renderMenu: false,
    parent: null,
    permission: null,
    cacheable: false,
  },
  {
    id: 15,
    name: 'report_review',
    title: '审核报告内容',
    icon: 'KeyOutlined',
    badge: '',
    target: '_self',
    path: '/public/report/review/:reportId',
    component: '@/pages/report_review',
    renderMenu: false,
    parent: null,
    permission: null,
    cacheable: false,
  },
  {
    id: 16,
    name: 'customer_review',
    title: '查看第三方报告内容',
    icon: 'KeyOutlined',
    badge: '',
    target: '_self',
    path: '/public/report/customer_review/:customerId/:reportId',
    component: '@/pages/customer_review',
    renderMenu: false,
    parent: null,
    permission: null,
    cacheable: false,
  },
  // {
  //   id: 4,
  //   name: 'personal',
  //   title: '个人中心',
  //   path: '/personal',
  //   icon: 'ProfileOutlined',
  //   permission: null,
  //   component: '@/pages/personal',
  //   renderMenu: true,
  //   parent: null,
  // },
  // {
  //   id: 6,
  //   name: 'system',
  //   title: '系统配置',
  //   icon: 'SettingOutlined',
  //   badge: '',
  //   target: '_self',
  //   path: '/system',
  //   component: '@/components/layout/BlankView.vue',
  //   renderMenu: true,
  //   parent: null,
  //   permission: null,
  //   cacheable: true,
  // },
  // {
  //   id: 8,
  //   name: 'menu',
  //   title: '菜单管理',
  //   badge: '12',
  //   target: '_self',
  //   path: '/system/menu',
  //   component: '@/pages/system',
  //   renderMenu: true,
  //   parent: 'system',
  //   permission: null,
  //   cacheable: true,
  // },
  // {
  //   id: 7,
  //   name: 'user',
  //   title: '用户管理',
  //   target: '_self',
  //   path: '/system/user',
  //   component: '@/pages/user',
  //   renderMenu: true,
  //   parent: 'system',
  //   permission: null,
  //   cacheable: true,
  // },
  // {
  //   id: 9,
  //   name: 'bilibili',
  //   title: 'B站',
  //   icon: 'BoldOutlined',
  //   badge: 'iframe',
  //   target: '_self',
  //   path: '/bilibili',
  //   component: 'iframe',
  //   renderMenu: true,
  //   permission: 'edit',
  //   cacheable: true,
  //   link: 'https://www.bilibili.com',
  // },
  // {
  //   id: 10,
  //   name: 'github',
  //   title: 'Github',
  //   icon: 'GithubOutlined',
  //   badge: 'link',
  //   target: '_blank',
  //   path: '/github',
  //   component: 'link',
  //   renderMenu: true,
  //   parent: null,
  //   cacheable: true,
  //   link: 'https://github.com/stepui/stepin-template',
  // },
];

export interface MenuProps {
  id?: number;
  name: string;
  path: string;
  title?: string;
  icon?: string;
  badge?: number | string;
  target?: '_self' | '_blank';
  link?: string;
  component: string;
  renderMenu?: boolean;
  permission?: string;
  parent?: string;
  children?: MenuProps[];
  cacheable?: boolean;
  view?: string;
}

/**
 * 过滤菜单
 * @param routes
 * @param parentPermission
 */
function doMenuFilter(routes: Readonly<RouteRecordRaw[]>, parentPermission?: string) {
  const { hasAuthority } = useAuthStore();
  const setCache = (meta: RouteMeta) => {
    meta._cache = {
      renderMenu: meta.renderMenu,
    };
  };


  routes.forEach((route) => {
    const required = route.meta?.permission ?? parentPermission;
    // if (route.meta?.renderMenu === undefined && required) {
    if (required) {
      route.meta = route.meta ?? {};
      setCache(route.meta);

      route.meta.renderMenu = route.meta.renderMenu && isRoleHasPermission(getUserPermissions(), route.meta.permission);
      // route.meta.renderMenu = isRoleHasPermission(getUserPermissions(), route.meta.permission);
      // route.meta.renderMenu = hasAuthority(route.meta.permission);
    }
    if (route.children) {
      doMenuFilter(route.children, required);
    }
  });
}

/**
 * 重置过滤
 * @param routes
 */
function resetMenuFilter(routes: Readonly<RouteRecordRaw[]>) {
  const resetCache = (meta: RouteMeta) => {
    if (meta._cache) {
      meta.renderMenu = meta._cache?.renderMenu;
    }
    delete meta._cache;
  };
  routes.forEach((route) => {
    if (route.meta) {
      resetCache(route.meta);
    }
    if (route.children) {
      resetMenuFilter(route.children);
    }
  });
}

// 菜单数据转为路由数据
const toRoutes = (list: MenuProps[]): RouteOption[] => {
  return list.map((item) => ({
    name: item.name,
    path: item.path,
    component: item.component,
    children: item.children && toRoutes(item.children),
    meta: {
      title: i18n.global.t(`menu.${item.name}`),
      permission: item.permission,
      icon: item.icon,
      renderMenu: item.renderMenu,
      cacheable: item.cacheable,
      href: item.link,
      badge: /^(false|true)$/i.test(item.badge + '') ? JSON.parse(item.badge + '') : item.badge,
      target: item.target,
      view: item.view,
    },
  }));
};

export const useMenuStore = defineStore('menu', () => {
  const menuList = ref<MenuProps[]>([]);

  const { filterMenu } = storeToRefs(useSettingStore());
  const checkMenuPermission = () => {
    // if (filterMenu.value) {
    //   doMenuFilter(router.options.routes);
    // } else {
    //   resetMenuFilter(router.options.routes);
    // }
    doMenuFilter(router.options.routes);
  };

  checkMenuPermission();

  watch(filterMenu, checkMenuPermission);
  // use remote menu
  // async function getMenuList() {
  //   const { setPageLoading } = useLoadingStore();
  //   setPageLoading(true);
  //   return http
  //     .request<MenuProps[], Response<MenuProps[]>>('/menu', 'GET')
  //     .then((res) => {
  //       // const { data } = res;
  //       let data = presetList
  //       menuList.value = data;
  //       console.log('menuList:', toRaw(menuList.value))
  //       addRoutes(toRoutes(data));
  //       console.log('routes:', toRaw(routes))
  //       checkMenuPermission();
  //       return data;
  //     })
  //     .finally(() => setPageLoading(false));
  // }
  // use local menu
  async function getMenuList() {
    menuList.value = presetList;
    console.log('menuList:', toRaw(toRoutes(presetList)))
    addRoutes(toRoutes(presetList));
    checkMenuPermission();
    return presetList
  }

  async function addMenu(menu: MenuProps) {
    return http
      .request<any, Response<any>>('/menu', 'POST_JSON', menu)
      .then((res) => {
        return res.data;
      })
      .finally(getMenuList);
  }

  async function updateMenu(menu: MenuProps) {
    return http
      .request<any, Response<any>>('/menu', 'PUT_JSON', menu)
      .then((res) => {
        return res.data;
      })
      .finally(getMenuList);
  }

  async function removeMenu(id: number) {
    return http
      .request<any, Response<any>>('/menu', 'DELETE', { id })
      .then(async (res) => {
        if (res.code === 0) {
          removeRoute(res.data.name);
        }
      })
      .finally(getMenuList);
  }

  return {
    menuList,
    getMenuList,
    addMenu,
    updateMenu,
    removeMenu,
  };
});
