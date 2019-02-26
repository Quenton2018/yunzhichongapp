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
 * 下拉刷新
 * @param {Object} plusReady
 * @param {Object} pageRefresh
 */
var plusRefresh = function(pageRefresh) {
	var topoffset = 0 + 'px';
	var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
    if (ms && ms.length >= 3) {
        topoffset = parseFloat(ms[2]) + 45 + 'px';
    }
	if(window.plus){
		if (plus.navigator.isImmersedStatusbar()) {
    		topoffset = Math.round(plus.navigator.getStatusbarHeight()) + 45 +'px';
		}
	}
	mui.init({
	  	pullRefresh : {
	    	container:".mui-content",
	    	down : {
		      	style:'circle',
		      	offset:topoffset, 
		      	callback :throttle(onRefresh,1000) 
	    	}
	  	}
	});
    // 刷新页面
    function onRefresh(){
        console.log("### onRefresh ###");
        pageRefresh && pageRefresh();
        mui('.mui-content').pullRefresh().endPulldownToRefresh();
    }
}
/**
 * 上拉刷新下拉加载
 * @param {Object} downCallback
 * @param {Object} upCallback
 */
var pullRefresh = function(downCallback,upCallback){
	mui.init({
    	pullRefresh: {
			container: '#J_refresh',
			down: {
				style:'circle',
				offset: '75px',
				callback: function() {
					mui('#J_refresh').pullRefresh().refresh(true);
					mui('#J_refresh').pullRefresh().endPulldownToRefresh();
					downCallback && downCallback();								
				}
			},
    		up: {
    			callback: function(){
    				setTimeout(function() {
    					upCallback && upCallback();	
    				}, 300);
    			}
    		}
    	}
    });
}
/**
 * 停止刷新数据
 * @param {Object} length
 * @param {Object} pageSize
 */
var stopRefresh = function(length,pageSize){
	if(length && pageSize){
		mui('#J_refresh').pullRefresh().endPullupToRefresh(length < pageSize);
	}else{
		mui('#J_refresh').pullRefresh().endPullupToRefresh(true);
	}	
}
/**
 * 启用刷新
 */
