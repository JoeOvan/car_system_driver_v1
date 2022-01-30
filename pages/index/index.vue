<template>
	<view class="wrapper">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="backText">茂南石化工业园区车辆管理平台</block>
		</cu-custom>
		
		<view class="content" :style="{'padding-top':contentTop+'px'}">
			<image class="bg-login" src="../../static/images/bg-login.png" mode="aspectFill" :style="{'top':contentTop}"></image>
			<view class="login-wrap">
				<image class="logo" src="../../static/images/logo.png"></image>
				<view class="input-item">
					<input type="text" class="input input-phone" placeholder="请输入账号" :value="mobile" @input="inputMobileChange">
				</view>
				<view class="input-item input-item-auth">
					<input type="password" class="input input-auth-code" :value="authCode" @input="inputAuthCodeChange" placeholder="请输入密码" />
				</view>
				<button class="btn-login" type="default" @click="login">登&nbsp;&nbsp;录</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				contentTop: this.CustomBar + 'px',
				mobile: '',
				authCode: '',
				countDownNum: 60,
			}
		},
		onLoad() {
			
			let token = uni.getStorageSync('token');
			
			if(token) return uni.switchTab({ url:'/pages/car/car' });
			
		},
		methods: {
			inputMobileChange(e){
				this.mobile = e.detail.value
			},
			inputAuthCodeChange(e){
				this.authCode = e.detail.value
			},
			async login() {
				
				if(!this.mobile || this.mobile == '') return uni.showToast({title:'账号不能为空!', icon: 'none', duration: 2000});
				if(!this.authCode || this.authCode == '') return uni.showToast({title:'密码不能为空!', icon: 'none', duration: 2000});
				
				let query = {
					username: this.mobile,
					password: this.authCode
				};
				
				const loginResult = await uni.$http.post(uni.$url.loginUrl, query)
				
				if (loginResult.data.code !== 200) return uni.$showMsg(loginResult.data.msg)
				
				uni.showToast({ title: loginResult.data.msg, icon: 'success', duration: 1500 });
				
				uni.setStorageSync('token', "CompanyBearer " + loginResult.data.data.token);
				
				//判断是否为子账号
				if(loginResult.data.data.isParent) {
					uni.setStorageSync('isParent', true);
				} else {
					uni.setStorageSync('isParent', false);
				}
				
				
				setTimeout(() => {					
					uni.switchTab({
						url:'/pages/car/car'
					})
				},1500)
			}
		}
	}
</script>

<style lang="scss">
	
	page {
		background-color: #efefef;
	}
	
	.cuIcon-back:before {
	    content: "";
	}
	
	.content {
		display: flex;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		justify-content: center;
		align-items: center;
	}
	
	.bg-login {
		position: absolute;
		top: 0;
		right: 0;
	}
	
	.login-wrap {
		position: absolute;
		// top: 10%;
		left: 0;
		// bottom: 10%;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.logo {
			display: inline-block;
			width: 526rpx;
			height: 94rpx;
			margin-bottom: 80rpx;
		}
		.input-item {
			margin-bottom: 30rpx;
			input {
				padding: 0 20rpx;
			}
			.input-phone {
				width: 400rpx;
				height: 66rpx;
				background: #FFFFFF;
				border-radius: 6rpx;
				font-size: 30rpx;
			}
			.input-auth-code {
				display: inline-block;
				// width: 220rpx;
				width: 400rpx;
				height: 66rpx;
				background: #FFFFFF;
				border-radius: 6rpx;
				font-size: 30rpx;
			}
		}
		.input-item-auth {
			display: flex;
			.btn-auth-code {
				display: flex;
				width: 160rpx;
				height: 66rpx;
				margin-left: 20rpx;
				background: #9CB6C2;
				border-radius: 6rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #FFFFFF;
				justify-content: center;
				align-items: center;
			}
		}
		.btn-login {
			display: inline-block;
			margin-top: 20rpx;
			width: 400rpx;
			height: 66rpx;
			line-height: 66rpx;
			background: #46C4FF;
			border-radius: 6rpx;
			font-size: 34rpx;
			font-weight: bold;
			color: #FFFFFF;
		}
	}
	

</style>
