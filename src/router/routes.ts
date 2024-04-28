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
    path: '/report_system/workplace',
    name: 'workplace',
    meta: {
      renderMenu: false,
    },
    // component: () => import('@/components/layout/FrontView.vue'),
    children: [
      {
        path: '',
        name: 'report_system',
        component: () => import('@/pages/report_system/index.vue'),
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/dashboard'),
      },
      {
        path: 'report',
        name: 'report',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/report'),
      },
      {
        path: 'my_report',
        name: 'my_report',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/my_report'),
      },
      {
        path: 'template',
        name: 'template',
        meta: {
          renderMenu: true,
         },
        // component: () => import('@/pages/template'),
        children: [
          {
            path: 'templates',
            name: 'templates',
            component: () => import('@/pages/template'),
          },
          {
            path: 'design',
            name: 'design',
            meta: {
              renderMenu: false,
             },
            component: () => import('@/pages/designer'),
          },
        ],
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
      // {
      //   path: 'company_contact',
      //   name: 'company_contact',
      //   meta: {
      //     renderMenu: true,
      //    },
      //   component: () => import('@/pages/company_contact'),
      // },
      // {
      //   path: 'factory',
      //   name: 'factory',
      //   meta: {
      //     renderMenu: true,
      //    },
      //   component: () => import('@/pages/factory'),
      // },
      // {
      //   path: 'factory_contact',
      //   name: 'factory_contact',
      //   meta: {
      //     renderMenu: true,
      //    },
      //   component: () => import('@/pages/factory_contact'),
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
      {
        path: 'defect',
        name: 'defect',
        meta: {
          renderMenu: true,
         },
        component: () => import('@/pages/defect'),
      }
    ],
  },
  // {
  //   path: '/report_system/',
  //   name: 'workplace_index',
  //   meta: {
  //     renderMenu: false,
  //   },
  //   component: () => import('@/pages/report_system/index.vue'),
  // },
  {
    path: '/report_system/public',
    name: 'public',
    meta: {
      renderMenu: false,
    },
    component: () => import('@/components/layout/BlankView.vue'),
    children: [
      {
        path: 'report/fill/:reportId',
        name: 'report_fill',
        meta: {
          icon: 'LoginOutlined',
          view: 'blank',
          target: '_blank',
          cacheable: false,
        },
        component: () => import('@/pages/report_fill/index.vue'),
      },
      {
        path: 'report/review/:reportId',
        name: 'report_review',
        meta: {
          icon: 'LoginOutlined',
          view: 'blank',
          target: '_blank',
          cacheable: false,
        },
        component: () => import('@/pages/report_review/index.vue'),
      },
      {
        path: 'report/test',
        name: 'report_test',
        meta: {
          icon: 'LoginOutlined',
          view: 'blank',
          target: '_blank',
          cacheable: false,
        },
        component: () => import('@/pages/test/index.vue'),
      },
    ]
  },
  {
    path: '/report_system/account',
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
          icon: 'RegisterOutlined',
          view: 'blank',
          target: '_blank',
          cacheable: false,
        },
        component: () => import('@/pages/system_login'),
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
