//var apiHost = "http://api.jx9n.com";
apiHost = "http://39.106.62.16:8181";
if(!window.plus){
	apiHost = "http://192.168.1.52:3000"
}
//apiHost = "http://192.168.1.17:8181";
var appVersion = "v3.2"; //app当前版本

var API_URL = {};
API_URL.ApiSmsSendCode = apiHost + "/api/sms/sendCode"; //发送短信接口
API_URL.ApiMemberRegister = apiHost + "/api/member/register"; //注册接口
API_URL.ApiMemberLogin = apiHost + "/api/member/login"; //登录接口
API_URL.ApiMemberInfo = apiHost + "/api/member/info"; //获取用户信息
API_URL.ApiMemberNeedGuide = apiHost + "/api/member/needGuide"; // 用户是否需要新手引导
API_URL.APIfMemberForgetThePassword = apiHost + "/api/member/forgetThePassword"; //重置密码
API_URL.APIMemberModifyPassword = apiHost + "/api/member/modifyPassword"; //修改密码
API_URL.APIFeedbackSaveFeedback = apiHost + "/api/feedback/saveFeedback"; //反馈报修
API_URL.APISaveapplyChargingPile = apiHost + "/api/applyChargingPile/saveapplyChargingPile"; //用户申请建桩
API_URL.APIfMemberForgetThePassword = apiHost + "/api/member/forgetThePassword";
API_URL.ApiArticleContentBYID = apiHost + "/api/article/getArticleByCategoryTwoId";
API_URL.ApiArticleContentBYName = apiHost + "/api/article/getArticleByName";
API_URL.ApiChargingInfo = apiHost + "/api/charging/info"; //获取充电桩信息
API_URL.ApiChargingInfoByShellId = apiHost + "/api/charging/infoByShellId"; //获取充电桩信息
API_URL.ApiChargingSocketListByCode = apiHost + "/api/chargingSocket/listByCode"; //获取充电桩插座列表
API_URL.ApiCharginGetPriceListByChargingCode = apiHost + "/api/charging/getPriceListByChargingCode"; //获取充电桩片区价格
API_URL.ApiCharginGetPriceListByGroupID = apiHost + "/api/charging/getPriceListByGroupID"; //获取充电桩片区价格
API_URL.ApiChargingPriceDesc = apiHost + "/api/charging/getChargingPriceDesc"; // 充电桩价格描述
API_URL.ApiDeviceCommandSendChargeCommand = apiHost + "/api/DeviceCommand/sendChargeCommand"; //下发充电
API_URL.ApiUserChargingDetailGetDoingCount = apiHost + "/api/userChargingDetail/getDoingCount"; //用户正在执行订单数量
API_URL.ApiUserChargingDetailGetDoingList = apiHost + "/api/userChargingDetail/getDoingList"; //用户正在执行订单
API_URL.ApiUserChargingDetailGetUserList = apiHost + "/api/userChargingDetail/getUserList"; //用户充电订单
API_URL.ApiUserChargingDetailGetChargeOrder = apiHost + "/api/userChargingDetail/order"; // 用户订单详情
API_URL.ApiDictionaryManageGetDmList = apiHost + "/api/dictionaryManage/getDmList"; //数据字典
API_URL.ApiArticleCategoryList = apiHost + "/api/article/getArticleCategoryList"; //获取文章分类
API_URL.updateLoginInfo = apiHost + "/api/member/updateLoginInfo"; //更新用户登录信息
API_URL.ApiCarouselImageGetCarouselImage = apiHost + "/api/carouselImage/getCarouselImage"; //获取轮播图
API_URL.ApiMessageGetMessageList = apiHost + "/api/message/getMessageList"; //获取消息列表
API_URL.ApiMessageGetMessageText = apiHost + "/api/message/getMessageText"; //获取消息列表
API_URL.ApiMessageGetMessageByID = apiHost + "/api/message/getMessageById"; //获取消息
API_URL.ApiRecharGetRechargeConfigurationList = apiHost + "/api/recharge/getRechargeConfigurationList"; //获取充值数据

API_URL.ApiUploadPicture = apiHost + "/api/member/uploadPicture"; //用户上传头像数据
API_URL.ApiUpdateMemberInfo = apiHost + "/api/member/updateMemberInfo"; //用户上传信息
API_URL.ApiChargingGroupGetNearList = apiHost + "/api/chargingGroup/getNearList"; //根据定位，获取附近的充电桩
API_URL.ApiChargingGroupGetNearChargingAndPrices = apiHost + "/api/chargingGroup/getNearChargingAndPrices"; // 获取附近的充电桩和价格
API_URL.ApiGetChargingByGroupID = apiHost + "/api/charging/getChargingByGroupID"; //根据片区，获取充电桩
API_URL.ApiSearchChargingGroup = apiHost + "/api/chargingGroup/searchChargingGroup"; // 搜索充电片区

