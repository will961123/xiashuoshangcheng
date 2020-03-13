import Vue from 'vue'
import App from './App'
 
import "./util/will_util.js"
import sunUiStepper from './components/sunui-stepper/sunui-stepper.vue'
import willTip from './components/will_tip/will_tip.vue';
import willNodata from '@/components/will_nodata/will_nodata.vue';
import willMc from '@/components/will_mc/will_mc.vue';
Vue.component('sunui-stepper', sunUiStepper);
Vue.component('will-tip', willTip);
Vue.component('will-nodata', willNodata);
Vue.component('will-mc', willMc);

Vue.prototype.imgUrl = 'imgUrl'
// #ifdef H5
Vue.prototype.apiUrl = '/xiashuo'
// #endif
// #ifndef H5
Vue.prototype.apiUrl = 'http://192.168.1.1:8080/xiashuo'
// #endif

// #ifdef MP-WEIXIN
Vue.prototype.appId = 'wx51fed674e0817015'
Vue.prototype.appScret = '6c6099dde5485fbc3b173d288a350325'
// #endif

Vue.prototype.isLoad = function() {
	// #ifdef MP-WEIXIN
	if (!uni.getStorageSync('userInfo')) {
		return false
	} else {
		return true
	}
	// #endif
}

Vue.config.productionTip = false

App.mpType = 'app'



const app = new Vue({
	...App
})
app.$mount()
