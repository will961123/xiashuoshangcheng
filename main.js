import Vue from 'vue'
import App from './App'
import "./etc/etc.js"
import "./components.js"
import "./util/will_util.js"

Vue.config.productionTip = false

App.mpType = 'app'



const app = new Vue({
	...App
})
app.$mount()