var enableRefresh = function(){
	mui('#J_refresh').pullRefresh().refresh(true);
}
;(function(w){
	// 空函数
	function shield(){
		return false;
	}
	document.addEventListener('touchstart',shield,false);//取消浏览器的所有事件，使得active的样式在手机上正常生效
	document.oncontextmenu = shield;//屏蔽选择函数
	// H5 plus事件处理
	w.uuid = null;
	var ws = null,as = 'pop-in';
	function plusReady(){
		w.uuid = plusUtils.Storage.getItem("uuid");
		console.log("###uuid##"+uuid);
		ws = plus.webview.currentWebview();
		// Android处理返回键
		plus.key.addEventListener('backbutton',function(){
			back();
		},false);
	}
	if(w.plus){
		plusReady();
	}else{
		document.addEventListener('plusready',plusReady,false);
	}
	// DOMContentLoaded事件处理
	var domready = false;
	document.addEventListener('DOMContentLoaded',function(){
		if(!w.plus){
			w.uuid = plusUtils.Storage.getItem("uuid");
			console.log("###uuid##"+uuid);
		}
		domready = true;
		document.body.onselectstart=shield;
	},false);
	// 处理返回事件
	w.back = function(hide){
		if(w.plus){
			ws||(ws=plus.webview.currentWebview());
			if(hide||ws.preate){
				ws.hide('auto');
			}else{
				ws.close('auto');
			}
		}else if(history.length>1){
			history.back();
		}else{
			w.close();
		}
	};
	var openw = null,waiting=null;
	/**
	 * 打开新窗口
	 * @param {URIString} id : 要打开页面url
	 * @param {boolean} wa : 是否显示等待框
	 * @param {boolean} ns : 是否不自动显示
	 * @param {JSON} ws : Webview窗口属性
	 */
	w.openWebview = function(id,wa,ns,ws){
		if(openw){//避免多次打开同一个页面
			return null;
		}
		if(w.plus){
			wa&&(waiting=plus.nativeUI.showWaiting());
			ws = ws||{};
			ws.scrollIndicator||(ws.scrollIndicator='none');
			ws.scalable||(ws.scalable=false);
			openw = plus.webview.create(id,id,ws);
			ns||openw.addEventListener('loaded',function(){//页面加载完成后才显示
				setTimeout(function(){//延后显示可避免低端机上动画时白屏
					openw.show(as);
				},200);
			},false);
			openw.addEventListener('close',function(){//页面关闭后可再次打开
				openw = null;
			},false);
			return openw;
		}else{
			w.location.href = id;
		}
		return null;
	};
	/**
	 * 原生导航栏
	 * @param {Object} href
	 */
	w.openNativeTitle = function(href,extras,type){
		var titleType = type ? 'transparent' : 'default';
		//打开窗口的相关参数
		var options = {
			url:href,
			id:href,
			styles:{
				popGesture: "close",
				titleNView:{
					autoBackButton:true,
					backgroundColor:'#f47e13',
					titleColor:'#fff',
					type: titleType
				}
			},
			extras:extras || {}
		};	
		mui.openWindow(options);
	}
	/**
	 * @description 新开新窗口
	 * @param {URIString} target  需要打开的页面的地址
	 * @param {Object} params 传递的对象
	 * @param {Boolean} autoShow 是否自动显示
	 * @example openNewWebview({URIString});
	 * */
	w.openNewWebview = function (target, params, autoShow) {
		var isAutoShow = autoShow || true;
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
	/**
	 * 关闭当前窗口返回上个窗口并刷新
	 * @param {Object} page
	 */
	w.returnWindow = function(page){
	    var ws = plus.webview.currentWebview();
	    var wo = ws.opener();
	    do {
	    	if (wo.getURL().endsWith(page)) {
	    		break;
	    	}	
	    	var temp = wo.opener();
	    	wo.close("none");
	    	wo = temp;
	    } while (true);
		setTimeout(function() {
			wo.evalJS("dataRefresh()");
			ws.close();
		}, 300);
	}
})(window);

//检查定位  
//function checkPermissionPos() {
//	var Permission = 'authorized';
////  	Permission = plus.navigator.checkPermission('LOCATION');
//  console.log("## 获取定位权限 ##: "+ Permission)            
//  switch(Permission){
//      case 'authorized':
//			console.log('已开启定位权限');
//			getCurrentPosition();
//          break;
//      case 'denied':
//			console.log('已关闭定位权限');
//          openSystemPositionServer();
//          break;
//      case 'undetermined':
//          mui.alert('未确定定位权限', '定位消息');
//          break;
//      case 'unknown':
//          mui.alert('无法查询定位权限', '定位消息');
//          break;
//      default:
//			console.log('不支持定位权限');
//			openSystemPositionServer();
//          break;
//  }
//} 
//通过定位模块获取位置信息
function getCurrentPosition() {
	if(window.plus){
		plus.geolocation.getCurrentPosition(showPosition, function (e) {
			switch(e.code) {  
                case 1:  
                    mui.alert("GPS访问被拒绝 或 GPS未开启");  
                    break;  
                case 2:  
                    mui.alert("位置信息不可用");  
                    break;  
                case 3:  
                    mui.alert("获取用户位置的请求超时");  
                    break;  
                default:  
                    mui.alert(e.code+e.message);  
                    break;  
            } 
        	console.log("获取定位位置信息失败:"+e.message)
    	},{provider:'amap'});
	}else{
		if (navigator.geolocation){
    		navigator.geolocation.getCurrentPosition(showPosition);
    	}
	}
}
/**
 * 获取位置具体信息
 * @param position
 */
function showPosition(position) {
    var addresses = position.addresses;
    var longitude = position.coords.longitude;
    var latitude = position.coords.latitude;
    var province = '', city = '';
    try{
    	province = position.address.province;
    	city = position.address.city;
    }catch(e){
    	
    }
    var geolocationGroup = {
    	"province":province,
    	"city":city,
    	"addresses":addresses,
    	"longitude":longitude,
    	"latitude":latitude      	
    }
    console.log("## geoInf ## 位置具体信息 : " + JSON.stringify(geolocationGroup));
    plusUtils.Storage.setItem("geolocationGroup", JSON.stringify(geolocationGroup));
}
// 打开手机设置 -> 隐私 -> 定位
function openSystemPositionServer() {
	mui.alert("允许云智充获取位置权限，查找附近的充电桩，我们将按云智充隐私政策保护您的信息。不开启将影响使用云智充服务","开启定位服务","去开启",function(){
		//plus.runtime.openURL("App-Prefs:root=Privacy&path=LOCATION");
		if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
			plus.runtime.openURL("app-settings:LOCATION");
		} else if (/android/i.test(navigator.userAgent)) {
			var main = plus.android.runtimeMainActivity();
			var Intent = plus.android.importClass("android.content.Intent");
			var Settings = plus.android.importClass('android.provider.Settings');
			var mIntent = new Intent('Settings.ACTION_LOCATION_SOURCE_SETTINGS');
			main.startActivity(mIntent);
		}
	})
}
/**
 * 参数校验
 */
