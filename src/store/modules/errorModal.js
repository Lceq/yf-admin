import * as types from '../type';

const errorModal = {
    // 处理逻辑
    actions: {
        showErrorModal ({commit, state}, payload) {
            commit(types.SHOW_ERRORMODAL, payload);
        },
        hideErrorModal ({commit, state}, payload) {
            commit(types.HIDE_ERRORMODAL, payload);
        }
    },
    // 数据突变
    mutations: {
        [types.SHOW_ERRORMODAL] (state, payload) {
            state.bErrorStatus = true;
            state.bErrorMsg = payload.payload.message;
            state.status = payload.payload.status;
        },
        [types.HIDE_ERRORMODAL] (state, payload) {
            state.bErrorStatus = false;
            state.bErrorMsg = '';
            state.status = null;
        }
    },
    // 仓库
    state: {
        bErrorStatus: false,
        bErrorMsg: '',
        status: null
    },
    getters: {
        getErrorStatus (state) {
            return state;
        }
    }
};

export default errorModal;
