import store from '../store';
import axios from 'axios'
const xwTools = {};

const saveMenu = function (val) {
    localStorage.menu = JSON.stringify(val);
};

const getServiceUrlByName = async function (serviceName){
    if (/\//.test(serviceName)) {
        return serviceName
    }
    let serviceList = store.state.serviceList;
    if (serviceList.length && findUrl(serviceName, serviceList)) {
        return findUrl(serviceName, serviceList);  // 先找本地store仓库有没有该接口对应的完整url地址
    } else {
        try {
            await getService(serviceName);  // 没找到该接口的完整url,就去请求服务获取对应的url对象,并添加到本地store
            serviceList = store.state.serviceList;
        } catch (e) {
            throw (e)
        }
        let serviceUrl = findUrl(serviceName, serviceList);
        if (serviceUrl) {
            return serviceUrl
        } else {
            throw Object({message: `找不到服务${serviceUrl}`})
        }
    }
};
// export default xwTools;
export default {
    getUnion: getUnion,
    saveMenu: saveMenu,
    getServiceUrlByName: getServiceUrlByName,
    getTrees: getTrees
}
const getUnion = function(arr1, arr2) {
    return Array.from(new Set([...arr1, ...arr2]))
}
function findUrl (serviceName, serviceList) {
    let obj = serviceList.find(item => item.serviceName === serviceName);
    return obj ? obj.url : ''
}
const getService = async function(serviceName) { // 获取每个接口(如：user.list)对应的完整url
    let url = process.env.REQUEST_HOST + '/service/url';
    try {
        await axios.post(url, {name: serviceName}).then(res => {
            if (res.data.status === 200) {
                let serviceUrl = res.data.res;
                let obj = {
                    serviceName: serviceName,
                    url: serviceUrl
                };
                store.commit('UPDATE_SERVICE_LIST', obj);  // 将该接口对应的url对象存储在store里
                // let serviceList = store.state.serviceList;
                // serviceList.push(obj);
                // return obj;
            } else {
                throw Object({message: `找不到服务${serviceName}`})
            }
        })
    } catch (e) {
        throw (e)
    }
};
// 获取树状结构
function getTrees (list, parentId) {
    let items = {};
    // 获取每个节点的直属子节点，*记住是直属，不是所有子节点
    for (let i = 0; i < list.length; i++) {
        let key = list[i].parentId;
        if (items[key]) {
            items[key].push(list[i]);
        } else {
            items[key] = [];
            items[key].push(list[i]);
        }
    }
    return formatTree(items, parentId);
};
// 利用递归格式化每个节点/**/
function formatTree(items, parentId) {
    let result = [];
    if (!items[parentId]) {
        return result;
    }
    for (let t of items[parentId]) {
        t.children = formatTree(items, t.id);
        result.push(t);
    }
    return result;
}
