import { post, fetch } from '../../ajax/http';
// 物料分类
export default {
    // 物料分类列表
    getProductCategoryList (params) {
        return post('product/category/list', params);
    },
    // 物料分类保存
    productCategorySave (params) {
        return post('product/category/save', params);
    },
    // 物料分类详情
    getProductCategoryDetail (params) {
        return post('product/category/detail', params);
    },
    // 物料分类列表
    productCategoryDelete (params) {
        return post('product/category/delete', params);
    },
    // 物料分类列表
    productCategoryApprove (params) {
        return post('product/category/approve', params);
    },
    // 物料分类列表
    productCategoryUnApprove (params) {
        return post('product/category/unapprove', params);
    }
};
