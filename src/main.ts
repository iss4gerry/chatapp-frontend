import { createApp } from 'vue';
import App from './App.vue';
import 'animate.css';
import './index.css';
import { router } from './routers/index';
import VueAutoscroll from '@codekraft-studio/vue-autoscroll';

const app = createApp(App);
app.use(VueAutoscroll);
app.use(router);

app.mount('#app');
