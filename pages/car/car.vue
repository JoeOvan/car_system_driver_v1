<template>
	<view class="wrapper">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="backText">茂南石化工业园区车辆管理平台</block>
		</cu-custom>

		<!-- 吸顶统计栏 -->
		<view class="cu-bar search total-wrap">
			<image class="icon-add-order" @click="addCarHandler" src="../../static/images/icon-add-car.png"></image>
			<!-- <text class="date">{{workDate}}</text> -->
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input @click="toSearch" :adjust-position="false" type="text" placeholder="根据车牌号码搜索车辆..." confirm-type="search"></input>
			</view>
			<text class="total">{{count}}/{{total}}</text>
		</view>

		<!-- <view class="content" :style="'padding-bottom:'+(tabbarBottom + checkBarBottom)+ 'px'"> -->
		<view class="content" :style="'padding-bottom:'+ tabbarBottom + 'px'">
			<view class="btn-toggle" @click="toggle">
				<block v-if="!isShow">
					<image class="icon-arrow" src="../../static/images/icon-arrow-up.png"></image>显示已完成的车辆
				</block>
				<block v-else>
					<image class="icon-arrow" src="../../static/images/icon-arrow-down.png"></image>隐藏已完成的车辆
				</block>
			</view>
			<view :class="[ isShow ? 'toggle-wrap show':'toggle-wrap']">

				<!-- 已完成 -->
				<block v-for="(row,index) in listA" :key="'listA_'+index">
					<view class="row carbar custom" v-if="row.workState == 5">
						<view class="car-info">
							<text class="number">{{row.editPlate.number}}</text>
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
				</block>
				
			</view>





			<!-- 完成 -->
			<block v-for="(row,index) in listB" :key="'listB_'+index">
				<view class="row carbar custom" v-if="row.workState == 4">
					<view class="car-info">
						<text class="number">{{row.editPlate.number}}</text>
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
			</block>



			<!-- 参数 
			* @property {ObjectArray} list = [] 列表数据,自定义数据，会传递到name="rowContent"插槽  
			* @property {Boolean} feedbackGeneratorState = [true|false] 是否开启拖动触感反馈  
			* @property {Boolean} isLongTouch = [true|false] 是否开启长按拖动  
			* @property {Boolean} isAutoScroll = [true|false] 是否拖拽至边缘自动滚动列表  
			* @property {Number} longTouchTime = [] 选填,触发长按时长,单位:ms,默认350ms,不支持微信小程序 
			* @property {Number} listHeight = [] 选填,可拖动列表整体的高度,单位:px,默认等于窗口高度 
			* @property {Number} rowHeight = [] 必填,行高,单位:px,默认44px
			* @event {Function} change 行位置发生改变时触发事件 返回值:{index:'原始下标',moveTo:'被拖动到的下标',moveRow:'拖动行数据'}   
			* @event {Function} confirm 拖拽结束且行位置发生了改变触发事件 返回值:{index:'原始下标',moveTo:'被拖动到的下标',moveRow:'拖动行数据',list:'整个列表拖动后的数据'}  
			* @event {Function} onclick 点击行触发事件 返回值:{index:'被点击行下标',value:'被点击行数据'} 
			*/ 
			-->
			<!-- 当前属性设置 isLongTouch关闭长按拖动 isAutoScroll开启自动滚动 feedbackGeneratorState开启触感反馈 rowHeight行高55 -->



			<HM-dragSorts :list="listC" :listHeight="listC.length !== 0 ? listC.length*55 : 1" :isDrag="isDrag" :isLongTouch="true"
				:isAutoScroll="true" :feedbackGeneratorState="true" :rowHeight="55" @change="change" @confirm="confirm"
				@onclick="onclick">
				<template v-slot:rowContent="{row}">
					<view class="row carbar" v-if="row.workState == 3">
						<view class="car-info">
							<text class="number">{{row.editPlate.number}}</text>
							<text class="plate-number">{{row.licensePlate}}</text>
							<text class="mobile">{{row.mobile}}</text>
							<text class="way">{{row.workType == 1 ? "装油" : "卸油"}}</text>
						</view>
						<view class="car-status">
							<button type="button" class="btn btn-take-post" @click.stop="showPopupModal($event, row)" data-target="DialogModal1" :data-id="row.editPlate.number" :disabled="row.isSendInPlace == 1">
								就位
							</button>
						</view>
					</view>
					<view class="row carbar" v-if="row.workState == 2">
						<view class="car-info">
							<text class="number">{{row.editPlate.number}}</text>
							<text class="plate-number">{{row.licensePlate}}</text>
							<text class="mobile">{{row.mobile}}</text>
							<text class="way">{{row.workType == 1 ? "装油" : "卸油"}}</text>
						</view>
						<view class="car-status">
							<button type="button" class="btn btn-message" @click.stop="showPopupModal($event, row)" data-target="DialogModal1" :data-id="row.editPlate.number" :disabled="row.isSendInform == 1">
								通知
							</button>
						</view>
					</view>
					<view class="row carbar" v-if="row.workState == 1">
						<view class="car-info">
							<text class="number">{{row.editPlate.number}}</text>
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
				</template>
			</HM-dragSorts>


			<!-- 待审核 -->
			<block v-for="(row,index) in listD" :key="'listD_'+index">
				
				<block v-if="row.carState == 1 || row.carState == 2">
					<view class="row carbar custom">
						<view class="car-info">
							<text class="number">{{row.editPlate.number}}</text>
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
				
				
				<block v-if="row.carState == 4">
					<view class="row carbar custom">
						<view class="car-info">
							<text class="number">{{row.editPlate.number}}</text>
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



			<block v-for="(row,index) in listE" :key="'listE_'+index">
				<block v-if="!row.editPlate.isEdit">
					<view class="row carbar custom" v-if="row.editPlate.workState == 0">
						<view class="car-info">
							<text class="number">{{row.editPlate.number}}</text>
							<text class="plate-number">{{row.licensePlate}}</text>
							<text class="mobile">{{row.mobile}}</text>
							<text class="way">{{row.workType == 1 ? "装油" : "卸油"}}</text>
						</view>
						<view class="car-status">
							<image class="icon-edit" src="../../static/images/icon-edit.png" @click="handlerEdit"
								:data-id="row.editPlate.number"></image>
						</view>
					</view>
				</block>

				<block v-else>
					<view class="order-list-edit">
						<view class="order-info-wrap">
							<text class="number">{{row.editPlate.number}}</text>
							<view class="order-info">
								<view class="plate-number">
									<!-- 车牌号码按键 -->
									<input class="plate" placeholder="请点此输入车牌号码..." disabled="row.inputDisabled"
										@tap="row.editPlate.plateShow = true" v-model.trim="row.licensePlate" />
									<plate-input v-if="row.editPlate.plateShow" :plate="row.licensePlate"
										@export="setPlate($event,index)" @close="row.editPlate.plateShow = false" />
								</view>
								<view class="number-wrap">
									<input type="number" class="input-mobile" placeholder="司机手机号码"
										v-model.trim="row.mobile">
									<picker class="way" @change="bindPickerChange" :data-index="index"
										:value="row.editPlate.way.index" :range="row.editPlate.way.array">
										<view class="uni-input">{{row.editPlate.way.array[row.editPlate.way.index]}}
										</view>
										<image class="icon-arrow-down"
											src="../../static/images/icon-arrow-down-gray.png"></image>
									</picker>
								</view>
								<view class="goods-wrap">
									<input type="text" class="input-goods" placeholder="请输入运输物品名称" v-model.trim="row.workTypeInfo">
								</view>
							</view>
						</view>
						<view class="order-handler">
							<image class="icon icon-submit" @click="handlerSubmit" :data-id="row.editPlate.number"
								src="../../static/images/icon-submit.png"></image>
							<image class="icon icon-delete" @click="handlerDelete" :data-id="row.editPlate.number"
								src="../../static/images/icon-delete.png"></image>
						</view>
					</view>
				</block>


			</block>


		</view>




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

		<!-- 作业最大值 -->
		<!-- <view class="check-wrap" v-if="listD.length >= 1 || listE.length >= 1" :style="'bottom:'+tabbarBottom+'px'"> -->
		<view class="check-wrap" :style="'bottom:'+tabbarBottom+'px'">
			<view class="max-wrap">
				<text class="text">作业最大值</text>
				<input type="number" class="max" v-model.trim="maxCapacity" :disabled="!isParent">
				<!-- <input type="number" class="max" v-model.trim="maxCapacity"  disabled="disabled"> -->
			</view>
			<view class="handler-wrap">
				<!-- <button class="btn btn-save" :disabled="!isSubmit" v-if="listE.length >= 1" @click="saveCarOrder(1)">保存</button> -->
				<button class="btn btn-check" :disabled="!isSubmit" @click="saveCarOrder">提交审核</button>
			</view>
		</view>


		<!-- tabbar导航栏 -->
		<page-tabpars name="tabbar"></page-tabpars>


	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import plateInput from '@/components/uni-plate-input/uni-plate-input.vue';
	// 导入网络请求的包
	import jutils from 'jutils-src'
	export default {
		components: {
			plateInput
		},
		data() {
			return {

				isShow: false,
				/*
					0.数据结构说明 可以在结构中添加其他的数据，比如id,value等，不影响组件使用，拖动调整顺序后，组件会把传入的数据排序后原封不动在@confirm中返回。
					
					1.动态修改list数据，组件会响应变化，但拖动排序不会影响list，
					  所以，要特别注意，在动态修改list数据时候，由于组件内数据可能已经拖动重新排序过，页面的list顺序和组件内数据顺序不一致了，
					  最好在操作list时候，先和@confirm返回的值同步一下，或者直接操作@confirm返回的值，然后赋值给list。
					  
					n.最后，组件你下载了，代码你也看了，不给个五星好评，我可要打人了啊  (╬￣皿￣)=○  ヽ(#`Д´)ﾉ
				*/

				listA: [],  //已完成
				listB: [],  //完成
				listC: [],  //就位、通知、排队
				listD: [],  //待审核
				listE: [],  //新增
				listF: [],  //已取消
				listHeight: 0,
				ispush: false,
				StatusBar: this.StatusBar,

				modalName: null, //模态框
				radio: 'radio0',

				radioIndex: 1, //radio索引值
				popupModalData: null,

				tabbarBottom: 0,
				// checkBarBottom: 0,
				
				maxCapacity: 3,
				originalMaxCapacity: 0,	//原始最大值变量，用来判断最大值有没变更
				
				// workDate: '',  //工单日期
				count: 0, //已完成
				total: 0, //统计总数
				
				isSubmit: true, //防止多次提交
				
				isParent: true, //是否为主账号
				isDrag: true, //是否开启拖拽
				
				orderSn: '',  //工单号
				

			}
		},
		computed: {
			...mapGetters(['active']),
		},
		created() {
			const active = 'car'
			if (this.active !== active) {
				this.SET_ACTIVE(active)
			}
		},
		mounted() {
			this.tabbarHeight();	//tabbar高度
			// this.checkBarHeight(); //最大作业值高度
		},
		onLoad() {

			if (!uni.getStorageSync('token')) return uni.navigateTo({url: '/pages/index/index'});

		},
		onShow() {
			
			//如果为子账号,则禁止拖拽
			if(uni.getStorageSync('isParent')) {
				this.isParent = true;
				this.isDrag = true;
			} else {
				this.isParent = false;
				this.isDrag = false;
			}
			
			this.getQueryIndexOrder();  //请求全部数据
			
			this.getEditData();
		},
		methods: {
			...mapMutations(['SET_ACTIVE']),
			//下拉刷新事件
			async onPullDownRefresh() {
			
				uni.showLoading({
					title: '刷新中'
				});
				
				this.getQueryIndexOrder();  //请求全部数据
				
				this.getEditData();
				
			
				setTimeout(function() {
					uni.hideLoading();
					uni.stopPullDownRefresh()
				}, 2000);
			
			},
			tabbarHeight() {
				uni.createSelectorQuery().in(this).select(".lb-tabbar").boundingClientRect(result => {

					this.tabbarBottom = result.height;

				}).exec();
			},
			onclick(e) {
				// console.log('=== onclick start ===');
				// console.log("被点击行: " + JSON.stringify(e.value));
				// console.log("被点击下标: " + JSON.stringify(e.index));
				// console.log('=== onclick end ===');
			},
			change(e) {
				// console.log('=== change start ===');
				// console.log("被拖动行: " + JSON.stringify(e.moveRow));
				// console.log('原始下标：', e.index);
				// console.log('移动到：', e.moveTo);
				// console.log('=== change end ===');
			},
			async confirm(e) {
				console.log("this.list: ", this.list);
				console.log("e.list: ", e.list);
				console.log('=== confirm start ===');
				console.log("被拖动行: " + JSON.stringify(e.moveRow));
				console.log('原始下标：', e.index);
				console.log('移动到：', e.moveTo);
				console.log('=== confirm end ===');


				let id = e.moveRow.id;
				let newSort = this.listA.length + this.listB.length + Number(e.moveTo);
				let oldSort = this.listA.length + this.listB.length + Number(e.index);


				let query = {
					id,
					newSort,
					oldSort
				}
				
				console.log(query);
				
				//拖拽后发起排序请求 
				const res = await uni.$http.post(uni.$url.orderCarSortUrl,query);
				
				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				uni.showToast({ title: res.data.msg, icon: 'none', duration: 2000 });
				
				location.reload();


			},
			toggle() {
				this.isShow = !this.isShow;
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
					
					location.reload();
					
				} else {
					
					//发送就位短信请求
					const res = await uni.$http.post(uni.$url.sendInPlaceSmsUrl,{ id });
					
					
					if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
					
					uni.showToast({ title: res.data.msg, icon: 'none', duration: 2000 });
					
					location.reload();
					
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
					
					location.reload();
					
					
				} else {
					
					//发送通知短信请求
					const res = await uni.$http.post(uni.$url.sendInFormSmsUrl,{ id });
					
					
					if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
					
					location.reload();
					
				}
				
				

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
					
					
					location.reload()
				
				}
			},
			addCarHandler() {
				console.log("增加作业车辆");

				let number = this.listA.length + this.listB.length + this.listC.length + this.listD.length + this.listE.length + 1;

				this.total = number; //更新统计

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


				this.listE.push(item);

				console.log(this.listE);
			},
			handlerEdit(e) {
				console.log("编辑工单");
				console.log(e.currentTarget.dataset.id);
				let id = e.currentTarget.dataset.id;
				this.listE.forEach((item, index) => {
					if (item.editPlate.number == id) {
						item.editPlate.isEdit = true;
					}
				});

			},
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			radioChange(index) {
				// this.radio = e.detail.value

				this.radioIndex = index;

				console.log(this.radioIndex);

			},
			showPopupModal(e, item) {
				
				if(!this.isParent) return uni.showToast({ title: '当前用户没有权限！', icon: 'error', duration: 2000 });
				
				this.modalName = e.currentTarget.dataset.target;

				this.popupModalData = item;
			},
			hidePopupModal() {

				this.modalName = null;

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
						location.reload()
					},1500);
				
				}
				

			
			},
			setPlate(plate, index) {

				if (plate.length >= 7) this.listE[index]['licensePlate'] = plate;
				this.listE[index]['editPlate']['plateShow'] = false;
			},
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)

				// let index = e.currentTarget.dataset.index - 1
				let index = e.currentTarget.dataset.index

				console.log(index, this.listE[index])

				this.listE[index]['editPlate']['way']['index'] = e.target.value

				console.log(this.listE[index]['editPlate']['way']['index'], this.listE);
				
				
				if(e.target.value == 0) {					
					this.listE[index]['workType'] = 1
				} else if (e.target.value == 1) {
					this.listE[index]['workType'] = 2
				}
				

			},
			handlerSubmit(e) {
				console.log("提交工单");
				
				let id = e.currentTarget.dataset.id;
				
				this.listE.forEach((item, index) => {
					// console.log(item)
					if (item.editPlate.number == id) {
						
						//车牌号码、手机号码不能为空
						if(!item.licensePlate || item.licensePlate == '') return uni.showToast({title:'车牌号码不能为空!', icon: 'none', duration: 2000});
						
						if(!item.mobile || item.mobile == '') return uni.showToast({title:'手机号码不能为空!', icon: 'none', duration: 2000});
						//校验手机号码
						let regex = new RegExp(/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/);
						if (!regex.test(item.mobile)) return uni.showToast({ title: '请填写正确的手机号码', icon: 'none', duration: 2000 });
						//运输物品名称不能为空
						if(!item.workTypeInfo || item.workTypeInfo == '') return uni.showToast({title:'运输物品名称不能为空!', icon: 'none', duration: 2000});
						
						
						//对验证成功数据进行存储操作
						item.editPlate.isEdit = false;
						
					}
				});
			
				uni.removeStorageSync('plateList');
				
				//获取今天结束时间
				let today = new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000 -1);
				//当前时间到结束时间差
				let date = today - new Date();
				
				//设置缓存时间及当前时间戳
				uni.setStorageSync('setTime', new Date().getTime())
				uni.setStorageSync('cacheTime', date);
				uni.setStorageSync('plateList', this.listE);
				
				// console.log(uni.getStorageSync('plateList'));
				// console.log(uni.getStorageSync('cacheTime'));
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
					this.listE.splice(this.listE.findIndex(item => item.editPlate.number === id), 1);
					
					let carList = this.listA.concat(this.listB,this.listC,this.listD);
					
					let carIndex = carList.length;

					//重新排序
					this.listE.forEach((item, index) => {
						item.editPlate.number = carIndex + index + 1;
					});
					
					let showAllList = this.listA.concat(this.listB,this.listC,this.listD,this.listE); //合并所有车辆,取消车辆除外
					
					this.total = showAllList.length;
					
					
					uni.removeStorageSync('plateList');
					
					//获取今天结束时间
					let today = new Date(new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000 -1);
					//当前时间到结束时间差
					let date = today - new Date();
					
					//设置缓存时间及当前时间戳
					uni.setStorageSync('setTime', new Date().getTime())
					uni.setStorageSync('cacheTime', date);
					
					uni.setStorageSync('plateList', this.listE);
				}


			},
			async getQueryIndexOrder() {

				const res = await uni.$http.get(uni.$url.queryIndexOrderUrl);

				if (res.data.code !== 200) return uni.$showMsg(res.data.msg);
				
				uni.showToast({ title: res.data.msg, icon: 'none', duration: 2000 });
				
				let data = res.data.data;
				
				this.maxCapacity = data.maxCapacity;
				
				this.orderSn = data.orderSn;
				
				//原始最大值变量，用来判断最大值有没变更
				this.originalMaxCapacity = data.maxCapacity;
				
				// let workDate = data.workDate;
				
				// this.workDate = workDate.substring(0, workDate.indexOf(' '));  //获取数据当天时间

				//获取到的信息分别赋值给list
				let allList = data.carList;
				
				if(allList == null) return allList = [];
				
				let listA = []; //已完成
				let listB = []; //完成
				let listC = []; //就位、通知、排队
				let listD = []; //待审核
				let listF = []; //已取消
				// let listE = []; //新增
				// workState 工作状态  1排队 2通知 3就位 4作业 5完成
				allList.forEach((item, index) => {
					
					item['editPlate'] = {};
					item['editPlate']['number'] = index;
					
					//carState 车辆状态 1提审 2追加 3通过 4未通过 5取消
					if (item.carState == 1 || item.carState == 2 || item.carState == 4) {
						listD.push(item);
						
					} else if (item.carState == 3) {
						
						if (item.workState == 5) {
							
							listA.push(item);
							
						} else if (item.workState == 4) {
							listB.push(item);
							
						} else if (item.workState == 3 || item.workState == 2 || item.workState == 1) {
							listC.push(item);
						}
						
					} else {
						listF.push(item);
					}

				})
				
				//重新排序
				if(listA.length && listA.length >= 1) {					
					listA.forEach((item, index) => {
						item.editPlate.number = index + 1;
					});
				}
				
				let listALength = listA.length || 0;
				
				if(listB.length && listB.length >= 1) {	
					listB.forEach((item, index) => {
						item.editPlate.number = listALength + index + 1;
					});
				}
				
				let listBLength = listB.length || 0;
				
				if(listC.length && listC.length >= 1) {	
					listC.forEach((item, index) => {
						item.editPlate.number = listALength + listBLength + index + 1;
					});
				}
				
				let listCLength = listC.length || 0;
				
				if(listD.length && listD.length >= 1) {	
					listD.forEach((item, index) => {
						item.editPlate.number = listALength + listBLength + listCLength + index + 1;
					});
				}
				
				let showAllList = listA.concat(listB,listC,listD,this.listE); //合并所有车辆,取消车辆除外
				
				this.count = listA.length || 0;
				this.total = showAllList.length;
				

				this.listA = listA;
				this.listB = listB;
				this.listC = listC;
				this.listD = listD;
				this.listF = listF;

			},
			getEditData() {
				
				let setTime = uni.getStorageSync('setTime')
				let cacheTime = uni.getStorageSync('cacheTime');
				
				if(cacheTime && setTime) {
					//判断当天时间是否超过缓存时间
					if (new Date().getTime() - setTime > cacheTime) {
						uni.removeStorageSync('plateList');
						uni.removeStorageSync('setTime');
						uni.removeStorageSync('cacheTime');
					}
				}
				
				//获取新增工单数据
				this.listE = uni.getStorageSync('plateList') || [];
				
				this.total = this.listA.concat(this.listB,this.listC,this.listD,this.listE).length;
				
				
			},
			async saveCarOrder() {
				// console.log("保存工单");
				


				//判断是否为主账号
				if(this.isParent) {
					//判断作业最大值没有改动或有没有新增数据
					if(this.originalMaxCapacity == this.maxCapacity && this.listE.length < 1) return uni.showToast({ title: '作业最大值没有改动或没有新增数据！', icon: 'none', duration: 2000 });
					
				} else {
					
					//判断有没有新增数据
					if(this.listE.length < 1) return uni.showToast({ title: '没有新增数据！', icon: 'none', duration: 2000 });
					
				}
				
				if(!this.maxCapacity || this.maxCapacity == '') return uni.showToast({ title: '没有设置最大作业值！', icon: 'none', duration: 2000 });
				
				
				let carList = this.listA.concat(this.listB,this.listC,this.listD);
				
				let carIndex = carList.length;
				
				//设置跳出循环结束执行
				let flag = true;
				
				for (let i = 0; i < this.listE.length; i++) { 

					if(this.listE[i].editPlate.isEdit) {
						
						let title = '没有勾选第'+(carIndex + i + 1) +'条新增数据！';
						
						uni.showToast({ title: title, icon: 'none', duration: 2000 });
						
						flag = false;
						
						break
					}
				    
				 }
				 
				 if(!flag) return;
				 
				 
				 
				 let setTime = uni.getStorageSync('setTime')
				 
				 var setDate = jutils.formatDate(new Date(setTime),"YYYY-MM-DD");
				 var currentDate = jutils.formatDate(new Date(new Date().getTime()),"YYYY-MM-DD");
				 
				 //判断当天时间是否超过缓存时间
				 if (setTime && (setDate !== currentDate)) {
				 	uni.removeStorageSync('plateList');
				 	uni.removeStorageSync('setTime');
				 	uni.removeStorageSync('cacheTime');
				 	
				 	//获取新增工单数据
				 	this.listE = uni.getStorageSync('plateList') || [];
				 	
				 	return uni.showToast({ title: '数据已过期,请提交当天数据!', icon: 'none', duration: 2000 });
				 }

				
				//获取时间 时间为今天的时间
				let date = new Date();
				date.setDate(date.getDate());
				let Y = date.getFullYear() + '-';
				let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
				let D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
				
				
				let workDate = Y+M+D;

				
				let allList = carList.concat(this.listE);
				
				let query = {
				  "carList": allList,
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
				
				uni.showToast({ title: res.data.msg, icon: 'success', duration: 2000 });
				
				uni.removeStorageSync('plateList');
				
				//1.5秒后重新刷新页面
				setTimeout(() => {
					location.reload()
				},1500);
				
				
			},
			toSearch() {
				
				uni.navigateTo({
					url: '/pages/search/search?orderSn=' + this.orderSn
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	//scoped css只在当前页生效 不影响子组件
	page {
		// background-color: #efeff4;
		background-color: #ededed;
	}

	// @media (prefers-color-scheme: dark) {
	// 	page {
	// 		background-color: #000000;
	// 	}
	// }

	// .content {

	// }
	.wrapper {
		position: relative;
	}

	.cu-modal {
		z-index: 999;
	}

	.total-wrap {
		position: sticky;
		top: 45px;
		display: flex;
		height: 90rpx;
		padding: 0 30rpx 0 20rpx;
		background: #ffffff;
		justify-content: center;
		align-items: center;
		border-top: 1rpx solid #f1f1f1;
		z-index: 112;
		text-align: center;

		.icon-add-order {
			display: inline-block;
			position: absolute;
			top: 30rpx;
			left: 30rpx;
			width: 32rpx;
			height: 32rpx;
		}

		.date {
			display: inline-block;
			font-size: 34rpx;
			font-weight: bold;
			color: #000000;
		}

		.total {
			display: inline-block;
			position: absolute;
			top: 25rpx;
			right: 30rpx;
			height: 30rpx;
			padding: 6rpx 23rpx;
			background: #DFF8E5;
			border: 2rpx solid #A7EFB9;
			border-radius: 20rpx;
			font-size: 28rpx;
			font-weight: 400;
			color: #00A82B;
			align-items: center;
		}
		.search-form {
			margin: 0 20%;
		}
	}


	.content {
		margin-top: 30rpx;

		.btn-toggle {
			height: 50rpx;
			line-height: 50rpx;
			margin: 20rpx 25rpx 0 20rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #666666;
			text-align: center;
			background-color: #f7f7f7;

			.icon-arrow {
				display: inline-block;
				width: 10rpx;
				height: 17rpx;
				margin-right: 10rpx;
			}
		}

		.toggle-wrap {
			display: none;
			transform: translateY(100);
			transition: 1s ease;

			&.show {
				display: block;
				transform: translateY(0);
			}
		}
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.carbar {
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

	.custom {
		padding: 36rpx 30rpx 36rpx 25rpx;
		background: #FFFFFF;
		margin-bottom: 10rpx;
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

			.icon-submit {}

			.icon-delete {}
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
		z-index: 997;

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
