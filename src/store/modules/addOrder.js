import * as types from '../type';
export const addOrder = {
    // 处理逻辑
    actions: {
        showOrder: ({commit, state}) => {
            commit(types.SHOW_ADDORDER);
        }
    },
    // 数据突变
    mutations: {
        [types.SHOW_ADDORDER]: (state) => {
            state.bOrder = true;
        }
    },
    // 仓库
    state: {
        bOrder: false
    },
    getters: {
        getOrder: (state) => {
            return state.bOrder;
        }
    }
};

export default addOrder;
