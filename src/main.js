import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import './assets/global.css'
import axios from "axios";
import * as ElIconModules from '@element-plus/icons';
import router from './router/index.js'
import store from './store/index.js'
import 'element-plus/theme-chalk/index.css'


const app = createApp(App)
for (let iconName in ElIconModules) {
    app.component(iconName, ElIconModules[iconName])
}
app.config.globalProperties.$axios = axios
app.config.globalProperties.$httpUrl = 'http://localhost:8080'
app.use(ElementPlus, {size: 'large', zIndex: 3000})
app.use(store);
app.use(router);
app.mount('#app')



