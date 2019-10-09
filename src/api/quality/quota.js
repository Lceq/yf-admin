import {post} from '../../ajax/http';

export default {
    getQmProductList (params) {
        return post('qm/product/list', params);
    },
    getQmProductSave (params) {
        return post('qm/product/save', params);
    },
    getQmProductDetail (params) {
        return post('qm/product/detail', params);
    },
    getQmProductApprove (params) {
        return post('qm/product/approve', params);
    },
    getQmProductUnApprove (params) {
        return post('qm/product/unapprove', params);
    },
    getQmProductParamList (params) {
        return post('qm/product/param/list', params);
    },
    deleteQmProduct (params) {
        return post('qm/product/delete', params);
    },
    processQmParam (params) {
        return post('qm/product/param/listXs', params);
    },
    productListXS (params) {
        return post('product/listXs', params);
    }
};
