import Vue from 'vue'
import App from './App.vue'
import router from './routers/router'
import store from './store/store'
import axios from 'axios'
import './assets/css/index.styl'

Vue.config.productionTip = false
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
