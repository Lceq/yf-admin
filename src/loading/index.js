import globalLoading from './loading';

export default {
    install: (Vue) => {
        Vue.component('globalLoading', globalLoading);
    }
};
