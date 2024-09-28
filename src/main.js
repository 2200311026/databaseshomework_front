import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入css
import '@/assets/css/global.css'
//引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入国际化需要的组件
import zhCn from 'element-plus/es/locale/lang/zh-cn' //并使用

createApp(App).use(store).use(router).use(ElementPlus,{locale: zhCn,}).mount('#app')
