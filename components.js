import Vue from 'vue' 

import sunUiStepper from './components/sunui-stepper/sunui-stepper.vue'
import willTip from './components/will_tip/will_tip.vue';
import willNodata from '@/components/will_nodata/will_nodata.vue';
import willMc from '@/components/will_mc/will_mc.vue';
Vue.component('sunui-stepper', sunUiStepper);
Vue.component('will-tip', willTip);
Vue.component('will-nodata', willNodata);
Vue.component('will-mc', willMc);