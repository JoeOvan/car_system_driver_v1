<template>
	<view class="wrapper">
		<cu-custom class="navbar" bgColor="bg-white" :isBack="true">
			<block slot="backText">茂南石化工业园区车辆管理平台</block>
		</cu-custom>
		<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<!-- <input @focus="InputFocus" @blur="InputBlur" type="text" placeholder="请输入车牌号码搜索..." confirm-type="search" @confirm="onConfirm"></input> -->
				<input type="text" placeholder="请输入车牌号码搜索..." confirm-type="search" v-model="searchValue" @confirm="onConfirm" @input="onConfirm"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-blue shadow-blur round" @click="onConfirm">搜索</button>
			</view>
		</view>
		
		
		<view class="containter" :style="[{top: contentPaddingTopHeight + 'px'}]">	
				
				
			
			<block v-if="searchList.length >= 1">
				
				
				
				<block v-for="(row,index) in searchList" :key="index">
					
					<block v-if="row.carState !== 5">
						
						<!-- 已完成 -->
						<view class="row carbar custom" v-if="row.workState == 5">
							<view class="car-info">
								<!-- <text class="number">{{row.editPlate.number}}</text> -->
								<text class="plate-number gray">{{row.licensePlate}}</text>
								<text class="mobile">{{row.mobile}}</text>
								<text class="way">{{row.workType == 1 ? "装油" : "卸油"}}</text>
							</view>
							<view class="car-status">
								<view class="btn btn-done">
									已完成
								</view>
							</view>
						</view>
						
						<view class="row carbar custom" v-else-if="row.workState == 4">
						<!-- <view class="row carbar custom"> -->
							<view class="car-info">
								<!-- <text class="number">{{row.editPlate.number}}</text> -->
								<text class="plate-number">{{row.licensePlate}}</text>
								<text class="mobile">{{row.mobile}}</text>
								<text class="way">{{row.workType == 1 ? "装油" : "卸油"}}</text>
							</view>
							<view class="car-status">
								<button class="btn btn-complete" @click.stop="handlerComplete" :data-id="row.id" :data-licensePlate="row.licensePlate">
									完成
								</button>
							</view>
						</view>
						
						<view class="row carbar custom" v-else-if="row.workState == 3">
							<view class="car-info">
								<!-- <text class="number">{{row.editPlate.number}}</text> -->
								<text class="plate-number">{{row.licensePlate}}</text>
								<text class="mobile">{{row.mobile}}</text>
								<text class="way">{{row.workType == 1 ? "装油" : "卸油"}}</text>
							</view>
							<view class="car-status">
								<button type="button" class="btn btn-take-post" @click.stop="showPopupModal($event, row)" data-target="DialogModal1" :data-id="row.sortNum" :disabled="row.isSendInPlace == 1">
									就位
								</button>
							</view>
						</view>
						<view class="row carbar custom" v-else-if="row.workState == 2">
							<view class="car-info">
								<!-- <text class="number">{{row.editPlate.number}}</text> -->
								<text class="plate-number">{{row.licensePlate}}</text>
								<text class="mobile">{{row.mobile}}</text>
								<text class="way">{{row.workType == 1 ? "装油" : "卸油"}}</text>
							</view>
							<view class="car-status">
								<button type="button" class="btn btn-message" @click.stop="showPopupModal($event, row)" data-target="DialogModal1" :data-id="row.sortNum" :disabled="row.isSendInform == 1">
									通知
								</button>
							</view>
						</view>
						<view class="row carbar custom" v-else-if="row.workState == 1">
							<view class="car-info">
								<!-- <text class="number">{{row.editPlate.number}}</text> -->
								<text class="plate-number">{{row.licensePlate}}</text>
								<text class="mobile">{{row.mobile}}</text>
								<text class="way">{{row.workType == 1 ? "装油" : "卸油"}}</text>
							</view>
							<view class="car-status">
								<view class="btn btn-line-up" @click.stop="handlerLineUp" :data-id="row.id" :data-licensePlate="row.licensePlate">
									排队
								</view>
							</view>
						</view>
						
					</block>
					
					<block v-else>
						
						<view class="row carbar custom">
							<view class="car-info">
								<!-- <text class="number">{{row.editPlate.number}}</text> -->
								<text class="plate-number">{{row.licensePlate}}</text>
								<text class="mobile">{{row.mobile}}</text>
								<text class="way">{{row.workType == 1 ? "装油" : "卸油"}}</text>
							</view>
							<view class="car-status">
								<view class="btn btn-no-pass">
									取消
								</view>
							</view>
						</view>
						
					</block>
					
				</block>
				
				
				<!-- 待审核 -->
				<block v-for="(row,index) in searchList" :key="index">
					
					<block v-if="row.carState == 1 || row.carState == 2">
						<view class="row carbar custom">
							<view class="car-info">
								<!-- <text class="number">{{row.editPlate.number}}</text> -->
								<text class="plate-number">{{row.licensePlate}}</text>
								<text class="mobile">{{row.mobile}}</text>
								<text class="way">{{row.workType == 1 ? "装油" : "卸油"}}</text>
							</view>
							<view class="car-status">
								<view class="btn btn-check-pending">
									待审核
								</view>
							</view>
						</view>
					</block>
					
					
					<block v-else-if="row.carState == 4">
						<view class="row carbar custom">
							<view class="car-info">
								<!-- <text class="number">{{row.editPlate.number}}</text> -->
								<text class="plate-number">{{row.licensePlate}}</text>
								<text class="mobile">{{row.mobile}}</text>
								<text class="way">{{row.workType == 1 ? "装油" : "卸油"}}</text>
							</view>
							<view class="car-status">
								<view class="btn btn-no-pass">
									不通过
								</view>
							</view>
						</view>
					</block>
				
				</block>
				
				
				
			</block>
			

			<block v-else>
				
				<view class="custom no-tips">
					
					暂无数据
					
				</view>
				
			</block>


			
		</view>
		
		
		//模态框
		<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
			<view class="cu-dialog popup-modal" v-if="popupModalData">
				<view class="cu-bar bg-white justify-end">
					<view class="content">请选择要进行的操作</view>
					<view class="action" @click="hidePopupModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl popup-content">
		
					<view class="car-info">
						<text class="plate-number">{{popupModalData.licensePlate}}</text>
						<text class="mobile">{{popupModalData.mobile}}</text>
					</view>
		
					<view class="select-status">
						<block v-if="popupModalData.workState == 3">
							<block v-for="(item,index) in ['移除车辆','通知就位']" :key="index"><text
									:class="['item-label', radioIndex == index ? 'active' : '']"
									@click="radioChange(index)">{{item}}</text>
		
							</block>
						</block>
						<block v-if="popupModalData.workState == 2">
							<block v-for="(item,index) in ['移除车辆','通知车辆']" :key="index"><text
									:class="['item-label', radioIndex == index ? 'active' : '']"
									@click="radioChange(index)">{{item}}</text>
		
							</block>
						</block>
					</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @click="hidePopupModal">取消</button>
						<!-- <button class="cu-btn bg-green margin-left" @click="confirmPopupModal">确定</button> -->
						<block v-if="popupModalData.workState == 3">
							
							<button class="cu-btn bg-green margin-left" @click="handlerTakePost">确定</button>
						</block>
						<block v-else-if="popupModalData.workState == 2">
							
							<button class="cu-btn bg-green margin-left" @click="handlerMessage">确定</button>
						</block>
		
					</view>
				</view>
			</view>
		</view>
		
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchValue: '',  //搜索值
				searchList: '',  //搜索结果列表
				orderSn: '',  //工单号
				contentPaddingTopHeight: 0,  //contentPaddingTop高
				
				modalName: null, //模态框
				popupModalData: null,  //引出模态框数据
				
				isParent: true, //是否为主账号
				radioIndex: 1, //radio索引值
				
			};
		},
		onShow() {
			//如果为子账号,则限制操作权限
			if(uni.getStorageSync('isParent')) {
				this.isParent = true;
			} else {
				this.isParent = false;
			}
		},
		onLoad(options) {
			this.orderSn = options.orderSn;
		},
		mounted() {
			this.getContentPaddingTopHeight();	//contentPaddingTop高
		},
		methods: {
			getContentPaddingTopHeight() {
				uni.createSelectorQuery().in(this).select(".search").boundingClientRect(result => {
			
					this.contentPaddingTopHeight = result.height + this.CustomBar;
					
				}).exec();
			},
			async onConfirm() {
				
				const res = await uni.$http.get(uni.$url.searchByPlateUrl,{ solrParam:this.searchValue, orderSn: this.orderSn });
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				uni.showToast({ title: res.data.msg, icon: 'none', duration: 2000 });
				
				let data = res.data.data;
				
				console.log(data);
				
				this.searchList = data;
				
			},
			async handlerComplete(e) {
				
				if(!this.isParent) return uni.showToast({ title: '当前用户没有权限！', icon: 'error', duration: 2000 });
				
				let id = e.currentTarget.dataset.id;
				
				let licensePlate = e.currentTarget.dataset.licenseplate;
				
				// 询问用户是否退出登录
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确定要对车辆 '+ licensePlate +' 执行完成作业操作吗?'
				}).catch(err => err)
				
				if (succ && succ.confirm) {
					// 用户确认了就位的操作
					
					const res = await uni.$http.post(uni.$url.orderCarFinishUrl,{ id });
					
					if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
					
					uni.showToast({ title: res.data.msg, icon: 'success', duration: 2000 });
					
					//1.5秒后重新刷新页面
					setTimeout(() => {
						// location.reload()
						this.onConfirm();
					},1500);
				
				}
				
			
			
			},
			showPopupModal(e, item) {
				
				if(!this.isParent) return uni.showToast({ title: '当前用户没有权限！', icon: 'error', duration: 2000 });
				
				this.modalName = e.currentTarget.dataset.target;
			
				this.popupModalData = item;
			},
			async handlerLineUp(e) {
				
				if(!this.isParent) return uni.showToast({ title: '当前用户没有权限！', icon: 'error', duration: 2000 });
				
				let id = e.currentTarget.dataset.id;
				
				let licensePlate = e.currentTarget.dataset.licenseplate;
				
				// 询问用户是否退出登录
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确定要移除车辆 '+ licensePlate +' 吗?'
				}).catch(err => err)
				
				if (succ && succ.confirm) {
					// 用户确认了就位的操作
					
					const res = await uni.$http.post(uni.$url.orderCarCancelUrl,{ id });
					
					
					if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
					
					uni.showToast({ title: res.data.msg, icon: 'none', duration: 2000 });
					
					
					// location.reload()
					this.$router.go(0)
				
				}
			},
			radioChange(index) {
			
				this.radioIndex = index;
			
			},
			hidePopupModal() {
			
				this.modalName = null;
			
			},
			//就位
			async handlerTakePost(e) {
				console.log("点击了就位按钮!!!!");
			
				this.modalName = null;
			
				console.log(this.radioIndex);
			
				let id = this.popupModalData.id;
				
				
				console.log(id);
				
				
				if(this.radioIndex == 0) {
					//工单车辆取消
					const res = await uni.$http.post(uni.$url.orderCarCancelUrl,{ id });
					
					
					if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
					
					uni.showToast({ title: res.data.msg, icon: 'none', duration: 2000 });
					
					// location.reload();
					this.onConfirm();
					
					
				} else {
					
					//发送就位短信请求
					const res = await uni.$http.post(uni.$url.sendInPlaceSmsUrl,{ id });
					
					
					if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
					
					uni.showToast({ title: res.data.msg, icon: 'none', duration: 2000 });
					
					// location.reload();
					this.onConfirm();
					
				}
			},
			//通知
			async handlerMessage(e) {
				console.log("点击了通知按钮!!!!");
			
				this.modalName = null;
			
				console.log(this.radioIndex);
			
				let id = this.popupModalData.id;
				
				console.log(id);
				
				
				if(this.radioIndex == 0) {
					//工单车辆取消
					const res = await uni.$http.post(uni.$url.orderCarCancelUrl,{ id });
					
					if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
					
					uni.showToast({ title: res.data.msg, icon: 'none', duration: 2000 });
					
					// location.reload();
					this.onConfirm();
					
					
				} else {
					
					//发送通知短信请求
					const res = await uni.$http.post(uni.$url.sendInFormSmsUrl,{ id });
					
					
					if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
					
					// location.reload();
					this.onConfirm();
					
				}
			},
		}
	}
