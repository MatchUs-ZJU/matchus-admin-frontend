export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: './Welcome',
    hideInMenu: true,
  },
  {
    path: '/admin',
    name: 'admin',
    flatMenu: true,
    routes: [
      {
        name: '用户管理',
        icon: 'user',
        routes: [
          {
            path: '/admin/general',
            name: '用户概览',
            component: './UserGeneral',
          },
          {
            path: '/admin/register',
            name: '注册信息',
            component: './RegisterAdmin',
          },
          {
            path: '/admin/person',
            name: '个人信息',
            component: './PersonAdmin',
          },
          {
            path: '/admin/activity',
            name: '活动信息',
            component: './ActivityAdmin',
          },
        ]
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
