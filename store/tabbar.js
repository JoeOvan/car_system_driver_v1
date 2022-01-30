import Vuex from 'vuex'
import Vue from 'vue'
import Logger from 'vuex/dist/logger'
const debug = process.env.NODE_ENV !== 'production'

const state = {
  active: 'car',
  animate: 'zoomIn',
  tabbars: [
    {
		name: 'car',
		text: '车辆',
		icon: '/static/images/car.png',
		iconActive: '/static/images/car-active.png',
		path: '/pages/car/car'
    },
    {
		name: 'order',
		text: '工单',
		icon: '/static/images/order.png',
		iconActive: '/static/images/order-active.png',
		path: '/pages/order/order'
    },
    {
		name: 'mine',
		text: '我的',
		icon: '/static/images/mine.png',
		iconActive: '/static/images/mine-active.png',
		path: '/pages/mine/mine'
    }
  ]
}

const getters = {
  active: state => state.active,
  animate: state => state.animate,
  tabbars: state => state.tabbars
}

console.log(getters);

const mutations = {
  SET_ACTIVE (state, data) {
    state.active = data
  },
  SET_TABBARS (state, data) {
    state.tabbars = data
  }
}

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  strict: debug,
  plugins: debug ? [Logger()] : []
})

export default store
