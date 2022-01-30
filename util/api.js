// let BASE_URL = 'http://192.168.0.192:8001/dev-api';
let BASE_URL = 'https://shyq.winzkj.com/prod-api';
// let BASE_URL = 'http://test.winzkj.com/prod-api';

let API_URL = {
	baseUrl: BASE_URL,

	//登录
	loginUrl: BASE_URL + "/companyLogin",
	//获取首页工单
	queryIndexOrderUrl: BASE_URL + "/company/queryIndexOrder",
	//保存危运车工单
	saveWorkOrderUrl: BASE_URL + "/workOrder/save",
	//查询工单列表
	workOrderListUrl: BASE_URL + "/workOrder/queryListByYearMonth",
	//工单车辆已完成
	orderCarFinishUrl: BASE_URL + "/workOrder/orderCarFinish",
	//工单车辆取消
	orderCarCancelUrl: BASE_URL + "/workOrder/orderCarCancel",
	//发送就位短信
	sendInPlaceSmsUrl: BASE_URL + "/workOrder/sendInPlaceSms",
	//发送通知短信
	sendInFormSmsUrl: BASE_URL + "/workOrder/sendInFormSms",
	//根据工单号查询工单车辆列表
	queryCarListByOrderSnUrl: BASE_URL + "/workOrder/queryCarListByOrderSn",
	//获取个人中心信息
	getIndexInfo: BASE_URL + "/company/info",
	//获取首页工单
	getUserOrder: BASE_URL + "/company/queryIndexOrder",
	//保存危运车工单
	saveVisitOrder: BASE_URL + "/visitOrder/save",

	//查询所有工单列表
	queryAllCarList: BASE_URL + "/visitOrder/queryAllCarList",
	//根据工单号查询工单车辆列表
	queryCarListByOrderSn: BASE_URL + "/visitOrder/queryCarListByOrderSn",
	//查询工单车辆列表
	queryCarList: BASE_URL + "/visitOrder/queryCarList",


	//根据年月查询作业记录列表
	queryJobRecordListUrl: BASE_URL + "/workOrder/queryJobRecordListByYearMonth",
	//根据工单号查询作业记录完成列表
	queryJobRecordListInfoByOrderSnUrl: BASE_URL + "/workOrder/queryJobRecordListInfoByOrderSn",
	//判断是否有明天的工单
	checkHasTomorrowOrderUrl: BASE_URL + "/company/checkHasTomorrowOrder",
	//工单车辆排序
	orderCarSortUrl: BASE_URL + "/workOrder/orderCarSort",
	//退出登录
	logoutUrl: BASE_URL + "/logout",

	//根据车牌搜索车辆
	searchByPlateUrl: BASE_URL + '/company/indexOrderSolr'


};

export default API_URL
