import { createApp } from 'vue';
import App from './App.vue';
import 'animate.css';
import './index.css';
import VueAutoscroll from '@codekraft-studio/vue-autoscroll';

const app = createApp(App);
app.use(VueAutoscroll);

app.mount('#app');
