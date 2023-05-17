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
        path: 'user',
        routes: [
          {
            path: 'general',
            name: '用户概览',
            component: './UserGeneral',
          },
          {
            path: 'register',
            name: '注册信息',
            component: './RegisterAdmin',
          },
          {
            path: 'person',
            name: '个人信息',
            component: './PersonAdmin',
          },
        ],
      },
      {
        path: 'activity',
        name: '活动管理',
        icon: 'ControlOutlined',
        routes: [
          {
            path: 'activity',
            name: '活动信息',
            component: './ActivityAdmin',
          },
          {
            path: 'activitycreation',
            name: '活动创建',
            component: './ActivityCreation',
          },
        ],
      },
      {
        path: 'setting',
        name: '其他',
        icon: 'SettingOutlined',
        routes: [
          {
            path: 'homeoperation',
            name: '首页运营',
            component: './HomeOperation',
          },
          {
            path: 'help',
            name: '帮助页',
            component: './Help',
          },
          {
            path: 'maintain',
            name: '维护',
            component: './Maintain',
          },
        ],
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
