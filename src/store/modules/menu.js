export const menuMock = {
  success: true,
  message: '查询成功',
  code: 200,
  result: {
    allAuth: [
      {
        action: 'online:goGenerateCode',
        describe: '代码生成按钮',
        type: '1',
        status: '1'
      },
      {
        action: 'user:form:phone',
        describe: '手机号禁用',
        type: '2',
        status: '1'
      },
      {
        action: 'user:add',
        describe: '添加用户按钮',
        type: '1',
        status: '1'
      }
    ],
    auth: [
      {
        action: 'user:add',
        describe: '添加用户按钮',
        type: '1'
      },
      {
        action: 'user:form:phone',
        describe: '手机号禁用',
        type: '2'
      },
      {
        action: 'online:goGenerateCode',
        describe: '代码生成按钮',
        type: '1'
      }
    ],
    menu: [
      {
        redirect: null,
        path: '/eleManage/index',
        component: 'layouts/RouteView',
        route: '1',
        children: [
          {
            path: '/eleManage/index',
            component: 'eleManage/index',
            route: '1',
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '电子资源管理'
            },
            name: 'eleManage-index',
            id: '12612132135004528626466123'
          }
        ],
        meta: {
          keepAlive: false,
          internalOrExternal: false,
          icon: 'home',
          title: '电子资源管理'
        },
        name: '',
        id: '9502685863ab87f0ad1134142788a385'
      },
      {
        redirect: null,
        path: '/objectConfig',
        component: 'layouts/RouteView',
        route: '1',
        children: [
          {
            path: '/objectConfig/scenceManage/index',
            component: 'objectConfig/scenceManage/index',
            route: '1',
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '场景管理'
            },
            name: 'scenceManage-index',
            id: '12612132135004528626'
          },
          {
            path: '/objectConfig/cardManage/index',
            component: 'objectConfig/cardManage/index',
            route: '1',
            hidden: true,
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '基础知识'
            },
            name: 'cardManage-index',
            id: '12619932135004528116'
          },

          {
            path: '/objectConfig/cardManage/cardRank',
            component: 'objectConfig/cardManage/cardRank',
            route: '1',
            hidden: true,
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '知识卡条目'
            },
            name: 'cardManage-cardRank',
            id: '12619932135004857486'
          },
          {
            path: '/objectConfig/specialScence/index',
            component: 'objectConfig/specialScence/index',
            route: '1',
            hidden: true,
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '特殊情景'
            },
            name: 'specialScence-index',
            id: '12619932135004528999'
          },
          {
            path: '/objectConfig/monitor/index',
            component: 'objectConfig/monitor/index',
            route: '1',
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '测项管理'
            },
            name: 'monitor-index',
            id: '1261213213500452862623'
          },
          {
            path: '/objectConfig/equip/index',
            component: 'objectConfig/equip/index',
            route: '1',
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '仪器库管理'
            },
            name: 'equip-index',
            id: '126121321350045286262345'
          },
          {
            path: '/objectConfig/scenceManage/sourceList',
            component: 'objectConfig/scenceManage/sourceList',
            route: '1',
            hidden: true,
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '资源列表'
            },
            name: 'scenceManage-sourceList',
            id: '126121321350045286262345654'
          },
          {
            path: '/objectConfig/monitor/cePoint',
            component: 'objectConfig/monitor/cePoint',
            route: '1',
            hidden: true,
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '测点'
            },
            name: 'monitor-cePoint',
            id: '12612132135004528625654'
          },
          {
            path: '/objectConfig/monitor/ceMethod',
            component: 'objectConfig/monitor/ceMethod',
            route: '1',
            hidden: true,
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '监测方法'
            },
            name: 'monitor-ceMethod',
            id: '12612132112435004528625654'
          },
          {
            path: '/objectConfig/monitor/process',
            component: 'objectConfig/monitor/process',
            route: '1',
            hidden: true,
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '活动配置'
            },
            name: 'monitor-process',
            id: '1261213211243500452862565435'
          },
          {
            path: '/objectConfig/equip/parts',
            component: 'objectConfig/equip/parts',
            route: '1',
            hidden: true,
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '配件列表'
            },
            name: 'equip-parts',
            id: '1261213212311243500452862565435'
          },
          {
            path: '/objectConfig/equip/params',
            component: 'objectConfig/equip/params',
            route: '1',
            hidden: true,
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '参数配置'
            },
            name: 'equip-params',
            id: '12612132143500452862565435'
          },
          {
            path: '/workManage/swagger',
            component: 'workManage/swagger',
            route: '1',
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '接口文档'
            },
            name: 'workManage-swagger',
            id: '12643132842004566626'
          }
        ],
        meta: {
          keepAlive: false,
          internalOrExternal: false,
          icon: 'hdd',
          title: '仿真对象配置'
        },
        name: 'objectManage',
        id: '9502685863ab87f0ad1134142788a385'
      },
      {
        redirect: null,
        path: '/baseData',
        component: 'layouts/RouteView',
        route: '1',
        children: [
          {
            path: '/baseData/teacher/index',
            component: 'baseData/teacher/index',
            route: '1',
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '教师管理'
            },
            name: 'teacher-index',
            id: '12613212135004528626'
          }
        ],
        meta: {
          keepAlive: false,
          internalOrExternal: false,
          icon: 'bar-chart',
          title: '基础数据管理'
        },
        name: 'baseData',
        id: '95123121863ab87f0ad1134142788a385'
      },
      {
        redirect: null,
        path: '/account',
        component: 'layouts/RouteView',
        route: '1',
        hidden: true,
        children: [
          {
            path: '/account/center',
            component: 'account/center/Index',
            route: '1',
            meta: {
              keepAlive: false,
              internalOrExternal: false,
              title: '个人中心'
            },
            name: 'account-center',
            id: 'd86f58e7ab516d3bc6bfb1fe10585f97'
          }
        ],
        meta: {
          keepAlive: false,
          internalOrExternal: false,
          icon: 'user',
          title: '个人页'
        },
        name: 'account',
        id: '717f6bee46f44a3897eca9abd6e2ec44'
      }
    ]
  },
  timestamp: 1624946593208
}
