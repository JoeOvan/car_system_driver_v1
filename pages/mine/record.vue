<template>
	<view class="wrapper">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="backText">茂南石化工业园区车辆管理平台</block>
		</cu-custom>
		
		<view class="tab-menu-wrap">			
			<swiper class="tab-menu" :current="tabIndex" :duration="300">
			  <swiper-item class="swiper-item" v-for="(page, index) in tabList" :key="index">
				{{page}}月
			  </swiper-item>
			</swiper>
			<button class="tab-left" @click="prevSwiper" :disabled="tabIndex == 0">
				<image class="icon-arrow-left" src="../../static/images/icon-arrow-left-active.png" mode="aspectFill" v-if="tabIndex !== 0"></image>
				<image class="icon-arrow-left" src="../../static/images/icon-arrow-left.png" mode="aspectFill" v-else></image>
			</button>
			<button class="tab-right" @click="nextSwiper" :disabled="tabIndex == tabList.length - 1">
				<image class="icon-arrow-right" src="../../static/images/icon-arrow-right-active.png" mode="aspectFill" v-if="tabIndex !== tabList.length -1"></image>
				<image class="icon-arrow-right" src="../../static/images/icon-arrow-right.png" mode="aspectFill"v-else></image>
			</button>
		</view>
		
		
		<swiper class="tab-content" :current="tabIndex" :duration="300" @change="onswiperchange" :style="'height:' + swiperHeight + 'px'">
		  <swiper-item class="swiper-item" v-for="(item, index) in list" :key="index">
			<view class="order-list-wrap" :class="'tabContent_'+ index">			
			<block v-if="item.data && item.data.length >= 1">
				
				<block v-for="(item1, index1) in item.data" :key="index1">
					
					<navigator class="order-list" :url="'/pages/mine/record-detail?orderSn='+item1.orderSn + '&title='+item1.orderName">
						<view class="order-info">
							<image class="icon-order" src="../../static/images/icon-order.png"></image>
							<text class="date">{{item1.orderName}}</text>
						</view>
						<view class="order-total">
							<view class="total">
								{{item1.violationNum}}
							</view>
						</view>
					</navigator>
					
					
				</block>
				
			</block>

			<block v-else>
				<view class="tips">
					没有工单了
				</view>
			</block>

				
			</view>
		  </swiper-item>
		</swiper>
		
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: [],
				list: [],
				tabIndex: 5,
				
				swiperHeight: 0,
				
			}
		},
		onLoad() {
			
			this.getWorkOrderMouth();
			
			this.getWorkOrderList();
		},
		mounted() {
			
		},
		updated() {
			this.initSwiperHeight('.tabContent_' + this.tabIndex);
		},
		methods: {
			onswiperchange(e) {
				// let index = e.index;
				let index = e.detail.current;

				this.tabIndex = index;
				
				this.getSwiperContent(index);
				
			},
			prevSwiper() {
				
				this.tabIndex = --this.tabIndex;
				
			},
			nextSwiper() {
				
				this.tabIndex = ++this.tabIndex;

			},
			async getSwiperContent(index) {
				
				// 根据index查找月份
				
				let date = this.getDate();
				
				let workDate = date[index];
				
				console.log(workDate);
				
				//发起获取工单列表请求
				let res = await uni.$http.get(uni.$url.queryJobRecordListUrl, { yearMonth: workDate});
				
				// console.log(res);
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				uni.showToast({ title: res.data.msg, icon: 'none', duration: 2000 });
				
				//加载更多数据赋值给this.list
				this.list[index]['data'] = res.data.data;
				
				console.log(index,this.list);
				
				
			},
			getDate() {     //这是我自定义的方法,哪里需要直接调用就可以
			  let date = new Date()
			  let year = date.getFullYear()
			  let month = date.getMonth() + 1
			  let newYear = 0
			  let newMonth = 0
			  let newDateArr = []
			  for (let i = 0; i < 6; i++) {         //这里是获取前六个月,所以循环6次,根据需要修改
				if (month - i < 1) {            //这里的判断是如果当前月份往前推到了去年  需要做的处理
				  newYear = year - 1
				  newMonth = month - i + 12 >= 10 ? month - i + 12 : '0' + (month - i + 12)
				  newDateArr.push(newYear + '-' + newMonth)      //这里拼接格式化,在时间中间加了个-,根据实际需求来
				} else {
				  newMonth = month - i >= 10 ? month - i : '0' + (month - i)   //这里是对月份小于10做加前面加0处理
				  newDateArr.push(year + '-' + newMonth)
				}
			  }
			 console.log(newDateArr)    //这里就最后得到当前年月前六个月组成的时间数组,根据需要赋值使用即可		
			 return newDateArr.reverse();
			},
			//动态获取高度
			initSwiperHeight(element) {
				
			
				uni.createSelectorQuery().in(this).select(element).boundingClientRect(result => {
					
					if (result && result.height > 0) {
						
						this.swiperHeight = result.height;
						
					} 
					
				}).exec();
			
			},
			getWorkOrderMouth() {
				
				let monthOfYear = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
				// 先取到当前日期对象
				let date = new Date();
				// 月份数组
				let nearThree = [];
				// 当月
				let month = date.getMonth();
				// 现将本月推入数组
				nearThree.push(monthOfYear[month]);
				// 最近一月逆推两个月
				for (let i = 1; i <= 5; i++) {
				    date.setMonth(month - i);
				    nearThree.unshift(monthOfYear[date.getMonth()]);
				}
				
				this.tabList = nearThree;
				// console.log(monthOfYear);
				console.log(nearThree);
				
			},
			async getWorkOrderList() {
				
				
				//根据当前时间获取日期
				let date = new Date();
				// date.setDate(date.getDate() + 1);
				date.setDate(date.getDate());
				let Y = date.getFullYear() + '-';
				let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
				let D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getMonth());
				
				let workDate = Y+M;
				
				//发起获取工单列表请求
				let res = await uni.$http.get(uni.$url.queryJobRecordListUrl, { yearMonth: workDate});
				
				// console.log(res);
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				uni.showToast({ title: res.data.msg, icon: 'none', duration: 2000 });
				
				
				let fristData = res.data.data;
				
				
				//根据当前时间获取明天日期
				let tDate = new Date();
				// date.setDate(date.getDate() + 1);
				tDate.setDate(tDate.getDate() + 1);
				let tY = tDate.getFullYear() + '-';
				let tM = (tDate.getMonth()+1 < 10 ? '0'+(tDate.getMonth()+1) : tDate.getMonth()+1)+ '-';
				let tD = (tDate.getDate() < 10 ? '0'+(tDate.getDate()) : tDate.getMonth());
				
				//判断是否是当天日期
				let str = fristData[0].orderName;
				let strDate = str.trim().split(" ")
				let todayDate = strDate[0];
				let lastDate = tY + tM + tD;
				// let lastDate = Y + M + (D+1);
				
				//是当天显示addIcon按钮
				this.addIconIsShow = todayDate !== lastDate;
				// console.log(todayDate,lastDate);
				
				let tabCount = this.tabList.length;
				
				// let index = this.tabIndex;
				//重置为当月
				this.tabIndex = 5;
				
				//请求数据并赋值给this.listData 没有数据的设置为空
				let arrData = {};
				for (let i = 0; i < tabCount; i++) {
					arrData[i] = {};
					if (i == this.tabIndex) {
						arrData[i]['data'] = fristData;
					} else {
						arrData[i]['data'] = [];
					}
				}
				
				
				this.list = arrData;
				
			}
					
					
		}
	}