API_URL.ApiDetailRecordGetDetailRecordList = apiHost + "/api/detailRecord/getDetailRecordList"; //获取明细记录列表

API_URL.ApiInvitationLogGetInvitationStatistics = apiHost + "/api/invitationLog/getInvitationStatistics"; //获取邀请统计数据
API_URL.ApiInvitationLogGetInvitationList = apiHost + "/api/invitationLog/getInvitationList"; //获取邀请列表

API_URL.ApiUserSignClickSign = apiHost + "/api/userSign/clickSign"; //用户签到

API_URL.AppVersionGetNewest = apiHost + "/api/AppVersion/getNewest";

API_URL.ApiPayAlipay = apiHost + '/api/pay/alipay'; //支付宝支付
API_URL.ApiPayWx = apiHost + '/api/pay/wxpay'; //微信支付

/** 商城接口 */
API_URL.ApiProductGetProductList = apiHost + "/api/product/getProductList"; //获取商城列表
API_URL.ApiProductGetProductById = apiHost + "/api/product/getProductById";
API_URL.ApiProductGetProductOrdersList = apiHost + "/api/productOrders/getProductOrdersList"; //获取用户订单

API_URL.ApiProductOrdersAddProductOrders = apiHost + "/api/productOrders/addProductOrders";

API_URL.ApiMemberCardGetCardList = apiHost + "/api/iccard/list"; // 获取用户IC卡
API_URL.ApiMemberCardBindingCard = apiHost + "/api/iccard/binding"; // 绑定IC卡
API_URL.ApiMemberCardUnBindingCard = apiHost + "/api/iccard/unbinding"; // 解除绑定IC卡

/** 一代产品的接口 */
API_URL.PSMSMFMiddlewareGetlist = apiHost + "/api/oldProducts/getlist"; //获取插座和价钱
API_URL.PSMSMFMiddlewareCharging = apiHost + "/api/oldProducts/charging"; //充电

var PAGE_URL = {};
PAGE_URL.INVITATION = apiHost + '/page/view/invitation' //邀请页面

API_URL.GetChargingGroup = apiHost + "/api/chargingGroupSearch/getChargingGroup";
API_URL.GetNearChargingGroup = apiHost + "/api/chargingGroupSearch/getNearChargingGroup";
API_URL.SearchChargingGroup = apiHost + "/api/chargingGroupSearch/searchChargingGroup";
//结束充电
API_URL.TrunOffCharge = apiHost + "/api/DeviceCommand/trunOffCharge";

/**
 * plus公共工具类
 * @class plusUtils
 */
var plusUtils = {};

/**
 * nativeUI组件
 */
plusUtils.nativeUI = {
	/**
	 * @param {String} message 必选 提示对话框上显示的内容
	 * @param {Object} alertCB 可选 提示对话框上关闭后的回调函数
	 * @param {Object} title   可选 提示对话框上显示的标题
	 * @param {Object} buttonCapture 必选 提示对话框上按钮显示的内容
	 */
	alert:function(message, alertCB, title, buttonCapture){
		return plus.nativeUI.alert(message, alertCB, title, buttonCapture);
	}
}
/**
 * 本地存储
 */
plusUtils.Storage = {
	getItem:function(key){
		if(window.plus){
			return plus.storage.getItem(key);
		}else{
			return localStorage.getItem(key);
		}		
	},
	setItem:function(key,value){
		if(typeof value == "number"){
			value = value.toString();
		}
		if(window.plus){
			return plus.storage.setItem(key,value);
		}else{
			return localStorage.setItem(key,value);
		}
	},
	removeItem:function(key){
		if(window.plus){
			return plus.storage.removeItem(key);
		}else{
			return localStorage.removeItem(key);
		}		
	},
	clear:function(){
		if(window.plus){
			return plus.storage.clear();
		}else{
			return localStorage.clear();
		}		
	}
}
/**
 * 页面初始化
 * @param {Object} readyCallback
 */
plusUtils.pageReady = function(readyCallback){
	if(typeof readyCallback != "function") return false;
	if(mui.os.plus){
		mui.plusReady(readyCallback)
	}else{
		mui.ready(readyCallback);
	}
}
/**
 * 分享组件
 */
