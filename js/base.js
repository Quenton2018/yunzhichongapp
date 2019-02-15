var apiHost = "http://api.jx9n.com";
//apiHost = "http://39.106.62.16:8181";
//apiHost = "http://192.168.1.17:8181";
var appVersion = "v3.1.1"; //app当前版本

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

function checkNumber(theObj) {
	var reg = /^[0-9]+.?[0-9]*$/;
	if(reg.test(theObj)) {
		return true;
	}
	return false;
}

Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

function getHeadImg(img) {
	return vaildeParam(img) ? img : "../img/user_profile/app_10.png";
}

/**
 * 参数校验
 */
function vaildeParam(param) {
	if(typeof param == 'undefined') {
		return false;
	}
	if(undefined == param) {
		return false
	}
	if(null == param) {
		return false;
	}
	if(param.length == 0) {
		return false;
	}
	return true;
}

/**
 * 发送跨域请求
 * @param {Object} url 接口地址
 * @param {Object} data 参数连接的方式
 * @param {Object} callback 回调函数
 */
function postJSON(url, data, callback) {
	url += "?" + postDataFormat(data);
	console.log("## postJSON ## url : " + url)
	var load_index = layer.load();
	var xhr = new plus.net.XMLHttpRequest();
	xhr.onreadystatechange = function() {
//		console.log("## postJSON ## readyState : " + xhr.readyState)
		switch(xhr.readyState) {
			case 4:
				if(xhr.status == 200) {
					var responseText = xhr.responseText;
					console.log("## postJSON ## responseText : " + responseText)
					// var json = eval("(" + responseText + ")");
					var json = JSON.parse(responseText);
					callback(json);
				} else {
					// layer.msg("请求失败");
				}
				layer.close(load_index);
				break;
			default:
				break;
		}
	}
	xhr.open("POST", url, true);
	xhr.send(null);
}

function postJSONNoIcon(url, data, callback) {

	url += "?" + postDataFormat(data);

	console.log("## postJSONNoIcon ## url : " + url)
	var xhr = new plus.net.XMLHttpRequest();
	xhr.onreadystatechange = function() {
//		console.log("## postJSON ## readyState : " + xhr.readyState)
		switch(xhr.readyState) {
			case 4:
				if(xhr.status == 200) {
					var responseText = xhr.responseText;
					console.log("## postJSON ## responseText : " + responseText)
					var json = eval("(" + responseText + ")");
					//console.log("## postJSON ## json : " + json)
					callback(json);
				} else {
					// layer.msg("请求失败");
				}
				break;
			default:
				break;
		}
	}
	xhr.open("POST", url, true);
	xhr.send(null);
}

/**
 * 登录校验
 */
function checkLogin(page) {

	try {
		mui.plusReady(function() {
			document.addEventListener('netchange', wainshow, false);
		});
	} catch(e) {

	}

	function wainshow() {
		if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
			layer.msg("网络异常，请检查网络设置！");
		} else {

		}
	}

	setInterval(wainshow, 5000);

	var uuid = plus.storage.getItem("uuid");
	var mobile = plus.storage.getItem("mobile");
	var loginDate = plus.storage.getItem("login_date");

	console.log("## checkLogin ## uuid : " + uuid);
	console.log("## checkLogin ## mobile : " + mobile);
	console.log("## checkLogin ## loginDate : " + loginDate);

	if(!vaildeParam(uuid) || !vaildeParam(mobile) || !vaildeParam(loginDate)) {
		if(vaildeParam(page)) {
			clicked(page, true, false);
		} else {
			clicked('login.html', true, false);
		}
	}

}

/**
 * 保存登入数据
 * @param {Object} userID
 * @param {Object} mobile
 */
function setLoginData(uuid, mobile) {

	console.log("## setLoginData ## uuid : " + uuid);
	console.log("## setLoginData ## mobile : " + mobile);
	var date = formatDate(new Date(), "yyyy-mm-dd HH-mm-ss");
	console.log("## setLoginData ## date : " + date);

	plus.storage.setItem("uuid", uuid);
	plus.storage.setItem("mobile", mobile);
	plus.storage.setItem("login_date", date);

}

function clearLogin() {
	plus.storage.clear();
}

/**
 * 打印对象
 * @param {Object} obj
 */
function writeObj(obj) {
	var description = "";
	for(var i in obj) {
		var property = obj[i];
		description += i + " = " + property + "\n";
	}
	console.log(description);
}

