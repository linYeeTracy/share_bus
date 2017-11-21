import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        }, {
            path: '/index',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
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
        },
    ]
})
