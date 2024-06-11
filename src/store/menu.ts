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
    path: '/reim_system/workplace/dashboard',
    component: '@/pages/dashboard',
    renderMenu: false,
    parent: null,
    permission: "dashboard:list",
    cacheable: false,
  },
  {
    id: 7,
    name: 'record',
    title: '报销类型',
    icon: 'UserOutlined',
    badge: '',
    target: '_self',
    path: '/reim_system/workplace/record',
    component: '@/pages/record',
    renderMenu: true,
    parent: null,
    permission: "record:list",
    cacheable: false,
  },
  {
    id: 8,
    name: 'expense_type',
    title: '报销类型',
    icon: 'UserOutlined',
    badge: '',
    target: '_self',
    path: '/reim_system/workplace/expense_type',
    component: '@/pages/expense_type',
    renderMenu: true,
    parent: null,
    permission: "expense_type:list",
    cacheable: false,
  },

  {
    id: 9,
    name: 'user',
    title: '用户',
    icon: 'UserOutlined',
    badge: '',
    target: '_self',
    path: '/reim_system/workplace/user',
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
    path: '/reim_system/workplace/role',
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
    path: '/reim_system/workplace/settings',
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
    path: '/reim_system/workplace/system_settings',
    component: '@/pages/system_settings',
    renderMenu: true,
    parent: null,
    permission: "system_settings:list",
    cacheable: false,
  }
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
