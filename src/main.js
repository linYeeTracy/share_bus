import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import BaiduMap from 'vue-baidu-map';
import lodash from 'lodash';

import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";

console.log(axios)
Vue.use(ElementUI);
Vue.use(BaiduMap, {   // 引入百度地图
    ak: 'WB3qq0MsfpF51nZNa296By4IXfkr71z6'
})

Vue.prototype.$axios = axios;
Vue.prototype.$lodash = lodash;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');