/**
 * Main Application Entry Point. Bootstraps the Vue 3 application, attaches Pinia, Vue Router, Vue I18n and configures PrimeVue with the Material Design theme preset.
 *
 * @summary Main bootstrapping script for GeoMine Solutions.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/app/app.vue';
import router from '@/app/router/index.js';
import i18n from '@/shared/application/i18n/i18n.js';
import { setupPrimeVue } from '@/app/plugins/primevue.js';

import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

setupPrimeVue(app);

app.mount('#app');
