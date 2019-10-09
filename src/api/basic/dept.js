import { fetch, post } from '../../ajax/http';

export default {
    // 获取当前用户车间
    getDeptList (params) {
        return post(('dept/list'), params);
    },
    // 获取当前用户车间
    getWorkshopList (params) {
        return post(('user/data/workshops'), params);
    },
    getDeptGroup (params) {
        return post(('dept/groups'), params);
    },
    getUserWorkshop () {
        return new Promise((resolve, reject) => {
            post('user/data/workshops').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    let workshopList = content.res;
                    let curWorkshopId;
                    if (workshopList.find(x => x.isDefault === 1)) {
                        curWorkshopId = workshopList.find(x => x.isDefault === 1).deptId;
                    } else {
                        curWorkshopId = workshopList[0].deptId;
                    }
                    resolve({workshopList, curWorkshopId});
                }
            }).catch(err => {
                reject(err.data);
            });
        });
    },
    getUserGroups (params) {
        return new Promise((resolve, reject) => {
            post('user/data/groups', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    let shiftGroupList = content.res;
                    let curShiftGroupId;
                    if (shiftGroupList.find(x => x.isDefault === 1)) {
                        curShiftGroupId = shiftGroupList.find(x => x.isDefault === 1).deptId;
                    } else {
                        curShiftGroupId = shiftGroupList[0].deptId;
                    }
                    resolve({shiftGroupList, curShiftGroupId});
                }
                if (content.status === 415) {
                    resolve({});
                }
            }).catch(err => {
                reject(err.data);
            });
        });
    },
    listHttp () {
        return fetch('dept/workshops');
    }
};
