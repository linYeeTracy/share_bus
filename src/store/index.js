import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations.js'  // 一些改变store的方法
import actions from './actions.js'      // 一些改变store的方法集合
import * as getters from './getters'    // 对state进行一层封装
import state from './state'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex); // 注册vuex

//初始化时用sessionStore.getItem('token'),这样子刷新页面就无需重新登录
// const state = {
//     token: window.sessionStorage.getItem('token'),
//     username: ''
// };
const debug = process.env.NODE_ENV !== "production"

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    strict: debug ? [createLogger()] : []// 开启vuex严格模式
});