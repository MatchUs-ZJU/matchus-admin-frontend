export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
    hideInMenu: true,
  },
  {
    path: '/admin',
    name: 'admin',
    access: 'canAdmin',
    flatMenu: true,
    routes: [
      {
        path: '/admin/data',
        name: '数据看板',
        icon: 'dashboard',
        component: './DataAnalysis',
      },
      {
        path: '/admin/users',
        name: '用户管理',
        icon: 'user',
        component: './UserAdmin',
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
