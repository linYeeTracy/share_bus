import axios from 'axios'
import store from 'src/store/index.js'
import router from 'src/router'

//设置全局axios默认值
axios.defaults.timeout = 5000; //5000的超时验证
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

//创建一个axios实例
const instance = axios.create();
instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

axios.interceptors.request.use = instance.interceptors.request.use;

//request拦截器
instance.interceptors.request.use(
    config => {
        //每次发送请求之前检测都vuex存有token,那么都要放在请求头发送给服务器
        if(store.state.token){
            config.headers.Authorization = `token ${store.state.token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);
//respone拦截器
instance.interceptors.response.use(
    response => {
        return response;
    },
    error => { //默认除了2XX之外的都是错误的，就会走这里
        if(error.response){
            switch(error.response.status){
                case 401:
                    store.dispatch('UserLogout'); //可能是token过期，清除它
                    router.replace({ //跳转到登录页面
                        path: 'login',
                        query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
                    });
            }
        }
        return Promise.reject(error.response);
    }
);

export default {
    //用户注册
    userRegister(data){
        return instance.post('/api/register', data);
    },
    //用户登录
    userLogin(data){
        return instance.post('haoyangtx.xyz:8888/test/', data); 
    },
    //获取用户
    getUser(){
        return instance.get('/api/user');
    },
    //删除用户
    delUser(data){
        return instance.post('/api/delUser', data);
    },
    /**
     * --------------------班线定制模块------------------------------
     */

    /**
     * 获取已拥有班线列表
     */
    getBusLine(data) {
        return instance.get('../../static/linetable.json', data);
    },
    /**
     * 删除企业所选班线
     */
    delBusLine(data) {
        return instance.delete('../../static/linetable.json', data);
    },
    /**
     * 提交企业所选班线
     */
    addBusLine(data) {
        return instance.post('/api/addBusline', data);
    },
    /**
     * --------------------充值中心-------------------
     */
    getRechargeRocord(data) {
        return instance.get('/api/getRechargeRocord', data);
    },
}   