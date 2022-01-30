<template>
	<view class="wrapper">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="backText">茂南石化工业园区车辆管理平台</block>
		</cu-custom>
		
		<view class="calendar-wrap">
			<text class="date">2021-9-16&nbsp;工单</text>
		</view>
		
		<!-- <view class="order-list-wrap" :style="{'padding-bottom':orderListPaddingBottom +'px'}"> -->
		<view class="order-list-wrap" :style="'padding-bottom:'+addListBottom+'px'">
			<!-- 已添加列表 -->
			<block v-for="(item,index) in list" :key="index">				
				<block v-if="!item.isEdit">					
					<view class="order-list">
						<view class="order-info">
							<text class="number">{{item.number}}</text>
							<text class="plate-number">{{item.editPlate.plateNo}}</text>
							<text class="mobile">{{item.mobile}}</text>
							<text class="way">{{item.way.array[item.way.index]}}</text>
						</view>
						<view class="order-handler">
							<image class="icon-edit" src="../../static/images/icon-edit.png" @click="handlerEdit" :data-id="item.number"></image>
						</view>
					</view>
				</block>
				
				<block v-else>					
					<view class="order-list-edit">
						<view class="order-info-wrap">
							<text class="number">{{item.number}}</text>
							<view class="order-info">
								<view class="plate-number">
									<!-- 车牌号码按键 -->
									<input class="plate" placeholder="请点此输入车牌号码..." disabled="item.inputDisabled" @tap="item.editPlate.plateShow = true" v-model.trim="item.editPlate.plateNo" />
									<plate-input v-if="item.editPlate.plateShow" :plate="item.editPlate.plateNo" @export="setPlate($event,index)" @close="item.editPlate.plateShow = false" />
								</view>
								<view class="number-wrap">
									<input type="number" class="input-mobile" placeholder="司机手机号码" v-model.trim="item.mobile">
									<picker class="way" @change="bindPickerChange" :data-index="item.number" :value="item.way.index" :range="item.way.array">
										<view class="uni-input">{{item.way.array[item.way.index]}}</view>
										<image class="icon-arrow-down" src="../../static/images/icon-arrow-down-gray.png"></image>
									</picker>
								</view>
							</view>
						</view>
						<view class="order-handler">
							<image class="icon icon-submit" @click="handlerSubmit" :data-id="item.number" src="../../static/images/icon-submit.png"></image>
							<image class="icon icon-delete" @click="handlerDelete" :data-id="item.number" src="../../static/images/icon-delete.png"></image>
						</view>
					</view>
				</block>
				
			</block>
			
			<view class="add-car-wrap" @click="addCarHandler">
				<image class="icon-add-car" src="../../static/images/icon-add-car.png"></image>
				<text class="text">增加作业车辆</text>
			</view>
			
		</view>
		
		<view class="check-wrap">
			<view class="max-wrap">
				<text class="text">作业最大值</text>
				<input type="number" class="max" value="3">
			</view>
			<view class="handler-wrap">
				<button class="btn btn-save">保存</button>
				<button class="btn btn-check">提交审核</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	import plateInput from '@/components/uni-plate-input/uni-plate-input.vue';
	export default {
		components: {
			plateInput
		},
		data() {
			return {
				list: [{
						"number": 1,
						"plateNumber": "粤K0661S",
						"mobile": "13800138000",
						"status": "已完成",
						"isEdit": false,
						"editPlate": {
							id: 1,
							plateNo: '粤K0661S',
							plateShow: false,
							inputDisabled: true
						},
						"way": {
							index: 0,
							array: ['装油', '卸油'],
						}
					},
					{
						"number": 2,
						"plateNumber": "粤K0662S",
						"mobile": "13800138000",
						"status": "已完成",
						"isEdit": false,
						"editPlate": {
							id: 2,
							plateNo: '粤K0662S',
							plateShow: false,
							inputDisabled: true
						},
						"way": {
							index: 0,
							array: ['装油', '卸油'],
						}
					},
					{
						"number": 3,
						"plateNumber": "粤K0663S",
						"mobile": "13800138000",
						"status": "已完成",
						"isEdit": false,
						"editPlate": {
							id: 3,
							plateNo: '粤K0663S',
							plateShow: false,
							inputDisabled: true
						},
						"way": {
							index: 0,
							array: ['装油', '卸油'],
						}
					},
					{
						"number": 4,
						"plateNumber": "粤K0664S",
						"mobile": "13800138000",
						"status": "已完成",
						"isEdit": false,
						"editPlate": {
							id: 4,
							plateNo: '粤K0664S',
							plateShow: false,
							inputDisabled: true
						},
						"way": {
							index: 0,
							array: ['装油', '卸油'],
						}
					},
					{
						"number": 5,
						"plateNumber": "粤K0665S",
						"mobile": "13800138000",
						"status": "已完成",
						"isEdit": false,
						"editPlate": {
							id: 5,
							plateNo: '粤K0665S',
							plateShow: false,
							inputDisabled: true
						},
						"way": {
							index: 0,
							array: ['装油', '卸油'],
						}
					},
					{
						"number": 6,
						"plateNumber": "粤K0666S",
						"mobile": "13800138000",
						"status": "已完成",
						"isEdit": false,
						"editPlate": {
							id: 6,
							plateNo: '粤K0666S',
							plateShow: false,
							inputDisabled: true
						},
						"way": {
							index: 0,
							array: ['装油', '卸油'],
						}
					},
				],
				
				
				//车牌号码
				// carNumber: '',
				orderListPaddingBottom: 0, //工单列表底部填充 模拟键盘
				addListBottom: 0, //工单列表底部填充
				
				index: 0,
				array: ['装油', '卸油'],
			}
		},
		mounted() {
			this.checkWrapHeight();
		},
		methods: {
			handlerEdit(e) {
				console.log("编辑工单");
				console.log(e.currentTarget.dataset.id);
				let id = e.currentTarget.dataset.id;
				this.list.forEach((item,index)=> {
					if(item.number == id) {
						item.isEdit = true;
					}
				});
				
			},
			orderListFixed(e) {
				// console.log(e);
				
				this.orderListPaddingBottom = 238;
			
				
			},
			handlerSubmit(e) {
				console.log("提交工单");
				console.log(e.currentTarget.dataset.id);
				let id = e.currentTarget.dataset.id;
				this.list.forEach((item,index)=> {
					if(item.number == id) {
						item.isEdit = false;
					}
				});
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
					this.list.splice(this.list.findIndex(item => item.number === id), 1);
					
					
					//重新排序
					this.list.forEach((item,index)=> {
						item.number = index+1;
					});
				}
				
				
			},
			addCarHandler() {
				console.log("增加作业车辆");
				
				let number = this.list.length +1;
				
				let item = {
						"number": number,
						"plateNumber": '',
						"mobile": '',
						"status": '',
						"isEdit": true,
						"editPlate": {
							id: '',
							plateNo: '',
							plateShow: false,
							inputDisabled: true
						},
						"way": {
							index: 0,
							array: ['装油', '卸油'],
						}
					}
				
				this.list.push(item);
			},
			checkWrapHeight() {
				uni.createSelectorQuery().in(this).select(".check-wrap").boundingClientRect(result => {
						
					console.log(result);
					this.addListBottom = result.height;
						
				}).exec();
			},
			setPlate(plate,index) {
				
				if (plate.length >= 7) this.list[index]['editPlate']['plateNo'] = plate;
				this.list[index]['editPlate']['plateShow'] = false;
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				
				let index = e.currentTarget.dataset.index - 1
				
				console.log(index)
				
				this.list[index]['way']['index'] = e.target.value
				
				console.log(this.list[index]['way']['index'],this.list);
			
				
				this.$forceUpdate();
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
					width: 50rpx;
					height: 50rpx;
					line-height: 50rpx;
					margin-right: 20rpx;
					background: #EFEFEF;
					border-radius: 50%;
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
					width: 50rpx;
					height: 50rpx;
					line-height: 50rpx;
					margin-right: 20rpx;
					background: #EFEFEF;
					border-radius: 50%;
					font-size: 34rpx;
					font-weight: 400;
					color: #333333;
					text-align: center;
				}
				.order-info {
					.plate-number {
						margin-bottom: 20rpx;
						.plate {
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
			}
			.btn-check {
				background: #00A82B;
				border: 2rpx solid #008021;
				border-radius: 10rpx;
				font-size: 30rpx;
				font-weight: 400;
				color: #FFFFFF;
			}
		}
	}
	
</style>
