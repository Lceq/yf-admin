import Vue from 'vue';
import Vuex from 'vuex';
// 引入modules
import app from './modules/app';
import work from './modules/work';
import user from './modules/user';
import loading from './modules/loading';
import addOrder from './modules/addOrder';
import errorModal from './modules/errorModal';
import state from './state';
Vue.use(Vuex);
const store = new Vuex.Store({
    actions: {
        // 计算展示区的高度
        calManiViewHeight ({commit, state}, payload) {
            commit('MANI_VIEW_HEIGHT', payload);
        }
    },
    mutations: {
        ALL_MODULE_LIST (state, payload) {
            state.allModuleList = payload;
        },
        SET_ADD_ROUTER_LIST (state, payload) {
            state.addRouterList = payload;
        },
        MANI_VIEW_HEIGHT (state, payload) {
            state.maniViewHeight = payload.payload;
        },
        // 保存serviceName: []
        UPDATE_SERVICE_LIST (state, name) {
            state.serviceList.push(name);
            localStorage.serviceList = JSON.stringify(state.serviceList); // 冗余
        },
        UPDATE_MENU_ACTIVENAME (state, name) {
            state.menuActiveName = name;
        },
        UPDATE_MENU_RIGHTS (state, items) {
            state.moduleRightItems = items;
        },
        UPDATE_RIGHT_ROUTE (state, item) {
            state.curRightRoute = item;
        },
        UPDATE_DOCUMENT_HEIGHT (state, height) {
            // 减去20是card的高度再减去32是内容的高度
            state.documentHeight = height - 24;
        },
        updateCodeTestChinese (state, name) {
            state.codeTestChinese = name;
        }
    },
    state,
    getters: {
        getManiViewHeight (state) {
            return state.maniViewHeight;
        },
        getAddRouterList (state) {
            return state.addRouterList;
        }
    },
    modules: {
        app,
        work,
        user,
        loading,
        addOrder,
        errorModal
    }
});

export default store;
