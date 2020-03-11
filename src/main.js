import Vue from 'vue';
import { Laue } from 'laue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  Laue,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
