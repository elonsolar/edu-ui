// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'
/* eslint-disable */ 
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/market/visitor',
    children: [
      // 运营
     {
      path: '/market',
      name: 'market',
      redirect: '/market/visitor',
      component: RouteView,
      meta: { title: 'menu.market', keepAlive: true, icon: 'bulb', permission: ['customer'] },
      children: [
        {
          path: '/market/visitor',
          name: 'visitor',
          component: RouteView,
          component: () => import('@/views/product/sku/List'),
          meta: { title: 'menu.market.visitor', keepAlive: true, permission: ['customer'] },
        },
        {
          path: '/download/feedback',
          name: 'feedback',
          component: RouteView,
          component: () => import('@/views/product/sku/List'),
          meta: { title: 'menu.market.feedback', keepAlive: true, permission: ['customer'] },
        }
      ]
    },
      // // dashboard
      // {
      //   path: '/dashboard',
      //   name: 'dashboard',
      //   redirect: '/dashboard/analysis',
      //   component: RouteView,
      //   meta: { title: 'menu.dashboard', keepAlive: true, icon: bxAnaalyse, permission: ['dashboard'] },
      //   children: [
      //     {
      //       path: '/dashboard/analysis/:pageNo([1-9]\\d*)?',
      //       name: 'Analysis',
      //       component: () => import('@/views/dashboard/Analysis'),
      //       meta: { title: 'menu.dashboard.analysis', keepAlive: false, permission: ['dashboard'] }
      //     },
      //     {
      //       path: '/dashboard/workplace',
      //       name: 'Workplace',
      //       component: () => import('@/views/dashboard/Workplace'),
      //       meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: ['dashboard'] }
      //     }
      //   ]
      // },
      // 校区档案
      {
        path: '/dossier',
        name: 'dossier',
        redirect: '/dossier/teacher',
        component: RouteView,
        meta: { title: 'menu.dossier', keepAlive: true, icon: 'file', permission: ['dossier'] },
        children: [
          {
            path: '/dossier/teacher',
            name: 'teacher',
            component: () => import('@/views/teacher/List'),
            meta: { title: 'menu.teacher.list', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/dossier/room',
            name: 'room',
            component: () => import('@/views/room/List'),
            meta: { title: 'menu.room.list', keepAlive: true, permission: ['room'] }
          },
          {
            path: '/dossier/subject',
            name: 'subject',
            component: () => import('@/views/subject/List'),
            meta: { title: 'menu.subject.list', keepAlive: true, permission: ['subject'] }
          }
        ]
      },
       // 会员
       {
        path: '/customer',
        name: 'customer',
        redirect: '/customer/customer',
        component: RouteView,
        meta: { title: 'menu.customer', keepAlive: true, icon: 'user', permission: ['customer'] },
        children: [
          {
            path: '/customer/customer',
            name: 'customer',
            component: () => import('@/views/customer/List'),
            meta: { title: 'menu.customer.list', keepAlive: true, permission: ['vip'] }
          },
          {
            path: '/customer/student',
            name: 'student',
            component: () => import('@/views/student/List'),
            meta: { title: 'menu.student.list', keepAlive: true, permission: ['student'] }
          }
        ]
      },
      
      // 课程
      {
        path: '/course',
        name: 'course',
        redirect: '/course/coursePlan',
        component: RouteView,
        meta: { title: 'menu.course', keepAlive: true, icon: 'laptop', permission: ['course'] },
        children: [
          {
            path: '/course/coursePlan',
            name: 'coursePlan',
            component: () => import('@/views/coursePlan/List'),
            meta: { title: 'menu.course.coursePlan', keepAlive: true, permission: ['coursePlan'] }
          },
          {
            path: '/course/coursePlanDetail',
            name: 'coursePlanDetail',
            component: () => import('@/views/coursePlanDetail/List'),
            meta: { title: 'menu.course.coursePlanDetail', keepAlive: true, permission: ['planCourse'] }
          },
          {
            path: '/course/dailyLesson',
            name: 'dailyLesson',
            component: () => import('@/views/dailyLesson/List'),
            meta: { title: 'menu.course.dailyLesson', keepAlive: true, permission: ['dailyLesson'] }
          }
        ]
      },
       // 商品管理
       {
        path: '/product',
        name: 'product',
        redirect: '/product/sku',
        component: RouteView,
        meta: { title: 'menu.product', keepAlive: true, icon: 'gold', permission: ['customer'] },
        children: [
          {
            path: '/product/sku',
            name: 'sku',
            component: () => import('@/views/product/sku/List'),
            meta: { title: 'menu.product.sku', keepAlive: true, permission: ['customer'] },
          },
          // {
          //   path: '/product/combine',
          //   name: 'combineSku',
          //   component: () => import('@/views/product/combine/List'),
          //   meta: { title: 'menu.product.combineSku', keepAlive: true, permission: ['customer'] },
          // },
          {
            path: '/product/combine',
            name: 'combineSku',
            component: () => import('@/views/product/combine/List'),
            meta: { title: 'menu.product.combineSku', keepAlive: true, permission: ['customer'] },
          }
          
        ]
      },
       // 销售
       {
        path: '/saleCenter',
        name: 'saleCenter',
        redirect: '/saleCenter/order',
        component: RouteView,
        meta: { title: 'menu.saleCenter', keepAlive: true, icon: 'shop', permission: ['customer'] },
        children: [
          {
            path: '/saleCenter/saleOrder',
            name: 'saleOrder',
            component: RouteView,
            component: () => import('@/views/saleCenter/saleOrder/List'),
            meta: { title: 'menu.saleCenter.saleOrder', keepAlive: true, permission: ['customer'] },
          },
          {
            path: '/saleCenter/picking',
            name: 'picking',
            component: RouteView,
            component: () => import('@/views/saleCenter/picking/List'),
            meta: { title: 'menu.saleCenter.picking', keepAlive: true, permission: ['customer'] },
          }
        ]
      },
      {
      path: '/purchaseCenter',
      name: 'purchaseCenter',
      redirect: '/purchaseCenter/purchaseOrder',
      component: RouteView,
      meta: { title: 'menu.purchaseCenter', keepAlive: true, icon: 'carry-out', permission: ['customer'] },
      children: [
        {
          path: '/purchaseCenter/purchaseOrder',
          name: 'purchaseOrder',
          component: RouteView,
          component: () => import('@/views/product/sku/List'),
          meta: { title: 'menu.purchaseCenter.purchaseOrder', keepAlive: true, permission: ['customer'] },
        }
      ]
    },
     
    {
      path: '/download',
      name: 'download',
      redirect: '/download/report',
      component: RouteView,
      meta: { title: 'menu.download', keepAlive: true, icon: 'cloud-download', permission: ['customer'] },
      children: [
        {
          path: '/download/template',
          name: 'template',
          component: RouteView,
          component: () => import('@/views/product/sku/List'),
          meta: { title: 'menu.download.template', keepAlive: true, permission: ['customer'] },
        },
        {
          path: '/download/report',
          name: 'report',
          component: RouteView,
          component: () => import('@/views/product/sku/List'),
          meta: { title: 'menu.download.report', keepAlive: true, permission: ['customer'] },
        }
      ]
    },
   
      // 助手
      {
        path: '/assistant',
        name: 'assistant',
        redirect: '/assistant/task',
        component: RouteView,
        meta: { title: 'menu.assistant', keepAlive: true, icon: 'calendar', permission: ['assistant'] },
        children: [
          {
            path: '/assistant/task',
            name: 'task',
            component: () => import('@/views/task/List'),
            meta: { title: 'menu.task.list', keepAlive: true, permission: ['task'] }
          }
        ]
      },
      // account
      // {
      //   path: '/account',
      //   component: RouteView,
      //   redirect: '/account/center',
      //   name: 'account',
      //   meta: { title: 'menu.account', icon: 'user', keepAlive: true, permission: ['user'] },
      //   children: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: () => import('@/views/account/center'),
      //       meta: { title: 'menu.account.center', keepAlive: true, permission: ['user'] }
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: () => import('@/views/account/settings/Index'),
      //       meta: { title: 'menu.account.settings', hideHeader: true, permission: ['user'] },
      //       redirect: '/account/settings/basic',
      //       hideChildrenInMenu: true,
      //       children: [
      //         {
      //           path: '/account/settings/basic',
      //           name: 'BasicSettings',
      //           component: () => import('@/views/account/settings/BasicSetting'),
      //           meta: { title: 'account.settings.menuMap.basic', hidden: true, permission: ['user'] }
      //         },
      //         {
      //           path: '/account/settings/security',
      //           name: 'SecuritySettings',
      //           component: () => import('@/views/account/settings/Security'),
      //           meta: {
      //             title: 'account.settings.menuMap.security',
      //             hidden: true,
      //             keepAlive: true,
      //             permission: ['user']
      //           }
      //         },
      //         {
      //           path: '/account/settings/custom',
      //           name: 'CustomSettings',
      //           component: () => import('@/views/account/settings/Custom'),
      //           meta: { title: 'account.settings.menuMap.custom', hidden: true, keepAlive: true, permission: ['user'] }
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           name: 'BindingSettings',
      //           component: () => import('@/views/account/settings/Binding'),
      //           meta: { title: 'account.settings.menuMap.binding', hidden: true, keepAlive: true, permission: ['user'] }
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           name: 'NotificationSettings',
      //           component: () => import('@/views/account/settings/Notification'),
      //           meta: {
      //             title: 'account.settings.menuMap.notification',
      //             hidden: true,
      //             keepAlive: true,
      //             permission: ['user']
      //           }
      //         }
      //       ]
      //     }
      //   ]
      // },
      {

        path: '/setting',
        name: 'otherPage',
        // component: PageView,
         component: RouteView,
        meta: { title: '系统设置', icon: 'slack', permission: [ 'setting' ] },
        redirect: '/setting/user-list',
        children: [
              {
                path: '/setting/tenant-list',
                name: 'TenantList',
                component: () => import('@/views/setting/tenant/List'),
                meta: { title: '租户列表', keepAlive: true,permission: ['tenant']}
              },
              {
                path: '/setting/user-list',
                name: 'UserList',
                component: () => import('@/views/setting/user/List'),
                meta: { title: '用户列表', keepAlive: true,permission: ['user']}
              },
              {
                path: '/setting/role-list',
                name: 'RoleList',
                component: () => import('@/views/setting/role/List'),
                meta: { title: '角色列表', keepAlive: true, permission: ['role'] }
              },
              {
                path: '/setting/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/setting/permission/List'),
                meta: { title: '权限列表', keepAlive: true ,permission: ['permission']}
              }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
