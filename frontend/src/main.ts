import Vue from 'vue';
import VueApollo from 'vue-apollo'

import VueUploadComponent from 'vue-upload-component'

import vuetify from './plugins/vuetify'
import App from './App.vue';
import router from './router';
import store from './store/store';

import { createProvider } from './vue-apollo'
import VueQRCodeComponent from "vue-qrcode-component";

import Flickity from 'vue-flickity';

// Register the Vue component


//
// end register
//
Vue.config.productionTip = false;

// const datepickerOptions = {
// }

Vue.use(VueApollo)
Vue.component('qr-code', VueQRCodeComponent)
Vue.component('file-upload', VueUploadComponent)

Vue.component('flickity', Flickity)

new Vue({
    router,
    store,

    vuetify,
    // @ts-ignore

    apolloProvider: createProvider(),
    render: h => h(App)
} as any).$mount('#app');
