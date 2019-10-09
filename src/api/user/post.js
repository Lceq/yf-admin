import { post } from '../../ajax/http';

export default {
    // 获取岗位列表
    getPostList (params) {
        return post(('post/list'), params);
    },
    // 获取搜索的岗位列表
    getSearchPostList () {
        return new Promise((resolve, reject) => {
            post('post/list').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    let postBasicList = [];
                    for (let g of content.res) {
                        if (postBasicList.map(x => x.typeCode) === undefined || !postBasicList.map(x => x.typeCode).includes(g.typeCode)) {
                            let obj = {
                                typeCode: g.typeCode,
                                typeName: g.typeName,
                                data: []
                            };
                            for (let p of content.res) {
                                if (obj.typeCode === p.typeCode) {
                                    obj.data.push(p);
                                }
                            }
                            postBasicList.push(obj);
                        }
                    }
                    resolve(postBasicList);
                }
            }).catch(err => {
                reject(err.data);
            });
        });
    },
    getPostDetail (params) {
        return post(('post/detail'), params);
    },
    getPostSave (params) {
        return post(('post/save'), params);
    },
    getPostApprove (params) {
        return post(('post/approve'), params);
    },
    getPostUnApprove (params) {
        return post(('post/unapprove'), params);
    },
    getPostDelete (params) {
        return post(('post/delete'), params);
    }
};