plusUtils.Share = {
	shares:null,
	init:function(){
		var slef = this;
		// 更新分享服务  
	    plus.share.getServices(function(s) {  
	        slef.shares = {};  
	        for(var i in s) {  
	            var t = s[i];  
	            slef.shares[t.id] = t;  
	        }  
	    }, function(e) {  
	        plusUtils.nativeUI.alert("无享服务！");  
	        console.log("获取分享服务列表失败：" + e.message);  
	    });
	},
	/**  
	 * 发送分享消息  
	 * @param {JSON} msg  
	 * @param {plus.share.ShareService} s  
	 */   
    shareMessage:function(msg, s) {  
        s.send(msg,function() {  
            console.log("分享到\"" + s.description + "\"成功！ ");  
        }, function(e) {  
            plusUtils.nativeUI.alert("分享到\"" + s.description + "\"失败！ ");  
            console.log("分享到\"" + s.description + "\"失败: " + JSON.stringify(e));  
        });  
    },
    /**  
	 * 分享操作  
	 * @param {JSON} sb 分享操作对象s.s为分享通道对象(plus.share.ShareService)  
	 * @param {Boolean} ishref 是否分享链接  
	 * @param {JSON} config 分享内容  
	 */  
	shareAction:function (sb,config) {
		var self = this;
	    if(!sb || !sb.s) {  
	        plusUtils.nativeUI.alert("无效的分享服务！");  
	        return;  
	    }  
	    var msg = {
	    	content: config.content,
	    	title:config.title,
	    	href:config.href,
	    	content:config.content,
	    	thumbs:config.thumbs,
	    	extra: {scene: sb.scene } 
	    };
	    // 发送分享  
	    if(sb.s.authenticated) {  
	        console.log("---已授权---");  
	        self.shareMessage(msg, sb.s);  
	    } else {  
	        console.log("---未授权---");  
	        sb.s.authorize(function() {  
	            self.shareMessage(msg, sb.s);  
	        }, function(e) {  
	            console.log("认证授权失败：" + e.code + " - " + e.message);  
	        });  
	    }  
	},
	/**  
	 * 分享内容或者链接  
	 * @param  {JSON} config 分享数据的对象  
	 * @param  {Boolean} isSheet  是否弹出分享列表  
	 */  
	appshare:function (config,isSheet,index) { 
		var self = this;
	    var msginfo = {title: config.title, href: config.href, content: config.content, thumbs: config.thumbs};  
	    var shareBts = [];  
	    // 更新分享列表  
	    var ss = self.shares['weixin'];  
	    ss && ss.nativeClient && shareBts.push({ title: '微信好友', s: ss, scene: 'WXSceneSession' }),(shareBts.push({ title: '微信朋友圈', s: ss, scene: 'WXSceneTimeline' }));  	
	    ss = self.shares['qq'];  
	    ss && ss.nativeClient && shareBts.push({ title: 'QQ', s: ss });  	
		if(isSheet){
			// 弹出分享列表  
		    shareBts.length > 0 ? plus.nativeUI.actionSheet({  
		            title: '分享',  
		            cancel: '取消',  
		            buttons: shareBts  
		        },  
		        function(e) {  
		            (e.index > 0) && self.shareAction(shareBts[e.index - 1], msginfo);  
		        }  
		    ) : plusUtils.nativeUI.alert('当前环境无法支持分享操作!');  
		}else{
			self.shareAction(shareBts[index], msginfo);
		}
	}
};
//页面对象
plusUtils.appPage = {
	//获取页面参数
	getParam: function(name) {
		var ws = plus.webview.currentWebview();
		if(mui.os.plus) {
			if(ws.params)
				return ws.params[name] || null;
			else
				return null;
		} else {
			return null;
		}
	},
	//执行上个窗口某个方法
	openerEvalJS:function(){
		if(mui.os.plus){
			var ws = plus.webview.currentWebview();
			var wo = ws.opener();
			wo.evalJS('dataRefresh()');
		}
	},
	//关闭当前页
	close: function() {
		if(mui.os.plus){
			var ws = plus.webview.currentWebview();
			plus.webview.close(ws);
		}
	},
	//关闭当前页，并跳转到指定页
	closeAndBackUrl: function(url, param) {
		if(mui.os.plus){
			var ws = plus.webview.currentWebview();
	//		plus.webview.close(ws);
			setTimeout(function(){
				ws.close("none");
			},1500);
			openNewWebview(url, param);
		}
	}
}
/**
 * @description 新开窗口
 * @param {URIString} target  需要打开的页面的地址
 * @param {Object} params 传递的对象
 * @param {Boolean} autoShow 是否自动显示
 * @example openNewWebview({URIString});
 * */
function openNewWebview(target, params, autoShow) {
	var isAutoShow = autoShow || true;
	console.log(" target=" + target + " params=" + JSON.stringify(params) + " isAutoShow=" + isAutoShow);
	mui.openWindow({
		url: target,
		id: target,
		show: {
			autoShow: isAutoShow, //页面loaded事件发生后自动显示，默认为true
			aniShow: 'pop-in'
		},
		waiting: {
			autoShow: false
		},
		extras: {
			params: params
		}
	})
}