function vaildeParam(param) {
    if(typeof param == 'undefined'){
        return false;
    }
    if(undefined == param){
        return false
    }
    if(null == param){
        return false;
    }
    if(param.length == 0){
        return false;
    }
    return true;
}
/**
 * 发送跨域请求
 * @param {Object} url 接口地址
 * @param {Object} data 参数连接的方式
 * @param {Object} callback 回调函数
 * @param {Boolean} isIcon  选填（是否显示loging）
 */
function postJSON(url, data, callback,isIcon){
	if(navigator.plus){	
		if (plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
			toast("网络异常，请检查网络设置！");
			return false;
		}
		url += "?"+jsonToParams(data);
		if(!isIcon){
			showLoading("数据加载中..."); 
		}
		var xhr = new plus.net.XMLHttpRequest();	
		xhr.onreadystatechange = function () {
		    switch ( xhr.readyState ) {
		        case 4:       	
		            if ( xhr.status == 200 ) {
	            		var responseText = xhr.responseText;
	            		console.log("## postJSON ## url : "+url)
	            		console.log("## responseText: "+responseText)
	            	 	var json = JSON.parse(responseText);
	            	 	try{
							callback(json);
						}catch(e){						
							toast("页面异常，请稍后再试！");
							!isIcon &&  hideLoading();
							console.error(e)
						}        		
		            } else {
	            		toast("系统服务异常，请稍后再试！");
	            		console.log(url+"接口请求失败 :"+xhr.responseText)
		            }
		            !isIcon &&  hideLoading();
		            break;
		        default :
		            break;
		    }
	    }
		xhr.open("POST", url);
		xhr.send(null);
	}else{
		postAjax(url, data, callback,true);
	}	
}
function postAjax(url, data, callback,isIcon){
	url += "?"+jsonToParams(data);
	if(!isIcon){
		showLoading("数据加载中..."); 
	}
	var xhr = new XMLHttpRequest();	
	xhr.onreadystatechange = function () {
	    switch ( xhr.readyState ) {
	        case 4:       	
	            if ( xhr.status == 200 ) {
            		var responseText = xhr.responseText;
            		console.log("## postJSON ## url : "+url)
            	 	var json = JSON.parse(responseText);
            	 	try{
						callback(json);
					}catch(e){						
						toast("页面异常，请稍后再试！");
							!isIcon &&  hideLoading();
						console.error(e)
					}        		
	            } else {
            		toast("系统服务异常，请稍后再试！");
            		console.log(url+"接口请求失败 :"+xhr.responseText)
	            }
		            !isIcon &&  hideLoading();
	            break;
	        default :
	            break;
	    }
    }
	xhr.open("POST", url);
	xhr.send(null);
}
// 格式化 post 传递的数据
function jsonToParams(obj) {
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
function showLoading(msg){  
    plus.nativeUI.showWaiting(msg,{  
        padding:'20px',
        background:"rgba(0,0,0,.5)"
    });  
}  
function hideLoading(){  
    plus.nativeUI.closeWaiting();  
}
function toast(msg){
	$(".mui-toast-container").remove();
	mui.toast(msg,{type:'div'}); 
}
/**
 * 登录校验
 */
function checkLogin(page) {
	var userinfo = plusUtils.Storage.getItem("userinfo");
	var uuid = plusUtils.Storage.getItem("uuid");
	var loginDate = plusUtils.Storage.getItem("login_date");
	if(!vaildeParam(userinfo) || !vaildeParam(uuid) || !vaildeParam(loginDate)) {
		if(vaildeParam(page)) {
			openWebview(page, true, false);
		} else {
			openWebview('login.html', true, false);
		}
	}
}

/**
 * 保存登入数据
 * @param {Object} userID
 * @param {Object} mobile
 */
function setLoginData(userinfo) {
	var date = new Date(userinfo.loginDate).formatDate("yyyy-MM-dd hh:mm:ss");
	plusUtils.Storage.setItem("uuid", userinfo.uuid);
	plusUtils.Storage.setItem("mobile", userinfo.mobile);
	plusUtils.Storage.setItem("login_date", date);
	plusUtils.Storage.setItem("userinfo", JSON.stringify(userinfo));
	console.log("## setLoginData ## 用户登录时间 : " + date);
	console.log("## setLoginData ## 用户基本信息 : " + JSON.stringify(userinfo))
}

function loginOut(){
	mui.confirm('','确认退出登录吗？',['取消','确定'],function(event) {
		if (event.index == 0) return;
		clearLogin();
        layer.msg("退出登录成功");
        setTimeout(function(){
            openWebview('login.html');
        },1000);
	}, 'div');
}

function clearLogin() {
	plusUtils.Storage.clear();
}

/**
 * 日期格式化
 * @param {Object} fmt
 */
Date.prototype.formatDate = function(fmt) {
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

/**
 * 日期转换几分钟前
 * @param {Object} timespan
 */
function formatMsgTime (timespan) {
	var dateTime  = new Date(timespan);	
	var year      = dateTime.getFullYear();
	var month     = dateTime.getMonth() + 1;
	var day       = dateTime.getDate();
	var hour      = dateTime.getHours();
	var minute    = dateTime.getMinutes();
	var second    = dateTime.getSeconds();
	var timestamp = dateTime.getTime();
	var now = new Date();
	var now_new = Date.parse(now.toDateString());  //typescript转换写法
	
	var milliseconds = 0;
	var timeSpanStr;
	milliseconds = now_new - timestamp;
	
	if (milliseconds <= 1000 * 60 * 1) {
	    timeSpanStr = '刚刚';
	}
	else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
	    timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
	}
	else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
	    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
	}
	else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
	    timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
	}
	else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year == now.getFullYear()) {
	    timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
	} else {
	    timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
	}
	return timeSpanStr;
};

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

