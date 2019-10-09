import deleteModal from './deleteWarning.vue';
export default {
    install: (Vue) => {
        Vue.components('errorModal', deleteModal);
    }
};
