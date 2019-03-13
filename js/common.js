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
 * 定位组件 
 */
plusUtils.locate = {
	/**
	 * 获取定位
	 */
	getCurrentPosition:function () {
		var self = this;
		if(window.plus){	
			plus.geolocation.getCurrentPosition(self.showPosition, function (e) {
	        	console.log("获取定位位置信息失败:" + e.code + e.message );
	        	self.checkPermissionPos();
	    	},{enableHighAccuracy:true,provider:'amap'});
		}else{
			if (navigator.geolocation){
	    		navigator.geolocation.getCurrentPosition(self.showPosition,function(e){
					console.log("获取定位位置信息失败:");
				});
	    	}
		}
	},
	/**
	 * 检查定位权限
	 */
	checkPermissionPos:function () {
		var self = this;
		var Permission = plus.navigator.checkPermission('LOCATION');
	    console.log("## 获取定位权限 ##: "+ Permission)            
	    switch(Permission){
	        case 'authorized':
				console.log('已开启定位权限');
	            break;
	        case 'denied':
				console.log('定位失败，请确保是否开启gps定位服务');
	            self.openSystemPositionServer();
	            break;
	        case 'undetermined':
	            console.log('未确定定位权限');
	            self.openSystemPositionServer();
	            break;
	        case 'unknown':
	           console.log('无法查询定位权限');
	            self.openSystemPositionServer();
	            break;
	        default:
				console.log('不支持定位权限');
				self.openSystemPositionServer();
	            break;
	    }
	}, 
	/**
	 * 获取位置具体信息
	 * @param position
	 */
	showPosition:function (position) {
		var self = this;
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
	    console.log("## showPosition ## 位置具体信息 : " + JSON.stringify(geolocationGroup));
	    plusUtils.Storage.setItem("geolocationGroup", JSON.stringify(geolocationGroup));
	},
	/**
	 * 开启定位
	 */
	openSystemPositionServer:function () {
		var msg = "定位失败，请确保是否开启gps定位服务";
		if(mui.os.ios){
			msg = "请打开系统设置中“隐私->定位服务”，允许“云智充”使用您的位置";
		}
		mui.alert(msg,"开启定位服务","设置",function(){		
			if (mui.os.ios) {
				//plus.runtime.openURL("App-Prefs:root=Privacy&path=LOCATION");
				plus.runtime.openURL("app-settings:LOCATION");
			} else {
				var main = plus.android.runtimeMainActivity();
				var Intent = plus.android.importClass("android.content.Intent");
				var mIntent = new Intent('android.settings.LOCATION_SOURCE_SETTINGS');
				main.startActivity(mIntent);
			}
		})
	}
}
/**
 * 本地存储
 */
