import Vue from 'vue'
import App from './App'
//导入 store 的实例对象
import store from './store/tabbar.js'
// import store from './store/store.js'
// import {mapMutations} from 'vuex'
import cuCustom from './colorui/components/cu-custom.vue'
import API_URL from './util/api.js'
// import API_URL from './util/api.js'

// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'

// Vue.prototype.$url = API_URL
uni.$url = API_URL

Vue.component('cu-custom',cuCustom)


uni.$http = $http

Vue.prototype.$store = store

// 请求的根路径
// $http.baseUrl = 'https://www.uinav.com'

// 请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...'
  })

  // // 判断当前请求的是否为有权限的接口
  // if (options.url.indexOf('/') !== -1) {
  //   options.header = {
  //     'X-Nideshop-Token': store.state.m_user.token
  //   }
  // }
  // 判断当前请求的是否为有权限的接口
  if (options.url.indexOf('/') !== -1) {
	  
	if(options.url.indexOf('/companyLogin') !== -1) {
		return
	}
	//修改工单车辆已完成请求头
	if(options.url.indexOf('/workOrder/orderCarFinish') !== -1) {
		
		options.header = {
		  'Content-Type': 'application/x-www-form-urlencoded',
		  'Authorization': uni.getStorageSync('token') || ''
		}
		
		return
	}
	//修改工单车辆取消请求头
	if(options.url.indexOf('/workOrder/orderCarCancel') !== -1) {
		
		options.header = {
		  'Content-Type': 'application/x-www-form-urlencoded',
		  'Authorization': uni.getStorageSync('token') || ''
		}
		
		return
	}
	// 修改工单车辆发送就位短信请求头
	if(options.url.indexOf('/workOrder/sendInPlaceSms') !== -1) {
		
		options.header = {
		  'Content-Type': 'application/x-www-form-urlencoded',
		  'Authorization': uni.getStorageSync('token') || ''
		}
		
		return
	}
	// 修改工单车辆发送通知短信请求头
	if(options.url.indexOf('/workOrder/sendInFormSms') !== -1) {
		
		options.header = {
		  'Content-Type': 'application/x-www-form-urlencoded',
		  'Authorization': uni.getStorageSync('token') || ''
		}
		
		return
	}
	// 根据车牌号码查询车辆列表
	if(options.url.indexOf('/company/indexOrderSolr') !== -1) {
		
		options.header = {
		  'Content-Type': 'application/x-www-form-urlencoded',
		  'Authorization': uni.getStorageSync('token') || ''
		}
		
		return
	}
	// // 根据年月查询工单列表
	// if(options.url.indexOf('/workOrder/queryListByYearMonth') !== -1) {
		
	// 	options.header = {
	// 	  'Content-Type': 'application/x-www-form-urlencoded',
	// 	  'Authorization': uni.getStorageSync('token') || ''
	// 	}
		
	// 	return
	// }
	
    options.header = {
      'Authorization': uni.getStorageSync('token') || ''
    }
  }
 
  
}

// 响应拦截器
$http.afterRequest = function(res) {
  uni.hideLoading()
  
  // const code = res.statusCode.toString();
  // if(code.startsWith('2')) {

  	let code = res.data.code;
  	if(code == 401) {
		// store.state.m_user.token = '';
		// store.state.m_user.userinfo = {};
		
		// 询问用户是否登录
		uni.showModal({
			title: '提示',
			content: '请先登录吗？',
			success: function (res) {
				if (res.confirm) {
					
					// uni.clearStorageSync();
					uni.removeStorageSync("token");
					
					console.log('用户点击确定');
					// 用户确认了登录的操作
					uni.navigateTo({
						url: `/pages/index/index`,
						// success: res => {
						// 	// console.log(res)
						// },fail: (result) => {
						// 	// console.log(result)
						// },complete: (a) => {
						// 	// console.log(a)
						// }
					});

				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
  	}

	if(code == 201) {
		return uni.$showMsg(res.data.msg);
	}
	
	if(code == 403) {
		return uni.$showMsg(res.data.msg);
	}
	
	if(code == 404) {
		return uni.$showMsg(res.data.msg);
	}

}

// 封装弹框的方法
uni.$showMsg = function(title = '数据请求失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
