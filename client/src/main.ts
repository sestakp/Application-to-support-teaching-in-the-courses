import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
//import 'primevue/resources/themes/lara-light-teal/theme.css';
import 'primevue/resources/themes/lara-light-blue/theme.css';

import ConfirmationService from 'primevue/confirmationservice';
import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.scss';
import 'primeicons/primeicons.css';

/* eslint-disable */
const app = createApp(App);
app.component('Toast', Toast);

app.use(store).use(router).use(PrimeVue).use(ConfirmationService).use(ToastService).mount('#app')
