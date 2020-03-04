import Vue from 'vue'
import App from '@/App'
// 请求
Vue.prototype.request = function(obj) {  
	var header = obj.header || {}
	if (uni.getStorageSync('token')) {
		// header['token'] = uni.getStorageSync("token");
	}
	uni.request({
		url: this.apiUrl + obj.url,
		method: obj.method || "GET",
		header: header,
		data: obj.data || {},
		success: res => {
			typeof obj.success == "function" && obj.success(res)
		},
		fail: res => {
			typeof obj.fail == "function" && obj.fail(res)
		}
	})
}
// showToast
Vue.prototype.showToast = function(title, mask = false) {
	uni.showToast({
		title: title,
		icon: 'none',
		mask: mask
	})
}
// showLoading
Vue.prototype.showLoading = function(title = '加载中...', mask = true) {
	uni.showLoading({
		title: title,
		mask: mask
	})
}
// 手机正则
Vue.prototype.checkPhone = function(phone) {
	if (!(/^1[3456789]\d{9}$/.test(phone))) {
		return false;
	}
	return true;
}
// 阻止实体键返回_跳转
Vue.prototype.POP = function() {
	uni.switchTab({
		url: '/pages/index/index'
	});
}
// 阻止实体键返回_监听
Vue.prototype.addPOP = function(fn) {
	if (window.history && window.history.pushState) {
		console.log('支持监听返回键');
		history.pushState(null, null, document.URL);
		window.addEventListener('popstate', fn, false);
	}
}
// 阻止实体键返回_卸载 
Vue.prototype.removePOP = function(fn) {
	window.removeEventListener('popstate', fn, false);
}