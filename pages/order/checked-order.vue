<template>
	<view class="wrapper">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="backText">茂南石化工业园区车辆管理平台</block>
		</cu-custom>
		
		<view class="calendar-wrap">
			<!-- <image class="icon-add-order" @click="addCarHandler" src="../../static/images/icon-add-car.png"></image> -->
			<text class="date">{{data.workDate}}&nbsp;工单</text>
		</view>
		
		<!-- <view class="order-list-wrap" :style="{'padding-bottom':orderListPaddingBottom +'px'}"> -->
		<view class="order-list-wrap" :style="'padding-bottom:'+addListBottom+'px'">
			<block v-if="data">
				<!-- 已审核 -->
				<block v-if="data.orderState == 1">
				<!-- <block v-if="data.orderState == 3"> -->
					<block v-for="(item,index) in data.carList" :key="index">
						<block v-if="!item.editPlate.isEdit">					
							<view class="order-list">
								<view class="order-info">
									<text class="number">{{item.editPlate.number}}</text>
									<text class="plate-number">{{item.licensePlate}}</text>
									<text class="mobile">{{item.mobile}}</text>
									<text class="way">{{item.workType == 1 ? "装油" : "卸油"}}</text>
								</view>
								<block v-if="item.carState == 2">
									<view class="order-handler">
										<image class="icon-edit" src="../../static/images/icon-edit.png" @click="handlerEdit" :data-id="item.editPlate.number"></image>
									</view>
								</block>
							</view>
						</block>
						
						<block v-else>					
							<view class="order-list-edit">
								<view class="order-info-wrap">
									<text class="number">{{item.editPlate.number}}</text>
									<view class="order-info">
										<view class="plate-number">
											<!-- 车牌号码按键 -->
											<input class="plate" placeholder="请点此输入车牌号码..." disabled="item.inputDisabled" @tap="item.editPlate.plateShow = true" v-model.trim="item.licensePlate" />
											<plate-input v-if="item.editPlate.plateShow" :plate="item.licensePlate" @export="setPlate($event,index)" @close="item.editPlate.plateShow = false" />
										</view>
										<view class="number-wrap">
											<input type="number" class="input-mobile" placeholder="司机手机号码"
												v-model.trim="item.mobile">
											<picker class="way" @change="bindPickerChange" :data-index="index"
												:value="item.editPlate.way.index" :range="item.editPlate.way.array">
												<view class="uni-input">{{item.editPlate.way.array[item.editPlate.way.index]}}
												</view>
												<image class="icon-arrow-down"
													src="../../static/images/icon-arrow-down-gray.png"></image>
											</picker>
										</view>
										<view class="goods-wrap">
											<input type="text" class="input-goods" placeholder="请输入运输物品名称" v-model.trim="item.workTypeInfo">
										</view>
									</view>
								</view>
								<view class="order-handler">
									<image class="icon icon-submit" @click="handlerSubmit" :data-id="item.editPlate.number" src="../../static/images/icon-submit.png"></image>
									<image class="icon icon-delete" @click="handlerDelete" :data-id="item.editPlate.number" src="../../static/images/icon-delete.png"></image>
								</view>
							</view>
						</block>
						
					</block>
					
					<block v-if="addIconIsShow">						
						<view class="add-car-wrap" @click="addCarHandler">
							<image class="icon-add-car" src="../../static/images/icon-add-car.png"></image>
							<text class="text">增加作业车辆</text>
						</view>
					</block>
					
					
				</block>
				
				<block v-else>
					
					<block v-for="(item,index) in data.carList" :key="index">

						<view class="order-list">
							<view class="order-info">
								<text class="number">{{item.editPlate.number}}</text>
								<text class="plate-number">{{item.licensePlate}}</text>
								<text class="mobile">{{item.mobile}}</text>
								<text class="way">{{item.workType == 1 ? "装油" : "卸油"}}</text>
							</view>
							<view class="order-handler">
								<!-- <image class="icon-edit" src="../../static/images/icon-edit.png" @click="handlerEdit" :data-id="item.sortNum"></image> -->
							</view>
						</view>
						
					</block>
					
				</block>
				
				
			</block>

			
			
		</view>
		
		
		<!-- 作业最大值 -->
		<view class="check-wrap" v-if="data.orderState == 1">
			<view class="max-wrap">
				<text class="text">作业最大值</text>
				<input type="number" class="max" v-model.trim="maxCapacity">
			</view>
			<view class="handler-wrap">
				<!-- <button class="btn btn-save" :disabled="!isSubmit" v-if="data.carList.length >= 1 && !addIconIsShow" @click="saveCarOrder(1)">保存</button> -->
				<button class="btn btn-check" :disabled="!isSubmit" @click="saveCarOrder">提交审核</button>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import plateInput from '@/components/uni-plate-input/uni-plate-input.vue';
	import jutils from 'jutils-src'
	export default {
		components: {
			plateInput
		},
		data() {
			return {
				data: {},
				// list: [],
				// workDate: '',  //工单日期
				maxCapacity: 3, //作业最大值（默认为3）
				
				//车牌号码
				// carNumber: '',
				orderListPaddingBottom: 0, //工单列表底部填充 模拟键盘
				addListBottom: 0, //工单列表底部填充
				
				addIconIsShow: true,
				
				isSubmit: true, //防止短时间内重复提交
			}
		},
		onLoad(options) {
			let orderSn = options.orderSn;

			if(orderSn == "add") {
				
				this.createCarOrder();
				
				
			} else if (orderSn !== null && orderSn !== "") {
				
				this.carOrderList(options.orderSn);
			}
			
			
		},
		mounted() {
			this.checkWrapHeight();
		},
		updated() {
			
		},
		methods: {
			//创建工单
			createCarOrder() {
				
				
				//根据当前时间获取明天日期
				let tDate = new Date();
				// date.setDate(date.getDate() + 1);
				tDate.setDate(tDate.getDate() + 1);
				let tY = tDate.getFullYear() + '-';
				let tM = (tDate.getMonth()+1 < 10 ? '0'+(tDate.getMonth()+1) : tDate.getMonth()+1)+ '-';
				let tD = (tDate.getDate() < 10 ? '0'+(tDate.getDate()) : tDate.getDate());
				
				let workDate = tY + tM + tD;
				
				// console.log(workDate);

				
				let setTime = uni.getStorageSync('tomorrowSetTime')
				let cacheTime = uni.getStorageSync('tomorrowCacheTime');
				
				if(cacheTime && setTime) {
					//判断当天时间是否超过缓存时间
					if (new Date().getTime() - setTime > cacheTime) {
						uni.removeStorageSync('tomorrowPlateList');
						uni.removeStorageSync('tomorrowSetTime');
						uni.removeStorageSync('tomorrowCacheTime');
					}
				}
				
				
				let data = {
				  "carList": uni.getStorageSync('tomorrowPlateList') || [],
				  "maxCapacity": this.maxCapacity,
				  "workDate": workDate,
				  "orderState": 1
				}
			
				
				this.data = data;
				
				
				
			},
			async carOrderList(orderSn) {
				
				//根据工单号查询工单车辆列表请求
				let res = await uni.$http.get(uni.$url.queryCarListByOrderSnUrl, { orderSn });
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				uni.showToast({ title: res.data.msg, icon: 'none', duration: 2000 });
				
				let data = res.data.data;
				
				//截取工单日期
				let str = data.workDate;
				let strDate = str.trim().split(" ")
				data.workDate = strDate[0];
				
				
				//根据当前时间获取日期
				let date = new Date();
				date.setDate(date.getDate() + 1);
				// date.setDate(date.getDate());
				let Y = date.getFullYear() + '-';
				let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
				let D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
				let lastDate = Y + M + D;
				//是明天天显示addIcon按钮
				this.addIconIsShow = data.workDate !== lastDate;
				
				console.log(data.workDate,lastDate);
				
				data.carList.forEach((item,index)=> {
					
					// item.isEdit = false;
					item.editPlate = {
						'number': index + 1,
						'isEdit': false,
						'plateShow': false,
					}

				});
				
				console.log(data);
				
				this.data = data;
				
				
			},
			addCarHandler() {
				console.log("增加作业车辆");
				
				let number = this.data.carList.length +1;
					
				let item = {
					"carState": 2,
					"id": '',
					"licensePlate": "",
					"mobile": "",
					"workType": 1,
					"workState": '',
					"workTypeInfo": '',
					"editPlate": {
						"number": number,
						"isEdit": true,
						"workState": 0,
						"plateShow": false,
						"inputDisabled": true,
						"way": {
							"index": 0,
							"array": ['装油', '卸油']
						}
					}
				}
				
				
				this.data.carList.push(item);
				
			},
			handlerEdit(e) {
				console.log("编辑工单");
				console.log(e.currentTarget.dataset.id);
				let id = e.currentTarget.dataset.id;
				this.data.carList.forEach((item,index)=> {
					if(item.editPlate.number == id) {
						item.editPlate.isEdit = true;
					}
				});
				
			},
			orderListFixed(e) {
				// console.log(e);
				
				this.orderListPaddingBottom = 238;
			
				
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
			
				// let index = e.currentTarget.dataset.index - 1
				let index = e.currentTarget.dataset.index
			
				console.log(index, this.data.carList[index])
			
				this.data.carList[index]['editPlate']['way']['index'] = e.target.value
			
				console.log(this.data.carList[index]['editPlate']['way']['index'], this.data.carList);
				
				
				if(e.target.value == 0) {					
					this.data.carList[index]['workType'] = 1
				} else if (e.target.value == 1) {
					this.data.carList[index]['workType'] = 2
				}
				
			
			},
			handlerSubmit(e) {
				console.log("提交工单");
				// console.log(e.currentTarget.dataset.id);
				
				// uni.removeStorageSync('plateList')
				
				let id = e.currentTarget.dataset.id;
				
				this.data.carList.forEach((item, index) => {
					// console.log(item)
					if (item.editPlate.number == id) {
						
						//车牌号码、手机号码不能为空
						if(!item.licensePlate || item.licensePlate == '') return uni.showToast({title:'车牌号码不能为空!', icon: 'none', duration: 2000});
						if(!item.mobile || item.mobile == '') return uni.showToast({title:'手机号码不能为空!', icon: 'none', duration: 2000});
						let regex = new RegExp(/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/);
						
						if (!regex.test(item.mobile)) return uni.showToast({ title: '请填写正确的手机号码', icon: 'none', duration: 2000 });
						
						//运输物品名称不能为空
						if(!item.workTypeInfo || item.workTypeInfo == '') return uni.showToast({title:'运输物品名称不能为空!', icon: 'none', duration: 2000});
						
						
						//对验证成功数据进行存储操作
						item.editPlate.isEdit = false;
			
					}
				});
				
				
				uni.removeStorageSync('tomorrowPlateList');
				
				//获取今天结束时间
				let tomorrowDate = new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000 -1);
				//当前时间到结束时间差
				let date = tomorrowDate - new Date();
				
				//设置缓存时间及当前时间戳
				uni.setStorageSync('tomorrowSetTime', new Date().getTime())
				uni.setStorageSync('tomorrowCacheTime', date);
				
				uni.setStorageSync('tomorrowPlateList', this.data.carList);
							
				console.log(uni.getStorageSync('tomorrowPlateList'));
				
				
			},
			async handlerDelete(e) {
				console.log("删除工单");
				console.log(e.currentTarget.dataset.id);
				let id = e.currentTarget.dataset.id;
			
			
				// 询问用户是否删除
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确认删除吗？'
				}).catch(err => err)
			
				if (succ && succ.confirm) {
					// 用户确认了删除的操作
			
					//删除对应工单
					this.data.carList.splice(this.data.carList.findIndex(item => item.editPlate.number === id), 1);
			
					//重新排序
					this.data.carList.forEach((item, index) => {
						item.editPlate.number = index + 1;
					});
					
					uni.removeStorageSync('tomorrowPlateList');
					
					//获取今天结束时间
					let tomorrowDate = new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000 -1);
					//当前时间到结束时间差
					let date = tomorrowDate - new Date();
					
					//设置缓存时间及当前时间戳
					uni.setStorageSync('tomorrowSetTime', new Date().getTime())
					uni.setStorageSync('tomorrowCacheTime', date);
					
					
					uni.setStorageSync('tomorrowPlateList', this.data.carList);
				}
			
			
			},
			checkWrapHeight() {
				uni.createSelectorQuery().in(this).select(".check-wrap").boundingClientRect(result => {
					
					if (result && result.height > 0) {
						// this.swiperHeight = result.height;
						this.addListBottom = result.height;	
					}
						
				}).exec();
			},
			setPlate(plate,index) {
				
				if (plate.length >= 7) this.data.carList[index]['licensePlate'] = plate;
				this.data.carList[index]['editPlate']['plateShow'] = false;
			},
			//保存工单
			async saveCarOrder() {
				console.log("保存工单");
				
				
				if(!this.data.carList || this.data.carList.length < 1) return uni.showToast({ title: '没有新增数据！', icon: 'none', duration: 2000 });
				
				if(!this.maxCapacity || this.maxCapacity == '') return uni.showToast({ title: '没有设置最大作业值！', icon: 'none', duration: 2000 });
				
				
				let flag = true;
				
				for (let i = 0; i < this.data.carList.length; i++) { 
					
					if(this.data.carList[i].editPlate.isEdit) {
						
						let title = '没有勾选第'+ (i + 1) +'条新增数据！';
						
						uni.showToast({ title: title, icon: 'none', duration: 2000 });
						
						flag = false;
						
						break
					}
				    
				 }
				 
				 if(!flag) return;
				 
				 
				 let setTime = uni.getStorageSync('tomorrowSetTime');
				 
				 var setDate = jutils.formatDate(new Date(setTime),"YYYY-MM-DD");
				 var currentDate = jutils.formatDate(new Date(new Date().getTime()),"YYYY-MM-DD");
				 
				 //判断当天时间是否超过缓存时间
				 if (setTime && (setDate !== currentDate)) {
				 		uni.removeStorageSync('tomorrowPlateList');
				 		uni.removeStorageSync('tomorrowSetTime');
				 		uni.removeStorageSync('tomorrowCacheTime');
				 	
				 	//获取新增工单数据
				 	this.data.carList = uni.getStorageSync('tomorrowPlateList') || [];
				 	
				 	return uni.showToast({ title: '数据已过期,请提交当天数据!', icon: 'none', duration: 2000 });
				 }
				 
			
				
				// //获取时间 时间为明天的时间
				let date = new Date();
				date.setDate(date.getDate() + 1);
				// date.setDate(date.getDate());
				let Y = date.getFullYear() + '-';
				let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
				let D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
				
				
				let workDate = Y+M+D;
				
				
				let query = {
				  "carList": this.data.carList,
				  "maxCapacity": this.maxCapacity,
				  "workDate": workDate
				}
				
				
				// 询问用户是否提交审核
				const [err, succ] = await uni.showModal({
					title: '是否确认提交审核',
					content: '提交后如果工单处于待审核时，不能再添加车辆，是否确认提交？'
				}).catch(err => err)
				
				//确认则提交
				if (succ && !succ.confirm) return;
				
				
				//防止短时间内重复提交
				if(!this.isSubmit) return;
				
				this.isSubmit = false;
				
				//发起保存工单请求
				let res = await uni.$http.post(uni.$url.saveWorkOrderUrl, query);
				
				//防止短时间内重复提交
				//1.5秒后取消button禁用
				setTimeout(() => {
					this.isSubmit = true;
				},1500);
				
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				uni.showToast({ title: res.data.msg, icon: 'success', duration: 1500 });
				
				uni.removeStorageSync('tomorrowPlateList');
				
				//1.5秒后重新刷新页面
				setTimeout(() => {
					// uni.navigateTo({
					// 	url: '/pages/order/checked-order?orderSn='+res.data.data
					// })
					uni.switchTab({
						url: '/pages/order/order'
					})
					
				},1500);
				
			},
		}
	}
