import { createApp } from 'vue';
import './style.css';
import { WithAbHocPlugin } from 'vue-ab-hoc';
import { abKeys } from './global';
import App from './App.vue';

createApp(App).use(WithAbHocPlugin, abKeys).mount('#app');