</script>

<style lang="scss">
	.tab-menu-wrap {
		position: sticky;
		top: 45px;
		height: 80rpx;
		border-top: 1px solid #f1f1f1;
		background: #ffffff;
		z-index: 115;
		.tab-menu {
			height: 100%;
			.swiper-item {
				line-height: 80rpx;
				text-align: center;
			}
		}
		.tab-left {
			position: absolute;
			top: 0;
			left: 0;
			padding: 0;
			margin: 0;
			line-height: 1;
			background-color: #FFFFFF;
			border: none;
			&::after {
				content: '';
				border: none;
			}
			.icon-arrow-left {
				display: inline-block;
				width: 17rpx;
				height: 28rpx;
				padding: 22rpx 20rpx;
				box-sizing: content-box;
				border: none;
			}
		}
		.tab-right {
			position: absolute;
			top: 0;
			right: 0;
			padding: 0;
			margin: 0;
			line-height: 1;
			background-color: #FFFFFF;
			border: none;
			&::after {
				content: '';
				border: none;
			}
			.icon-arrow-right {
				display: inline-block;
				width: 17rpx;
				height: 28rpx;
				padding: 22rpx 20rpx;
				box-sizing: content-box;
				border: none;
			}
		}
	}
	
	//工单列表
	.order-list-wrap {
		.tips {
			padding: 50rpx;
			text-align: center;
		}
		.order-list {
			display: flex;
			width: 100%;
			padding: 30rpx;
			margin-top: 10rpx;
			justify-content: space-between;
			align-items: center;
			background: #FFFFFF;
			.order-info {
				.icon-order {
					display: inline-block;
					width: 24rpx;
					height: 30rpx;
					margin-right: 20rpx;
				}
				.date {
					font-size: 34rpx;
					font-weight: 400;
					color: #000000;
				}
			} 
			.order-total {
				.total {
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
					background: #FE4D4C;
					border: 2rpx solid #CF3534;
					border-radius: 20rpx;
					border: 2rpx solid #CF3534;
					border-radius: 20rpx;
					text-align: center;
					color: #ffffff;
				}
			}
		}
	}

	
</style>
