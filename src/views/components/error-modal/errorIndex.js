import errorModal from './errorModal.vue';

export default {
    install: (Vue) => {
        Vue.components('errorModal', errorModal);
    }
};
