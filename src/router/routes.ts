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
    path: '/workspace',
    name: 'workspace',
    meta: {
      renderMenu: false,
    },
    // component: () => import('@/components/layout/FrontView.vue'),
    children: [
      {
        path: 'report',
        name: 'report',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/report'),
      },
      {
        path: 'template',
        name: 'template',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/template'),
      },
      {
        path: 'category',
        name: 'category',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/category'),
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
        path: 'company',
        name: 'company',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/company'),
      },
      {
        path: 'factory',
        name: 'factory',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/factory'),
      },
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
    ],
  },
  {
    path: '/public',
    name: 'public',
    meta: {
      renderMenu: false,
    },
    component: () => import('@/components/layout/BlankView.vue'),
    children: [
      {
        path: '/public/report/:reportId',
        name: 'public_report',
        meta: {
          icon: 'LoginOutlined',
          view: 'blank',
          target: '_blank',
          cacheable: false,
        },
        component: () => import('@/pages/public_report/index.vue'),
      },
    ]
  },
  {
    path: '/account',
    name: 'account',
    meta: {
      renderMenu: false,
    },
    component: () => import('@/components/layout/FrontView.vue'),
    children: [
      {
        path: '/account/login',
        name: 'login',
        meta: {
          icon: 'LoginOutlined',
          view: 'blank',
          target: '_blank',
          cacheable: false,
        },
        component: () => import('@/pages/login'),
      },
      {
        path: '/account/regist',
        name: 'regist',
        meta: {
          icon: 'RegisterOutlined',
          view: 'blank',
          target: '_blank',
          cacheable: false,
        },
        component: () => import('@/pages/regist'),
      }
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
