import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import '@/locale';
import './styles/style.css';
import 'iview/dist/styles/iview.css';
import 'font-awesome/css/font-awesome.min.css';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import api from './api';
import global from './libs/common';
import globalLoading from './loading/index';
import { Container, Draggable } from "vue-smooth-dnd";
import { fetch, post, proxy } from './ajax/http';
import yfModal from './views/components/yuan-fang/yf-modal/index';
if (window.HTMLElement) {
    if (Object.getOwnPropertyNames(HTMLElement.prototype).indexOf('dataset') === -1) {
        Object.defineProperty(HTMLElement.prototype, 'dataset', {
            get: function () {
                var attributes = this.attributes; // 获取节点的所有属性
                var name = [],
                    value = []; // 定义两个数组保存属性名和属性值
                var obj = {}; // 定义一个空对象
                for (var i = 0; i < attributes.length; i++) { // 遍历节点的所有属性
                    if (attributes[i].nodeName.slice(0, 5) === 'data-') { // 如果属性名的前面5个字符符合"data-"
                        // 取出属性名的"data-"的后面的字符串放入name数组中
                        name.push(attributes[i].nodeName.slice(5));
                        // 取出对应的属性值放入value数组中
                        value.push(attributes[i].nodeValue);
                    }
                }
                for (var j = 0; j < name.length; j++) { // 遍历name和value数组
                    obj[name[j]] = value[j]; // 将属性名和属性值保存到obj中
                }
                return obj; // 返回对象
            }
        });
    }
}

// 全局安装axios
Vue.prototype.$http = axios;
Vue.prototype.$fetch = fetch;
Vue.prototype.$post = post;
Vue.prototype.$call = proxy.call;
Vue.prototype.$api = api;
Vue.prototype.$global = global;

Vue.component('Container', Container);
Vue.component('Draggable', Draggable);
Vue.use(VueI18n);
Vue.use(iView);
Vue.use(globalLoading);
Vue.use(yfModal);
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: '',
        eventHub: new Vue()
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