// post请求
// 格式化 post 传递的数据
function postDataFormat(obj) {
	if(typeof obj != "object") {
		alert("输入的参数必须是对象");
		return;
	}
	// 不支持FormData的浏览器的处理 
	var arr = new Array();
	var i = 0;
	for(var attr in obj) {
		arr[i] = encodeURIComponent(attr) + "=" + encodeURIComponent(obj[attr]);
		i++;
	}
	return arr.join("&");
}

/** 美化时间显示*/
function jsDateDiff(publishTime) {
	var d_minutes, d_hours, d_days;
	var timeNow = parseInt(new Date().getTime() / 1000);
	var d;
	d = timeNow - publishTime;
	d_days = parseInt(d / 86400);
	d_hours = parseInt(d / 3600);
	d_minutes = parseInt(d / 60);
	if(d_days > 0 && d_days < 4) {
		return d_days + "天前";
	} else if(d_days <= 0 && d_hours > 0) {
		return d_hours + "小时前";
	} else if(d_hours <= 0 && d_minutes > 0) {
		return d_minutes + "分钟前";
	} else if(d_days <= 0 && d_hours <= 0 && d_minutes <= 0) {
		return parseInt(d, 10) + "秒前";
	} else {
		var s = new Date(publishTime * 1000);
		return s.getFullYear() + "年" + (s.getMonth() + 1) + "月" + s.getDate() + "日";
	}
}

/**
 * 日期格式化
 * @param {Object} date
 * @param {Object} str
 */
function formatDate(date, str) {
	var mat = {};
	mat.M = date.getMonth() + 1; //月份记得加1
	mat.H = date.getHours();
	mat.s = date.getSeconds();
	mat.m = date.getMinutes();
	mat.Y = date.getFullYear();
	mat.D = date.getDate();
	mat.d = date.getDay(); //星期几
	mat.d = check(mat.d);
	mat.H = check(mat.H);
	mat.M = check(mat.M);
	mat.D = check(mat.D);
	mat.s = check(mat.s);
	mat.m = check(mat.m);
	console.log(typeof mat.D)
	if(str.indexOf(":") > -1) {　　　　　
		mat.Y = mat.Y.toString().substr(2, 2);　　　　
		return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + ":" + mat.m + ":" + mat.s;
	}
	if(str.indexOf("/") > -1) {
		return mat.Y + "/" + mat.M + "/" + mat.D + " " + mat.H + "/" + mat.m + "/" + mat.s;
	}
	if(str.indexOf("-") > -1) {
		return mat.Y + "-" + mat.M + "-" + mat.D + " " + mat.H + "-" + mat.m + "-" + mat.s;
	}
}

/**
 * 检查是不是两位数字，不足补全
 * @param {Object} str
 */
function check(str) {
	str = str.toString();
	if(str.length < 2) {
		str = '0' + str;
	}
	return str;
}

function getTimeDiffString(timeFiff) {
	console.log("## getTimeDiffString ## timeFiff:" + timeFiff)

	var days = Math.floor(timeFiff / (24 * 3600 * 1000));
	//计算出小时数
	var leave1 = timeFiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000))
	console.log("## getTimeDiffString ## hours:" + hours)

	//计算相差分钟数
	var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000))
	console.log("## getTimeDiffString ## minutes:" + minutes)

	//计算相差秒数
	var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
	var seconds = Math.round(leave3 / 1000)
	console.log("## getTimeDiffString ## seconds:" + seconds)

	var res = '';

	if(seconds > 0) {
		res = seconds + " 秒" + res;
	}

	if(minutes > 0) {
		res = minutes + "分钟 " + res
	}

	if(hours > 0) {
		res = hours + "小时 " + res
	}

	if(days > 0) {
		res = days + "天 " + res
	}
	console.log("## getTimeDiffString ## res:" + res)

	return res;
}

function getTimeDiff(time) {
	console.log("## getTimeDiff ## time:" + time)
	var date2 = new Date();
	var date3 = date2.getTime() - time;
	return getTimeDiffString(date3);
}

function loadImage(url, callback) {

	console.log("## loadImage ## url:" + url)

	var img = new Image(); //创建一个Image对象，实现图片的预下载
	img.src = url;

	if(img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
		console.log("## loadImage ## complete")
		callback.call(img);
		return; // 直接返回，不用再处理onload事件
	}
	img.onload = function() { //图片下载完毕时异步调用callback函数。
		console.log("## loadImage ## onload")
		callback.call(img); //将回调函数的this替换为Image对象
	};
}

