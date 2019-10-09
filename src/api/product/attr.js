import { post, fetch } from '../../ajax/http';
// 物料属性
export default {
    // 物料分类列表
    getProductPropertyItemList (params) {
        return fetch('product/property/item/list', params);
    },
    productPropertyItemList (params) {
        return post('product/property/item/list', params);
    },
    // 原料成分
    productComponentList (param) {
        return post('product/component/list', param);
    },
    // 纱线用途
    productPurposeList (param) {
        return post('product/purpose/list', param);
    },
    // 纺纱工艺
    productTechnologyList (param) {
        return post('product/technology/list', param);
    }
};
