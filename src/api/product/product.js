import { post, fetch, proxy } from '../../ajax/http';

// 物料档案
export default {
    // 获取机物料
    machineMaterial (params) {
        return post('product/listCode', params);
    },
    getProductList (params) {
        return post('product/list', params);
    },
    getProductList2 (params) {
        return post('product/list2', params);
    },
    getProductDetail (params) {
        return post('product/detail', params);
    },
    saveHttp (params) {
        return post('product/save', params);
    },
    // 获取物料类别对应的辅助属性
    productPropertyItemList (params) {
        return proxy.call('product.property.item.list', params);
    },
    productApproveHttp (params) {
        return post('product/approve', params);
    },
    productUnapproveHttp (params) {
        return post('product/unapprove', params);
    },
    productDisableHttp (params) {
        return post('product/disable', params);
    },
    productEnableHttp (params) {
        return post('product/enable', params);
    },
    productDeleteHttp (params) {
        return post('product/delete', params);
    },
    // 制造BOM获取产品
    productListByProcess (params) {
        return post('product/listByProcess', params);
    },
    // 获取有工序的产品
    productList2 (params) {
        return proxy.call('product.list2', params);
    }
};
