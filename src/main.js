import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import VueClipBoard from 'vue-clipboard2'

Vue.config.productionTip = false
Vue.use(VueClipBoard);

new Vue({
  render: h => h(App),
}).$mount('#app')
