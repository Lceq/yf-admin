
import * as types from '../type';

const loading = {
    // 处理逻辑
    actions: {
        showLoading ({commit, state}) {
            commit(types.SHOW_LOADING);
        },
        hideLoading ({commit, state}) {
            commit(types.HIDE_LOADING);
        }
    },
    // 数据突变
    mutations: {
        [types.SHOW_LOADING] (state) {
            state.bLoading = true;
        },
        [types.HIDE_LOADING] (state) {
            state.bLoading = false;
        }
    },
    // 仓库
    state: {
        bLoading: false
    },
    getters: {
        getLoading (state) {
            return state.bLoading;
        }
    }
};

export default loading;
