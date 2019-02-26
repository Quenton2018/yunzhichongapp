function checkVersion() {
    var osName = navigator.plus ? plus.os.name : navigator.appName;
	postJSON(API_URL.AppVersionGetNewest,{ "appType" : osName },function (res) {
		if (res.code == '0' && vaildeParam(res.data)) {
			if (compareVersion(res.data.version)) {
    			openWebview('_www/views/edition.html');
    		}
		}
    });
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