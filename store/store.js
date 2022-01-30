// 1. 导入 Vue 和 Vuex
import Vue from 'vue'
import Vuex from 'vuex'
import Logger from 'vuex/dist/logger'
const debug = process.env.NODE_ENV !== 'production'  // 开发环境中为true，否则为false 

// 导入用户的 vuex 模块
import moduleTabbar from './tabbar.js'
import moduleUser from './user.js'

// 2. 将 Vuex 安装为 Vue 的插件
Vue.use(Vuex)

// 3. 创建 Store 的实例对象
const store = new Vuex.Store({
  // TODO：挂载 store 模块
  modules: {
	// 挂载用户的 vuex 模块，访问路径为 m_user
	m_user: moduleUser,
  },
  strict: debug,
  plugins: debug ? [Logger()] : []  // 开发环境下显示vuex的状态修改
})



// 4. 向外共享 Store 的实例对象
export default store