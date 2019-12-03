import { proxy, post } from '../../ajax/http';
import axios from 'axios/index';

// 获取工序列表
export default {
    getProcessList (params) {
        return post(('process/list'), params);
    },
    // 获取工序的下拉列表
    getSearchProcessList () {
        return new Promise((resolve, reject) => {
            post('process/list', {
                auditState: 3,
                state: 1
            }).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // 获取一级工序
                    let parentProcessList = content.res.filter(x => x.parentId === 0);
                    let twoProcessList = parentProcessList;
                    parentProcessList.map(item => {
                        if (content.res.find(x => x.parentId === item.id)) {
                            let n = 0;
                            for (let j of content.res.filter(x => x.parentId === item.id)) {
                                n++;
                                j.style = 'margin-left:10px;';
                                twoProcessList.splice(twoProcessList.indexOf(item) + n, 0, j);
                            }
                        }
                        return twoProcessList;
                    });
                    resolve(twoProcessList);
                }
            }).catch(err => {
                reject(err.data);
            });
        });
    },
    getProcessSave (params) {
        return post(('process/save'), params);
    },
    getProcessDetail (params) {
        return post(('process/detail'), params);
    },
    getProcessApprove (params) {
        return post(('process/approve'), params);
    },
    getProcessUnApprove (params) {
        return post(('process/unapprove'), params);
    },
    getProcessDelete (params) {
        return post(('process/delete'), params);
    },
    getProcessEnable (params) {
        return post(('process/enable'), params);
    },
    getProcessDisable (params) {
        return post(('process/disable'), params);
    },
    processListRequest (params) {
        return proxy.call(('process.list'), params);
    }
};
