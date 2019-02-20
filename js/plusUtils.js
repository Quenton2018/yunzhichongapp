/**
 * plus公共工具类
 * @class plusUtils
 */
var plusUtils = {};


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
	  
