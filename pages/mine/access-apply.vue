<template>
	<view class="wrapper">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="backText">非危运车临时出入申请</block>
		</cu-custom>
		
		<view class="apply-list-wrap">
			<view class="apply-item" v-for="(item,index) in list" :key="index" @click="showModal" data-target="Modal" :data-date="item.workDate" :data-carList="item.carList">
				<view class="plate-number-wrap">
					<text class="plate-number first">{{item.carList[0].licensePlate}}</text>
					<text class="plate-number second" v-if="item.carList.length>1">{{item.carList[1].licensePlate}}</text>
					<text class="plate-number three" v-if="item.carList.length>2">{{item.carList[2].licensePlate}}</text>
				</view>
				<view class="date">{{item.workDate}}</view>
			</view>
			
		</view>
		
		<!-- 添加申请 -->
		<navigator class="add-order-wrap" v-if="isParent" :url="'/pages/mine/add-apply?date='+ date">
			<image class="icon-add-order" src="../../static/images/icon-add.png"></image>
		</navigator>
		
		
		<!-- 模态框 -->
		<view class="cu-modal" :class="modalName=='Modal'?'show':''" @click="hideModal"></view>
		<view class="cu-dialog" :class="modalName=='Modal'?'show':''">
			<view class="cu-bar bg-white justify-end modal-header">
				<view class="content">{{dateNum}}</view>
			</view>
			<view class="padding-xl modal-content">
				<block v-for="(item,index) in carlist" :key="index">
					<block v-if="item.carState == 1 || item.carState ==2">
						<text class="plate-number gray">{{item.licensePlate}}</text>
					</block>
					<block v-else-if="item.carState == 3">
						<text class="plate-number">{{item.licensePlate}}</text>
					</block>
					<block v-else-if="item.carState == 4">
						<text class="plate-number red">{{item.licensePlate}}</text>
					</block>
				</block>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: null,
				list:[],
				date:"0000-00-00",
				dateNum:"0000-00-00",
				carlist:[],
				total:1,
				num:0,
				scrollSize: 0, //滚动距离
				topRange: 0, //导航栏初始化距顶部的距离
				
				isParent: true,  //判断是否为主账号
				
			}
		},
		onLoad() {
			
		},
		onShow() {
			
			//判断是否为子账号
			if(uni.getStorageSync('isParent')) {
				this.isParent = true;
			} else {
				this.isParent = false;
			}
			
			this.indexInfo(0);
			this.getDate();
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target;
				this.dateNum = e.currentTarget.dataset.date;
				this.carlist = e.currentTarget.dataset.carlist;
			},
			hideModal(e) {
				this.modalName = null
			},
			//获取当前时间 “ yyyy-MM-dd ”
			getDate(){
				var data = new Date();
				var month =data.getMonth() < 9 ? "0" + (data.getMonth() + 1) : data.getMonth() + 1;
				var date = data.getDate() <= 9 ? "0" + data.getDate() : data.getDate();
				this.date = data.getFullYear() + "-" + month + "-" + date;
			},
			async indexInfo(type){
				//首次打开默认恢复初始值
				if(type==0){
					this.total=1;
					this.list = [];
				}
				let query={
					pageNum:this.total,
					pageSize:15,
				}
				
				const indexResult = await uni.$http.get(uni.$url.queryAllCarList,query);
				
				if (indexResult.data.code !== 200) return uni.$showMsg(indexResult.data.msg);
				
				if(indexResult.data.rows.length==0){
					this.total = 1;
				}
				this.num=indexResult.data.total;
				this.list = indexResult.data.rows
				
			},
			async indexInfoPage(){
				
				// 判断是否还有下一页数据
				if (this.total * 15 >= this.num) return uni.$showMsg('到底了，没有了！');
			
				let query={
					pageNum:++this.total,
					pageSize:15,
				}	
				
				
				const indexResult = await uni.$http.get(uni.$url.queryAllCarList,query);
				
				if (indexResult.data.code !== 200) return uni.$showMsg(indexResult.data.msg);
				
				if(indexResult.data.rows.length==0){
					this.total = 1;
				}
				this.num=indexResult.data.total;
				this.list = [...this.list, ...indexResult.data.rows]
				
			},
			// 触底的事件
			onReachBottom() {
				// this.total;
				this.indexInfoPage();
			}
		}
	}
</script>

<style lang="scss">
	.apply-list-wrap {
		margin-top: 20rpx;
		.apply-item {
			display: flex;
			width: 100%;
			height: 110rpx;
			line-height: 110rpx;
			padding: 0 30rpx;
			background: #FFFFFF;
			margin-bottom: 10rpx;
			justify-content: space-between;
			align-items: center;
			.plate-number-wrap {
				position: relative;
				flex: 1;
				height: 100%;
				margin-top: 54rpx;
				.plate-number {
					position: absolute;
					display: inline-block;
					height: 50rpx;
					line-height: 50rpx;
					padding: 0 10rpx;
					background: #1557D2;
					border-radius: 10rpx;
					font-size: 34rpx;
					font-weight: bold;
					color: #FFFFFF;
					border: 1rpx solid #FFFFFF;
					flex-direction: nowrap;
					&.first {
						left: 23rpx;
					}
					&.second {
						left: 15rpx;
					}
					&.three {
						left: 5rpx;
					}
				}
			}
			.date {
				flex: 1;
				text-align: right;
			}
		}
	}

	//添加工单按键
	.add-order-wrap {
		display: block;
		position: fixed;
		bottom: 0;
		left: 50%;
		width: 160rpx;
		height: 100rpx;
		margin-left: -80rpx;
		z-index: 100;
		.icon-add-order {
			display: inline-block;
			width: 160rpx;
			height: 100rpx;
		}
	}
	
	.cu-dialog {
		display: none;
		// position: absolute;
		top: 15%;
		// left: 50%;
		margin: 0 auto;
		z-index: 1111;
		&.show {
			display: block;
		}
		.modal-header {
			font-size: 30rpx;
			font-weight: bold;
			color: #666666;
		}
		.modal-content {
			display: flex;
			flex-wrap: wrap;
			padding: 30rpx;
			.plate-number {
				display: inline-block;
				height: 50rpx;
				margin: 20rpx 10rpx;
				padding: 0 10rpx;
				background: #1557D2;
				border-radius: 10rpx;
				font-size: 34rpx;
				font-weight: bold;
				color: #FFFFFF;
				&.red {
					background: #dd514c;
				}
				&.gray {
					background: #CCCCCC;
				}
			}
		}
	}
</style>
