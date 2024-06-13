import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/home',
    meta: {
      title: 'index',
      renderMenu: false,
      icon: 'CreditCardOutlined',
    },
  },
  {
    path: '/front',
    name: 'front',
    meta: {
      renderMenu: false,
    },
    component: () => import('@/components/layout/FrontView.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          view: 'blank',
        },
        component: () => import('@/pages/home'),
      },
    ],
  },
  {
    path: '/reim_system/workplace',
    name: 'workplace',
    meta: {
      renderMenu: false,
    },
    // component: () => import('@/components/layout/FrontView.vue'),
    children: [
      {
        path: '',
        name: 'reim_system',
        component: () => import('@/pages/reim_system/index.vue'),
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/dashboard'),
      },
      {
        path: 'user',
        name: 'user',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/user'),
      },
      {
        path: 'expense_type',
        name: 'expense_type',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/expense_type'),
      },
      {
        path: 'record',
        name: 'record',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/record'),
      },
      {
        path: 'record_approve',
        name: 'record_approve',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/record_approve'),
      },
      // {
      //   path: 'company',
      //   name: 'company',
      //   meta: {
      //     renderMenu: true,
      //    },
      //   component: () => import('@/pages/company'),
      // },
      {
        path: 'role',
        name: 'role',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/role'),
      },
      {
        path: 'settings',
        name: 'settings',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/settings'),
      },
      {
        path: 'system_settings',
        name: 'system_settings',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/system_settings'),
      },
    ],
  },
  // {
  //   path: '/reim_system/',
  //   name: 'workplace_index',
  //   meta: {
  //     renderMenu: false,
  //   },
  //   component: () => import('@/pages/reim_system/index.vue'),
  // },
  {
    path: '/reim_system/public',
    name: 'public',
    meta: {
      renderMenu: false,
    },
    component: () => import('@/components/layout/BlankView.vue'),
    children: [
      {
        path: 'reim/test',
        name: 'reim_test',
        meta: {
          icon: 'LoginOutlined',
          view: 'blank',
          target: '_blank',
          cacheable: false,
        },
        component: () => import('@/pages/test/index.vue'),
      }
    ]
  },
  {
    path: '/reim_system/account',
    name: 'account',
    meta: {
      renderMenu: false,
    },
    component: () => import('@/components/layout/FrontView.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        meta: {
          icon: 'LoginOutlined',
          view: 'blank',
          target: '_blank',
          cacheable: false,
        },
        component: () => import('@/pages/login/Login.vue'),
      },
      {
        path: 'regist',
        name: 'regist',
        meta: {
          icon: 'RegisterOutlined',
          view: 'blank',
          target: '_blank',
          cacheable: false,
        },
        component: () => import('@/pages/regist'),
      },
      {
        path: 'system_login',
        name: 'system_login',
        meta: {
          renderMenu: false,
          icon: 'LoginOutlined',
          view: 'blank',
          target: '_blank',
          cacheable: false,
        },
        component: () => import('@/pages/system_login'),
      },
    ],
  },
  {
    path: '/403',
    name: '403',
    props: true,
    meta: {
      renderMenu: false,
    },
    component: () => import('@/pages/Exp403.vue'),
  },

  {
    path: '/:pathMatch(.*)*',
    name: '404',
    props: true,
    meta: {
      icon: 'CreditCardOutlined',
      renderMenu: false,
      cacheable: false,
      _is404Page: true,
    },
    component: () => import('@/pages/Exp404.vue'),
  },
];

export default routes;