function randomString(len) {
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
	var maxPos = $chars.length;
	var pwd = '';
	for(i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

/**
 * 上传用户登入信息,并且校验是否多台设备登入
 */
function uploadLoginInfo(loginPagePath) {
	checkLogin(loginPagePath);

	setInterval(function() {
		var uuid = plus.storage.getItem("uuid");
		if(vaildeParam(uuid)) {

			var osName = plus.os.name;
			var deviceModel = plus.device.model;
			var deviceUuid = plus.device.uuid;

			var clientInfo = plus.push.getClientInfo().clientid;

			console.log("## uploadLoginInfo ## uuid:" + uuid);
			console.log("## uploadLoginInfo ## osName:" + osName);
			console.log("## uploadLoginInfo ## deviceModel:" + deviceModel);
			console.log("## uploadLoginInfo ## deviceUuid:" + deviceUuid);
			console.log("## uploadLoginInfo ## clientInfo:" + JSON.stringify(plus.push.getClientInfo()));
			console.log("## uploadLoginInfo ## clientInfo:" + clientInfo);

			var data = {
				"uuid": uuid,
				"osName": osName,
				"deviceModel": deviceModel,
				"clientInfo": clientInfo,
				"deviceUuid": deviceUuid
			}
			postJSONNoIcon(API_URL.updateLoginInfo, data, function(res) {
				if("0" == res.code) {
					console.log("上传用户登录信息成功")
				} else if('6003' == res.code) {
					layer.msg('您的账号已在在另一设备登录，您强制下线,正在跳转登录页面...');
					setTimeout(function() {
						clearLogin();
						checkLogin(loginPagePath);
					}, 2000)
				} else {
					// layer.msg(res.msg);
				}
			})
		}

	}, 5000)

}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

/**
 * wgt html/css/js
 * wgtu 差量更新,需要对照appStore或应用宝中的升级
 */
function heatUpdate(appType) {
	appType = appType + "HeatUpdate";
	postJSONNoIcon(API_URL.AppVersionGetNewest, {
		'appType': appType
	}, function(res) {
		if('0' == res.code && vaildeParam(res.data)) {
			if(compareVersion(res.data.version)) {
				plus.nativeUI.confirm('检测到新版本,是否更新?', function(e) {
					if(e.index == 0) {
						console.log('检测到新版本更新');
						downloadWgt(res.data.url);
					}
				});
			}
		}
	});
}

function compareVersion(version) {
	if(!vaildeParam(version)) {
		console.log('版本号不能为空');
		return false;
	}
	if(!version.startsWith('v') || version.length == 1) {
		console.log('错误的版本号');
		return false;
	}

	var array1 = version.substr(1).split('.');
	var array2 = appVersion.substr(1).split('.');
	var len = Math.min(array1.length, array2.length);
	var index = 0,
		diff = 0;
	while(index < len &&
		(diff = parseInt(array1[index]) - parseInt(array2[index])) == 0) {
		index++;
	}
	return diff == 0 ? array1.length - array2.length : diff > 0;
}

function downloadWgt(url) {
	var showLoading = plus.nativeUI.showWaiting(' 正在下载...... ');

	var downloadTask = plus.downloader.createDownload(url, {
		filename: '_doc/update/'
	}, function(d, status) {
		plus.nativeUI.closeWaiting();
		if(status == 200) {
			installWgt(d.filename);
		} else {
			plus.nativeUI.alert('下载升级文件失败！');
		}
	});
	downloadTask.start();

	var count = 0;
	downloadTask.addEventListener('statechanged', function(task, status) {
		switch(task.state) {
			case 1:

				break;
			case 2:
				showLoading.setTitle(" 已连接到服务器 ...... ");
				break;
			case 3:
				var prg = parseInt(parseFloat(task.downloadedSize) / parseFloat(task.totalSize) * 100);
				if(count < prg) {
					count = prg;
					showLoading.setTitle(' 正在下载 ' + count + '% ...... ');
				}
				break;
			case 4:
				break;
			default:
				break;
		}
	});
}

function installWgt(path) {
	plus.nativeUI.showWaiting('正在安装...');

	plus.runtime.install(path, {
		force: true
	}, function() {
		plus.nativeUI.closeWaiting();
		console.log('安装wgt文件成功！');

		plus.nativeUI.alert('应用资源更新完成！', function() {
			plus.runtime.restart();
		});
	}, function(e) {
		plus.nativeUI.closeWaiting();
		console.log('安装wgt文件失败[' + e.code + ']：' + e.message);
		plus.nativeUI.alert('应用资源更新失败' + e.message);
	});
}