</script>

<style lang="scss">
	
	.navbar {
		position: fixed;
		z-index: 100;
	}
		
	.containter {
		position: absolute;
		width: 100%;
		top: 0;
		z-index: 10;
	}
	
	.custom {
		padding: 36rpx 30rpx 36rpx 25rpx;
		background: #FFFFFF;
		margin-top: 10rpx;
	}
	
	
	.no-tips {
		text-align: center;
		color: #333333;
	}
	
	
	.cu-bar.fixed {
		z-index: 999;
	}
	
	.carbar {
		display: flex;
		justify-content: space-between;
		width: 100%;
	
		// padding: 40rpx 0;
		.car-info {
			.number {
				display: inline-block;
				// width: 50rpx;
				height: 50rpx;
				line-height: 50rpx;
				margin-right: 20rpx;
				padding: 0 20rpx;
				background: #EFEFEF;
				border-radius: 25rpx;
				font-size: 34rpx;
				font-weight: 400;
				color: #333333;
				text-align: center;
			}
	
			.plate-number {
				height: 50rpx;
				line-height: 50rpx;
				padding: 6rpx 12rpx;
				margin-right: 15rpx;
				background: #FFC600;
				border-radius: 10rpx;
				font-size: 34rpx;
				font-weight: bold;
				color: #000000;
	
				&.gray {
					background: #DDDDDD;
				}
			}
	
			.mobile {
				font-size: 30rpx;
				font-weight: 400;
				color: #000000;
			}
	
			.way {
				margin-left: 20rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #999999;
			}
		}
	
		.car-status {
			width: 110rpx;
			text-align: center;
	
			.btn {
				line-height: 50rpx;
			}
	
			button:disabled {
				height: 50rpx;
				background: #DDDDDD;
				border: 2rpx solid #AAAAAA;
				border-radius: 10rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #888888;
			}
	
			button[disabled] {
				height: 50rpx;
				background: #DDDDDD;
				border: 2rpx solid #AAAAAA;
				border-radius: 10rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #888888;
			}
	
			.icon-edit {
				display: inline-block;
				width: 30rpx;
				height: 30rpx;
			}
	
			.btn-done {
				font-size: 30rpx;
				font-weight: 400;
				color: #999999;
			}
	
			.btn-complete {
				height: 50rpx;
				padding: 0 21rpx;
				background: #00A82B;
				border: 2rpx solid #008021;
				border-radius: 10rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #FFFFFF;
			}
	
			.btn-take-post {
				height: 50rpx;
				padding: 0 21rpx;
				background: #FFFFFF;
				border: 2rpx solid #666666;
				border-radius: 10rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #000000;
			}
	
			.btn-message {
				height: 50rpx;
				padding: 0 21rpx;
				background: #FFFFFF;
				border: 2rpx solid #666666;
				border-radius: 10rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #000000;
			}
	
			.btn-line-up {
				height: 50rpx;
				padding: 0 21rpx;
				background: #FFFFFF;
				border: 2rpx solid #666666;
				border-radius: 10rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #000000;
			}
	
			.btn-check-pending {
				font-size: 30rpx;
				font-weight: 400;
				color: #FFC600;
			}
			
			.btn-no-pass {
				font-size: 30rpx;
				font-weight: 400;
				color: #DDDDDD;
			}
		}
	}

	//弹出完成、移除模态框
	.popup-modal {
		.popup-content {
			.car-info {
				margin-bottom: 40rpx;
			}

			.plate-number {
				height: 50rpx;
				line-height: 50rpx;
				padding: 6rpx 12rpx;
				margin-right: 15rpx;
				background: #FFC600;
				border-radius: 10rpx;
				font-size: 34rpx;
				font-weight: bold;
				color: #000000;

			}

			.item-label {
				display: inline-block;
				height: 100rpx;
				line-height: 100rpx;
				padding: 0 40rpx;
				margin: 0 20rpx;
				background: #F8F8F8;
				border: 2rpx solid #DDDDDD;
				border-radius: 10rpx;
				font-size: 40rpx;
				font-weight: 400;
				color: #999999;

				&.active {
					font-size: 40rpx;
					font-weight: 400;
					color: #ffffff;
					background: #409eff;
					border: 1rpx solid #409eff;
				}
			}

		}
	}


</style>