plusUtils.Storage = {
	getItem:function(key){
		if(mui.os.plus){
			return plus.storage.getItem(key);
		}else{
			return localStorage.getItem(key);
		}		
	},
	setItem:function(key,value){
		if(typeof value == "number"){
			value = value.toString();
		}
		if(mui.os.plus){
			plus.storage.setItem(key,value);
		}else{
			localStorage.setItem(key,value);
		}
	},
	removeItem:function(key){
		if(mui.os.plus){
			plus.storage.removeItem(key);
		}else{
			localStorage.removeItem(key);
		}		
	},
	clear:function(){
		if(window.plus){
			plus.storage.clear();
		}else{
			localStorage.clear();
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
    shareMessage:function(msg, s, callback) {  
        s.send(msg,function() {
			toast("分享成功");
            console.log("分享到\"" + s.description + "\"成功！ ");
			callback && callback(true);
        }, function(e) { 
			//获取失败返回状态码
			var code = e.code;
			var msg = "分享失败!";
			if(code == -100){
				msg = "您已取消分享";
			}
			toast(msg); 
			console.log("分享到\"" + s.description + "\"失败: " + JSON.stringify(e));
			callback && callback(false);
        });  
    },
    /**  
	 * 分享操作  
	 * @param {JSON} sb 分享操作对象s.s为分享通道对象(plus.share.ShareService)  
	 * @param {Boolean} ishref 是否分享链接  
	 * @param {JSON} config 分享内容  
	 */  
	shareAction:function (sb,config,callback) {
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
	        self.shareMessage(msg, sb.s,callback);  
	    } else {  
	        console.log("---未授权---");  
	        sb.s.authorize(function() {  
	            self.shareMessage(msg, sb.s,callback);  
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
	appshare:function (config,isSheet,index,callback) { 
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
		            (e.index > 0) && self.shareAction(shareBts[e.index - 1], msginfo,callback);  
		        }  
		    ) : plusUtils.nativeUI.alert('当前环境无法支持分享操作!');  
		}else{
			self.shareAction(shareBts[index], msginfo,callback);
		}
	}
};
/**
 * 电话组件
 */
plusUtils.device = {
	phone:function(){
		mui.plusReady(function(){
			var btnArray = ['拨打', '取消'];
			var Phone = "400-825-1068";
			if(mui.os.ios){
				plus.device.dial(Phone, false);
			}else{
				mui.confirm('是否拨打 ' + Phone + ' ？', '提示', btnArray, function(e) {
					if(e.index == 0) {
						plus.device.dial(Phone, true);
					}
				});
			}
		});
	}
}

/**
 * 页面方法组件
 */
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
	openerFire:function(event, data){
		var ws = plus.webview.currentWebview();
		var wo = ws.opener();
		mui.fire(wo, event, data||{});
	},
	//触发自定义事件
	openerFireById:function(id, event, data){
		if(mui.os.plus){
			var page = plus.webview.getWebviewById(id);
			page && mui.fire(page, event, data||{});
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
	closeAndBackUrl: function(url) {
		if(mui.os.plus){
			var ws = plus.webview.currentWebview();
			//plus.webview.close(ws);
			setTimeout(function(){
				ws.close("none");
			},1500);
			openWebview(url);
		}else{
			window.location.href = url;
		}
	},
	/**
	 * 关闭当前窗口返回上个窗口并刷新
	 * @param {Object} page
	 */
	closeAndRefresh:function(url){
		if(mui.os.plus){
			var ws = plus.webview.currentWebview();
			var wo = ws.opener();
			do {
				if (wo.getURL().endsWith(url)) {
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
		}else{
			window.location.href = url;
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
        topoffset = parseFloat(ms[2]) + 44 + 'px';
    }
	if(mui.os.ios && mui.os.plus && plus.navigator.isImmersedStatusbar()){
	    topoffset = Math.round(plus.navigator.getStatusbarHeight()) + 44 +'px';		
	};
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
		plusUtils.pageReady(function () {
			console.log("### onRefresh ###");
			pageRefresh && pageRefresh();
			mui('.mui-content').pullRefresh().endPulldownToRefresh();
		});		
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
		console.log("## uuid ## "+uuid);
		if(plus.navigator.isImmersedStatusbar()){
			var barHeight = plus.device.model == 'iPhoneX' ? 44 : Math.round(plus.navigator.getStatusbarHeight());
			if(plus.device.model == 'iPhoneX'){
				document.documentElement.classList.add("iphonex");								
			}else{
				document.documentElement.classList.remove("iphonex");
			}
		}
		// Android处理返回键
		plus.key.addEventListener('backbutton',function(){
			back();
		},false);
		// checkVersion();
	}
	if(w.plus){
		plusReady();
	}else{
		document.addEventListener('plusready',plusReady,false);
	}
	
	// DOMContentLoaded事件处理
	var domready = false;
	document.addEventListener('DOMContentLoaded',function(){
		if(!mui.os.plus){
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
	// 处理点击事件
	var openw = null;
	/**
	 * 打开新窗口
	 * @param {URIString} id : 要打开页面url
	 * @param {String} tilte : 页面标题名称
	 * @param {JSON} ws : Webview窗口属性
	 */
	w.openWebview = function(id, isNView, isBack, extras, ws){
		if(openw){//避免多次打开同一个页面
			return null;
		}
		if(typeof isBack == 'undefined'){isBack= true}
		if(w.plus){
			ws=ws||{};
			ws.scrollIndicator||(ws.scrollIndicator='none');
			ws.scalable||(ws.scalable=false);
			ws.backButtonAutoControl||(ws.backButtonAutoControl='close');
			if(isNView){						
				ws.titleNView = ws.titleNView||{autoBackButton:isBack};
				ws.titleNView.backgroundColor = '#f47e13';
				ws.titleNView.titleColor = '#fff';
			}		
			openw = plus.webview.create(id, id, ws, {params:extras||null});
			openw.addEventListener('loaded', function(){
				openw.show(as);
			}, false);
			openw.addEventListener('close', function(){
				openw=null;
			}, false);
			return openw;
		}else{
			w.location.href = id;
		}
		return null;
	};
})(window);

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
		!isIcon && showLoading("正在加载..."); 
		var xhr = new plus.net.XMLHttpRequest();	
		xhr.onreadystatechange = function () {
		    switch (xhr.readyState) {
		        case 4:
					var responseText = xhr.responseText; 
		        	console.log("## url: " + url);
	            	console.log("## params: " + JSON.stringify(data))
					console.log("## responseText: " + responseText)
		            if (xhr.status == 200) {           		           		
	            	 	var json = JSON.parse(responseText);
	            	 	try{
							callback(json);
						}catch(e){						
							toast("页面异常，请稍后再试！");
							!isIcon &&  hideLoading();
							console.error(e)
						}        		
		            }else if(xhr.status == 0){
						callback({code:408,msg:"服务请求超时，请稍后再试！"});
					} else {
	            		toast("系统服务繁忙，请稍后再试！");
	            		console.log(url + "接口请求失败 :" + responseText)
		            }
		            !isIcon &&  hideLoading();
		            break;
		        default :
		            break;
		    }
	    }
		xhr.timeout = 15000; 
		xhr.open("POST", url);
		xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		xhr.send(jsonToParams(data));
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
function jsonToParams(data) {
	if(typeof data != "object") {
		alert("输入的参数必须是对象");
		return;
	}
	var tempArr = ["appVersion=" + appVersion];
    for (var i in data) {
        var key = encodeURIComponent(i);
        var value = encodeURIComponent(data[i]);
        tempArr.push(key + '=' + value);
    }
    return tempArr.join('&');
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

/**
 * 登录校验
 */
function checkLogin() {
	var userinfo = plusUtils.Storage.getItem("userinfo");
	var uuid = plusUtils.Storage.getItem("uuid");
	var loginDate = plusUtils.Storage.getItem("login_date");
	var href = 'login.html';
	if(!vaildeParam(userinfo) || !vaildeParam(uuid) || !vaildeParam(loginDate)) {
		openWebview(href);
	}
}

function loginOut(){
	mui.confirm('','确认退出登录吗？',['取消','确定'],function(event) {
		if (event.index == 0) return;
		clearLogin();
        layer.msg("退出登录成功");
        setTimeout(function(){
            openWebview('login.html','登录',false);
        },1000);
	}, 'div');
}

function clearLogin() {
	var wvs = plus.webview.all();  
	for(var i=0;i<wvs.length;i++){  
		if(plus.webview.currentWebview().id!=wvs[i].id){  
			plus.webview.close(wvs[i],'none');  
		}  
	} 
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
function checkVersion() {
    var osName = navigator.plus ? plus.os.name : navigator.appName;
	postJSON(API_URL.AppVersionGetNewest,{ "appType" : osName },function (res) {
		if (res.code == '0' && vaildeParam(res.data)) {
			if (compareVersion(res.data.version)) {
				mui.alert('检测到新版本,是否立即更新?', '更新提醒', function(e) {  
					console.log('检测到新版本更新');
					plus.runtime.openURL(res.data.url);
				});
    			
    		}
		}
    },true);
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
	var index = 0,diff = 0;
	while(index < len && (diff = parseInt(array1[index]) - parseInt(array2[index])) == 0) {
		index++;
	}
	return diff == 0 ? array1.length - array2.length : diff > 0;
}
/**
 * 差量更新
 */
function heatUpdate() {
	var appType = navigator.plus ? plus.os.name : navigator.appName;
	appType = appType + "HeatUpdate";
	postJSON(API_URL.AppVersionGetNewest, {'appType': appType}, function(res) {
		if('0' == res.code && vaildeParam(res.data)) {
			if(compareVersion(res.data.version)) {
				mui.confirm('检测到新版本,是否立即更新?', '更新提醒', ['稍后再说', '现在更新'], function(e) {  
					if(e.index == 1) {
						console.log('检测到新版本更新');
						downloadWgt(res.data.url);
					}
				});
			}
		}
	},true);
}

function downloadWgt(url) {
	var showLoading = showLoading(' 正在下载...... ');
	var downloadTask = plus.downloader.createDownload(url, {
		filename: '_doc/update/'
	}, function(d, status) {
		hideLoading();
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
	showLoading('正在安装...');
	plus.runtime.install(path, {
		force: true
	}, function() {
		hideLoading();
		console.log('安装wgt文件成功！');
		plus.nativeUI.alert('应用资源更新完成！', function() {
			plus.runtime.restart();
		});
	}, function(e) {
		hideLoading();
		console.log('安装wgt文件失败[' + e.code + ']：' + e.message);
		plus.nativeUI.alert('应用资源更新失败' + e.message);
	});
}