</script>

<style lang="scss">
	//头部日历
	.calendar-wrap {
		position: sticky;
		top: 45px;
		height: 80rpx;
		border-top: 1px solid #f1f1f1;
		background: #ffffff;
		z-index: 115;
		text-align: center;
		font-size: 34rpx;
		font-weight: 400;
		color: #000000;
		.date {
			line-height: 80rpx;
		}
		.icon-add-order {
			display: inline-block;
			position: absolute;
			top: 30rpx;
			left: 30rpx;
			width: 32rpx;
			height: 32rpx;
		}
	}
	
	
	.order-list-wrap {
		//已添加的列表
		.order-list {
			display: flex;
			width: 100%;
			padding: 50rpx 40rpx 50rpx 20rpx;
			margin-top: 10rpx;
			background: #FFFFFF;
			justify-content: space-between;
			align-items: center;
			.order-info {
				.number {
					display: inline-block;
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
					display: inline-block;
					height: 50rpx;
					line-height: 50rpx;
					padding: 2rpx 12rpx 0 12rpx;
					margin-right: 15rpx;
					background: #FFC600;
					border-radius: 10rpx;
					font-size: 34rpx;
					font-weight: bold;
					color: #000000;
					vertical-align: middle;
					
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
		
			.order-handler {
				width: 110rpx;
				text-align: right;
				.icon-edit {
					display: inline-block;
					width: 30rpx;
					height: 30rpx;
				}
			}
		}
		
		//编辑中的列表
		.order-list-edit {
			display: flex;
			width: 100%;
			padding: 25rpx 40rpx 25rpx 20rpx;
			margin-top: 10rpx;
			background: #FFFFFF;
			justify-content: space-between;
			align-items: center;
			.order-info-wrap {
				display: flex;
				align-items: center;
				.number {
					display: inline-block;
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
				.order-info {
					.plate-number {
						margin-bottom: 20rpx;
						.plate {
							width: 405rpx;
							height: 60rpx;
							line-height: 60rpx;
							padding: 0 23rpx;
							background: #FFFFFF;
							border: 2rpx solid #999999;
							border-radius: 10rpx;
							font-size: 34rpx;
							font-weight: 400;
							color: #000000;
							vertical-align: middle;
						}
					}
					
					
					.number-wrap {
						display: flex;
					
						.input-mobile {
							display: flex;
							width: 265rpx;
							height: 60rpx;
							line-height: 60rpx;
							padding: 8rpx 23rpx 0 23rpx;
							background: #FFFFFF;
							border: 2rpx solid #999999;
							border-radius: 10rpx;
							font-size: 34rpx;
							font-weight: 400;
							color: #000000;
							vertical-align: middle;
							align-items: center;
					
							&:hover {
								border: 2rpx solid #FFC600;
							}
						}
					
						.way {
							width: 130rpx;
							height: 60rpx;
							padding: 0 20rpx;
							line-height: 60rpx;
							margin-left: 10rpx;
							background: #FFFFFF;
							border: 2rpx solid #999999;
							border-radius: 10rpx;
							box-sizing: border-box;
					
							.icon-arrow-down {
								display: inline-block;
								width: 18rpx;
								height: 10rpx;
								position: absolute;
								right: 20rpx;
								top: 25rpx;
							}
						}
					}
					.goods-wrap {
						margin-top: 20rpx;
						.input-goods {
							display: flex;
							width: 405rpx;
							height: 60rpx;
							line-height: 60rpx;
							padding: 0 23rpx;
							background: #FFFFFF;
							border: 2rpx solid #999999;
							border-radius: 10rpx;
							font-size: 34rpx;
							font-weight: 400;
							color: #000000;
							vertical-align: middle;
							align-items: center;
							
							&:hover {
								border: 2rpx solid #FFC600;
							}
						}
					}
				}
			}
			.order-handler {
				display: flex;
				.icon {
					display: inline-block;
					width: 60rpx;
					height: 60rpx;
					margin-left: 20px;
					background: #E4E4E4;
					border-radius: 50%;
				}
				.icon-submit {
					
				}
				.icon-delete {
					
				}
			}
		}
		
		//增加作业车辆
		.add-car-wrap {
			height: 80rpx;
			line-height: 80rpx;
			margin-top: 10rpx;;
			font-size: 34rpx;
			font-weight: 400;
			color: #666666;
			text-align: center;
			background: #ffffff;
			.icon-add-car {
				display: inline-block;
				width: 24rpx;
				height: 24rpx;
				margin-right: 10rpx;
			}
			.text {
				
			}
		}
	}
	
	//提交审核
	.check-wrap {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 100%;
		height: 110rpx;
		padding: 0 20rpx 0 30rpx;
		background: #FFFFFF;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.2);
		z-index: 100;
		.max-wrap {
			.text {
				font-size: 30rpx;
				font-weight: 400;
				color: #333333;
			}
			.max {
				display: inline-block;
				width: 50rpx;
				height: 50rpx;
				background: #FFFFFF;
				border: 2rpx solid #999999;
				border-radius: 10rpx;
				font-size: 34rpx;
				font-weight: 400;
				color: #000000;
				vertical-align: middle;
				text-align: center;
				margin-left: 10rpx;
			}
		}
		.handler-wrap {
			.btn {
				display: inline-block;
				height: 60rpx;
				line-height: 60rpx;
				margin-left: 20rpx;
				vertical-align: middle;
				&::after {
					border: none;
				}
			}
			.btn-save {
				background: #FFFFFF;
				border: 2rpx solid #AAAAAA;
				border-radius: 10rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #333333;
				&[disabled] {
					background: #000000;
					opacity: 0.2
				}
			}
			.btn-check {
				background: #00A82B;
				border: 2rpx solid #008021;
				border-radius: 10rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #FFFFFF;
				&[disabled] {
					background: #000000;
					opacity: 0.2
				}
			}
		}
	}
	
</style>
