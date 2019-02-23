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
 * @param {Object} id
 * @param {Object} extras
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
/**
 * 下拉刷新
 * @param {Object} plusReady
 * @param {Object} pageRefresh
 */
var plusRefresh = function(pageRefresh) {
	var topoffset = 0 + 'px';
	var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
    if (ms && ms.length >= 3) {
        topoffset = parseFloat(ms[2]) + 'px';
    }
	if(mui.os.plus){		
		if (plus.navigator.isImmersedStatusbar()) {
        	topoffset = Math.round(plus.navigator.getStatusbarHeight()) + 45 +'px';
    	}
	}
	mui.init({
	  	pullRefresh : {
	    	container:".mui-content",
	    	down : {
		      	style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
		      	offset:topoffset, //可选 默认0px,下拉刷新控件的起始位置
		      	callback :onRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
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

//通过定位模块获取位置信息
function getCurrentPosition() {
	if(window.plus){
		plus.geolocation.getCurrentPosition(showPosition, function (e) {
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
function checkNumber(theObj) {
	var reg = /^[0-9]+.?[0-9]*$/;
	if(reg.test(theObj)) {
		return true;
	}
	return false;
}

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
//	alert(window.plus)
	if(mui.os.plus){	
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
		postAjax(url, data, callback,isIcon);
	}	
}
function postAjax(url, data, callback,isIcon){
	url += "?"+jsonToParams(data);
//		if(!isIcon){
//			showLoading("数据加载中..."); 
//		}
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
//							!isIcon &&  hideLoading();
						console.error(e)
					}        		
	            } else {
            		toast("系统服务异常，请稍后再试！");
            		console.log(url+"接口请求失败 :"+xhr.responseText)
	            }
//		            !isIcon &&  hideLoading();
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
	var date = formatDate(new Date(userinfo.loginDate), "yyyy-mm-dd HH:mm:ss");
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
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; 
	var maxPos = $chars.length;
	var pwd = '';
	for(i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}
/**
 * 上传用户登入信息,并且校验是否多台设备登入
 */
function uploadLoginInfo(loginPagePath) {
	checkLogin(loginPagePath);
	setInterval(function() {
		var uuid = plusUtils.Storage.getItem("uuid");
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
			postJSON(API_URL.updateLoginInfo, data, function(res) {
				if("0" == res.code) {
					console.log("上传用户登录信息成功")
				} else if('6003' == res.code) {
					toast('您的账号已在在另一设备登录，您强制下线,正在跳转登录页面...');
					setTimeout(function() {
						clearLogin();
						checkLogin(loginPagePath);
					}, 2000)
				} else {
					toast(res.msg);
				}
			},true)
		}
	}, 5000)
}
function checkVersion() {
    var osName = navigator.plus ? navigator.plus.os.name : navigator.appName;
	postJSON(API_URL.AppVersionGetNewest,{ "appType" : osName },function (res) {
		if (res.code == '0' && vaildeParam(res.data)) {
			if (compareVersion(res.data.version)) {
    			openWebview('views/edition.html');
    		}
		}
    });
}
/**
 * wgt html/css/js
 * wgtu 差量更新,需要对照appStore或应用宝中的升级
 */
function heatUpdate() {
	var appType = navigator.plus ? navigator.plus.os.name : navigator.appName;
	appType = appType + "HeatUpdate";
	postJSON(API_URL.AppVersionGetNewest, {'appType': appType}, function(res) {
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

var utils = {
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