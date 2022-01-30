<template>
	<view class="wrapper">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="backText">茂南石化工业园区车辆管理平台</block>
		</cu-custom>
		
		<block v-if="token">
			<view class="company-info">
				<view class="logo-wrap">
					<image class="logo" :src="avatarImg"></image>
				</view>
				<view class="info-wrap">
					<view class="company-name">
						<text class="name">{{deptName}}</text>
					</view>
					<view class="work-info">
						<view class="item-info">
							<text class="label">作业时间：</text>
							<text class="text">{{beginWorkTime}}</text>
						</view>
						<view class="item-info">
							<text class="label">作业时长：</text>
							<text class="text">{{workTime}}</text>
						</view>
						<view class="item-info">
							<text class="label">作业最大值：</text>
							<text class="text">{{maxCapacity}}</text>
						</view>
					</view>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="company-info">
				<image class="logo" src="../../static/images/company-logo.png"></image>
				<button class="cu-btn bg-red margin-tb-sm lg btn-login" @click="getUserProfile">登录</button>
			</view>
		</block>

		
		<view class="list-wrap">
			<navigator class="item-wrap" url="/pages/mine/record">
				<view class="left">
					<image class="icon-record" src="../../static/images/icon-record.png"></image>
					<text class="text">作业记录</text>
				</view>
				<view class="right">
					<image class="icon-arrow" src="../../static/images/icon-arrow.png"></image>
				</view>
			</navigator>
			<navigator class="item-wrap" url="/pages/mine/access-apply">
				<view class="left">
					<image class="icon-car" src="../../static/images/icon-car.png"></image>
					<text class="text">非危运车临时出入申请</text>
				</view>
				<view class="right">
					<image class="icon-arrow" src="../../static/images/icon-arrow.png"></image>
				</view>
			</navigator>
		</view>
		
		
		<!-- 退出登陆 -->
		<view class="btn-logout" v-if="token" @click="logout">
			<view class="text">退出账号</view>
		</view>
		<!-- 退出登陆 end-->
		
		
		<!-- tabbar导航栏 -->
		<page-tabpars name="tabbar"></page-tabpars>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		data() {
			return {
				token: '',
				avatarImg:"",
				deptName:"",
				beginWorkTime: '',
				workTime: '',
				maxCapacity: 0,
			}
		},
		created () {
		  const active = 'mine'
		  if (this.active !== active) {
		    this.SET_ACTIVE(active)
		  }
		},
		onShow() {	
			
			this.indexInfo();
		},
		computed: {
		  ...mapGetters(['active']),
		},
		methods: {
			...mapMutations(['SET_ACTIVE']),
			getUserProfile(){
				uni.navigateTo({
					url: `/pages/index/index`
				});
			},
			async indexInfo(){
				
				
				this.token = uni.getStorageSync('token');
			
				if (this.token == null || this.token == "") return uni.navigateTo({url: '/pages/index/index'});
				
				const indexResult = await uni.$http.get(uni.$url.getIndexInfo);
				
				if (indexResult.data.code !== 200) return uni.$showMsg(indexResult.data.msg);
				
				let data = indexResult.data.data;
				
				this.avatarImg = data.avatarImg;
				this.deptName = data.deptName;
				this.beginWorkTime = data.beginWorkTime.split(" ")[1];
				this.workTime = data.workTime.split(" ")[1];
				this.maxCapacity = data.maxCapacity;
			},
			// 退出登录
			async logout() {
			  // 询问用户是否退出登录
			  const [err, succ] = await uni.showModal({
			    title: '提示',
			    content: '确认退出登录吗？'
			  }).catch(err => err)
			
			  if (succ && succ.confirm) {
			     // 用户确认了退出登录的操作
			     // 需要清空token
				 
				 const res = await uni.$http.get(uni.$url.logoutUrl);
				 
				 if (res.data.code !== 200) uni.$showMsg(res.data.msg);
				 
				 uni.showToast({ title: res.data.msg, icon: 'none', duration: 1500 });
				 
			     uni.removeStorageSync('token');
				 
				 //重置tabbar初始值
				 this.SET_ACTIVE('car');
				 
				 setTimeout(()=> {					 
					 uni.navigateTo({
						url: `/pages/index/index`
					 });
				 },1500);
			  }
			}
		}
	}
</script>

<style lang="scss">
	.company-info {
		display: flex;
		padding: 50rpx 30rpx;
		align-items: center;
		margin-bottom: 50rpx;
		background: #FFFFFF;
		border-top: 1rpx solid #f1f1f1;
		.logo {
			display: inline-block;
			width: 100rpx;
			height: 100rpx;
			margin-right: 20rpx;
			border-radius: 50%;
		}
		.company-name {
			.name {
				font-size: 30rpx;
				font-weight: 400;
				color: #000000;
			}
		}
		.work-info {
			.item-info {
				display: inline-block;
				margin-right: 20rpx;
				margin-top: 30rpx;
				.label {
					font-size: 24rpx;
					font-weight: 400;
					color: #888888;
				}
				.text {
					
				}
			}
		}
		.btn-login {
			color: #FFFFFF;
			background: #409eff;
		}
	}
	.list-wrap {
		.item-wrap {
			display: flex;
			height: 100rpx;
			line-height: 100rpx;
			margin-bottom: 10rpx;
			padding: 0 30rpx;
			background: #FFFFFF;
			justify-content: space-between;
			background: #FFFFFF;
			.left {
				.icon-record {
					display: inline-block;
					width: 24rpx;
					height: 25rpx;
					margin-right: 15rpx;
				}
				.icon-car {
					display: inline-block;
					width: 32rpx;
					height: 17rpx;
					margin-right: 15rpx;
				}
				.text {
					
				}
			}
			.right {
				.icon-arrow {
					display: inline-block;
					width: 17rpx;
					height: 28rpx;
				}
			}
		}
	}
	
	
	//退出按钮
	.btn-logout {
		font-size: 28rpx;
		font-weight: 400;
		color: #888888;
		width: 670rpx;
		height: 80rpx;
		line-height: 80rpx;
		margin: 40rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		text-align: center;
	}
	
</style>