/**
 * 图片加载
 * @param {Object} url
 * @param {Object} callback
 */
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

/**
 * 随机生成字符串
 * @param {Object} len
 */
function randomString(len) {
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; 
	var maxPos = $chars.length;
	var pwd = '';
	for(i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

/**
 * 获取url参数
 * @param {Object} name
 */
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

/**
 * 防抖函数
 * @param method 事件触发的操作
 * @param delay 多少毫秒内连续触发事件，不会执行
 * @returns {Function}
 */
function debounce(method,delay) {
    var timer = null;
    return function () {
        var self = this,
            args = arguments;
        timer && clearTimeout(timer);
        timer = setTimeout(function () {
            method.apply(self,args);
        },delay);
    }
}

/**
 * 节流函数
 * @param method 事件触发的操作
 * @param mustRunDelay 间隔多少毫秒需要触发一次事件
 */
function throttle(method, mustRunDelay) {
    var timer,
        args = arguments,
        start;
    return function loop() {
        var self = this;
        var now = Date.now();
        if(!start){
            start = now;
        }
        if(timer){
            clearTimeout(timer);
        }
        if(now - start >= mustRunDelay){
            method.apply(self, args);
            start = now;
        }else {
            timer = setTimeout(function () {
                loop.apply(self, args);
            }, 50);
        }
    }
}
var appUtils = {
    renderTemplate: function (tpl, data) {
        if (typeof template === 'function') {
            var render = template.compile(tpl);
            return render(data);
        }
        else {
            alert('请先加载: artTemplate');
        }
    }   
};
