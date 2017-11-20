import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/index.js';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        }, {
            path: '/index',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                {
                    path: '/viewBusLine',
                    component: resolve => require(['../components/page/ViewBusLine.vue'], resolve)
                },
                {
                    path: '/customBusLine',
                    component: resolve => require(['../components/page/CustomBusLine.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/busRoute',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve)
                },
                {
                    path: '/staffManage',
                    component: resolve => require(['../components/page/staffManage.vue'], resolve)    // Vue-Quill-Editor组件
                },
                {
                    path: '/chargeRecord',
                    component: resolve => require(['../components/page/chargeRecord.vue'], resolve)     // Vue-Quill-Editor组件
                },
                // {
                //     path: '/upload',
                //     component: resolve => require(['../components/page/Upload.vue'], resolve)       // Vue-Core-Image-Upload组件
                // },
                // {
                //     path: '/basecharts',
                //     component: resolve => require(['../components/page/BaseCharts.vue'], resolve)   // vue-schart组件
                // },
                // {
                //     path: '/drag',
                //     component: resolve => require(['../components/page/DragList.vue'], resolve)    // 拖拽列表组件
                // }
            ]
        }, {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },{
            path: '/register',
            component: resolve => require(['../components/page/Register.vue'], resolve) 
        },
    ]
})

//注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
    //获取store里面的token
    let token = store.state.token;
    //判断要去的路由有没有requiresAuth
    if(to.meta.requiresAuth){
  
      if(token){
        next();
      }else{
        next({
          path: '/login',
          query: { redirect: to.fullPath }  // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
        });
      }
  
    }else{
      next();//如果无需token,那么随它去吧
    }
});

export default router;