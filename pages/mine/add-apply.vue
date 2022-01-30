<template>
	<view class="wrapper">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="backText">提交申请</block>
		</cu-custom>
		
		<!-- 日历 -->
		<view class="calendar-wrap">
			<text class="date">{{date}}&nbsp;工单</text>
			<!-- <image class="icon-calendar" src="../../static/images/icon-calendar.png" @click="openCalendar"></image> -->
			<!-- //日历组件 -->
			<!-- <uni-calendar ref="calendar" :insert="false" @confirm="confirmCalendar" /> -->
		</view>
		
		<view class="order-list-wrap" :style="'padding-bottom:'+addListBottom+'px'">
			
			<block v-if="list">
				
				<block v-for="(item,index) in list" :key="index">				
					<view class="order-list-edit">
						<view class="order-info-wrap">
							<text class="number">{{item.number}}</text>
							<view class="order-info">
								<view class="plate-number" v-if="item.isAdd==true">
									<!-- 车牌号码按键 -->
									<input class="plate" placeholder="请点此输入车牌号码..." disabled="item.inputDisabled" @tap="item.editPlate.plateShow = true" v-model.trim="item.editPlate.plateNo" />
									<plate-input v-if="item.editPlate.plateShow" :plate="item.editPlate.plateNo" @export="setPlate($event,index)" @close="item.editPlate.plateShow = false" />
								</view>
								<view class="plate-number" v-if="item.isAdd==false">
									<!-- 车牌号码按键 -->
									<input class="plate" disabled="disabled" placeholder="请点此输入车牌号码..."   v-model.trim="item.editPlate.plateNo" />
						
								</view>
								<!-- <input type="text" class="input-mobile" placeholder="司机手机号码" :value="item.value" v-model="item.mobile"> -->
							</view>
						</view>
						<view class="order-handler" v-if="item.isAdd==true">
							<image class="icon icon-delete" @click="handlerDelete" :data-id="item.number" src="../../static/images/icon-delete.png"></image>
						</view>
					</view>
				</block>
				
			</block>
			<!-- 增加作业车辆 -->
			<view class="add-car-wrap" @click="addCarHandler">
				<image class="icon-add-car" src="../../static/images/icon-add-car.png"></image>
				<text class="text">增加临时出入车辆</text>
			</view>
			
		</view>
		
		<view class="submit-wrap">
			<button class="btn-submit"  :disabled="!isSubmit" @click="submit">提交</button>
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
				list:[],
				date:0,
				id:0,
				arrLength:0,
				isSubmit:true,
				addListBottom: 0, //工单列表底部填充
			}
		},
		onLoad() {
			this.getDate();
			this.info();
		},
		mounted() {
			this.submitWrapHeight();
		},
		methods: {
			// openCalendar(){
			// 	this.$refs.calendar.open();
			// },
			// confirmCalendar(e) {
			// 	console.log(e);
			// },
			
			//获取当前时间 “ yyyy-MM-dd ”
			getDate(){
				var data = new Date();
				var month =data.getMonth() < 9 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1;
				var date = data.getDate() <= 9 ? "0" + data.getDate() : data.getDate();
				this.date = data.getFullYear() + "-" + month + "-" + date;
			},
			//新增数组
			addCarHandler() {
				let number = this.list && this.list.length + 1;
				
				let item = {
					"number": number,
					"isAdd": true,
					"carState": 0,
					"editPlate": {
						id: 0,
						plateNo: '',
						plateShow: false,
						inputDisabled: true
					}
				};
				this.list.push(item);
			},
			//数组删除
			handlerDelete(e) {
				let id = e.currentTarget.dataset.id;
				
				//删除对应工单
				let newList = this.list.splice(this.list.findIndex(item => item.number === id), 1);
				
				//重新排序
				this.list.forEach((item,index)=> {
					item.number = index+1;
				});
			},
			submitWrapHeight() {
				uni.createSelectorQuery().in(this).select(".submit-wrap").boundingClientRect(result => {
					this.addListBottom = result.height;
				}).exec();
			},
			setPlate(plate,index) {
				if (plate.length >= 7) this.list[index]['editPlate']['plateNo'] = plate;
				this.list[index]['editPlate']['plateShow'] = false;
			},
			async info(){
				const result = await uni.$http.get(uni.$url.queryCarList);
				
				if (result.data.code !== 200) return uni.$showMsg(result.data.msg);
				
				if(result.data.data!=null){
					this.arrLength = result.data.data.carList.length;
					for(let i=0;i<result.data.data.carList.length;i++){
						let item = {
							"number": result.data.data.carList[i].sortNum,
							"isAdd": false,
							"carState": 1,
							"editPlate": {
								id: result.data.data.carList[i].id,
								plateNo: result.data.data.carList[i].licensePlate,
								plateShow: false,
								inputDisabled: false
							}
						};
						this.list.push(item);
					}
					this.id = result.data.data.id;
				}
			},
			//提交数据
			async submit(){
				if(this.list.length==this.arrLength){
					uni.showToast({
					    title: '请添加车辆',
					    duration: 2000,
						icon:"none",
					});
					return;
				}
				
				//数组处理
				let list = [];
				for(let i=0;i<this.list.length;i++){
					let oj = {
						carState:0,
						licensePlate:""
					}
					if(this.list[i]["editPlate"]["id"]!=0){
						oj.id = this.list[i]["editPlate"]["id"];
					}
					
					oj.licensePlate = this.list[i]["editPlate"]["plateNo"];
					oj.carState = this.list[i]["carState"];
					if(this.id>0 && this.list[i]["carState"]==0){
						oj.carState = 2;
					}
					list.push(oj);
				}
				
				//调用接口
				let query={
					carList:list,
					workDate:this.date
				}
				//防止短时间内重复提交
				if(!this.isSubmit) return;
				
				this.isSubmit = false;
				
				const visitOrderResult = await uni.$http.post(uni.$url.saveVisitOrder,query);

				//防止短时间内重复提交
				//1.5秒后取消button禁用
				setTimeout(() => {
					this.isSubmit=true;
				},1500);
				
				if (visitOrderResult.data.code !== 200) return uni.$showMsg(visitOrderResult.data.msg);
				

				//成功回调
				uni.showToast({
				    title: '提交成功',
				    duration: 1500,
					icon:"success",
					success() {
						setTimeout(() => {
							uni.navigateBack({})
						},1500);
						
					}
				});
				
			}
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
		// .icon-calendar {
		// 	display: inline-block;
		// 	position: absolute;
		// 	top: 30rpx;
		// 	right: 30rpx;
		// 	width: 32rpx;
		// 	height: 32rpx;
		// }
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
				.input-mobile {
					margin-top: 20rpx;
					width: 405rpx;
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
					
					&:hover {
						border: 2rpx solid #FFC600;
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
	
	
	.submit-wrap {
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 110rpx;
		background: #FFFFFF;
		box-shadow: 0 0 30rpx 0 rgba(0, 0, 0, 0.2);
		.btn-submit {
			display: inline-block;
			height: 60rpx;
			line-height: 60rpx;
			vertical-align: middle;
			background: #00A82B;
			border: 2rpx solid #008021;
			border-radius: 10rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #FFFFFF;
			&::after {
				border: none;
			}
			&[disabled] {
				background: #000000;
				opacity: 0.2
			}
		}
	}
	
</style>
