import { filZero } from '../filters/filZero';
import axios from 'axios';
import {Notice, Message, Modal} from 'iview';
import mathJs from 'mathjs';
export default {
    pageOpts: [20, 50, 100], // 每页的条数
    pageSize: 20,
    pageUp: 'top', // 每页条数显示方向
    defaultWorkshopId: 21, // 默认车间id
    defaultProcessId: 0,
    isTimeout: false,
    defaultImgPath: 'https://service.shengtex.com/images/default.png',
    compClientHeight: (height) => {
        return document.documentElement.clientHeight - height;
    },
    getDate: () => {
        // 获取当前的时间
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let hour = d.getHours();
        let minute = d.getMinutes();
        let second = d.getSeconds();
        let date = year + '-' + filZero(month) + '-' + filZero(day) + ' ' + filZero(hour) + ':' + filZero(minute) + ':' + filZero(second);
        return date;
    },
    formatDate (d) {
        let date = new Date(d);
        return date.getFullYear() + '-' + filZero((date.getMonth() + 1)) + '-' + filZero(date.getDate()) + ' ' + filZero(date.getHours()) + ':' + filZero(date.getMinutes()) + ':' + filZero(date.getSeconds());
    },
    getToday: () => {
        // 获取当前的时间
        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        let date = year + '-' + filZero(month) + '-' + filZero(day);
        return date;
    },
    getCurrentMonth: () => {
        // 获取当前的时间
        let d;
        d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let day = '1';
        let hour;
        hour = d.getHours();
        let minute;
        minute = d.getMinutes();
        let second = d.getSeconds();
        let date = year + '-' + filZero(month) + '-' + filZero(day) + ' ' + filZero(hour) + ':' + filZero(minute) + ':' + filZero(second);
        return date;
    },
    // 加法运算
    addNum (num1, num2) {
        let sq1, sq2, m;
        try {
            sq1 = num1.toString().split('.')[1].length;
        } catch (e) {
            sq1 = 0;
        }
        try {
            sq2 = num2.toString().split('.')[1].length;
        } catch (e) {
            sq2 = 0;
        }
        m = Math.pow(10, Math.max(sq1, sq2));
        return (num1 * m + num2 * m) / m;
    },
    // 乘法计算
    accMul (arg1, arg2) {
        var m = 0, s1 = arg1.toString(),
            s2 = arg2.toString();
        try {
            m += s1.split('.')[1].length;
        } catch (e) {}
        try {
            m += s2.split('.')[1].length;
        } catch (e) {}
        return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
    },
    // 工序层级
    processLevel () {
        let firstProcessList = [];
        let twoProcessList = [];
        axios.post('process/list', {
            auditState: 3,
            state: 1
        }).then((res) => {
            if (res.data.status === 200) {
                let responseData = res.data.res;
                responseData.forEach((item) => {
                    item.value = item.id;
                    item.label = item.name;
                    // 分别获取一级和二级工序
                    if (item.parentId === 0) {
                        firstProcessList.push(item);
                    } else {
                        twoProcessList.push(item);
                    };
                });
                let num = 0;
                firstProcessList.forEach((firstProcess, index) => {
                    twoProcessList.forEach((twoProcessObj) => {
                        if (twoProcessObj.parentId === firstProcess.id) {
                            num++;
                            twoProcessObj.style = 'margin-left:10px;';
                            twoProcessObj.renderStyle = '10px';
                            firstProcessList.splice(index + num, 0, twoProcessObj);
                        }
                    });
                });
            };
        });
        return new Promise((resolve, reject) => resolve(firstProcessList));
    },
    // 拼树方法
    toTree (data) {
        data.forEach((item) => {
            delete item.children;
        });
        let map = {};
        data.forEach((item) => {
            map[item.id] = item;
        });
        let val = [];
        data.forEach((item) => {
            let parent = map[item.parentId];
            if (parent) {
                item.title = item.name;
                item.label = item.name;
                item.value = item.id;
                (parent.children || (parent.children = [])).push(item);
            } else {
                item.title = item.name;
                item.label = item.name;
                item.value = item.id;
                val.push(item);
            }
        });
        return val;
    },
    // 清除字符前后空格
    clearSpace (str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    // 状态翻译为中文(数组或单个状态)
    translateChinese (params) {
        if (Array.isArray(params) === true) {
            if (params.length !== 0) {
                params.forEach((item) => {
                    switch (item.auditState) {
                        case 0:
                            item.auditStateName = '暂存';
                            break;
                        case 1:
                            item.auditStateName = '创建';
                            break;
                        case 2:
                            item.auditStateName = '待审核';
                            break;
                        case 3:
                            item.auditStateName = '已审核';
                            break;
                        case 4:
                            item.auditStateName = '已关闭';
                            break;
                    };
                    // 禁用状态
                    switch (item.enableState) {
                        case 0:
                            item.enableStateName = '禁用';
                            break;
                        case 1:
                            item.enableStateName = '启用';
                            break;
                    };
                });
            };
        } else {
            switch (params) {
                case 0:
                    params = '暂存';
                    break;
                case 1:
                    params = '创建';
                    break;
                case 2:
                    params = '待审核';
                    break;
                case 3:
                    params = '已审核';
                    break;
                case 4:
                    params = '已关闭';
                    break;
            };
        };
        return params;
    }
};
// 乘法
const accMul = (arg1, arg2) => {
    var m = 0, s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split('.')[1].length;
    } catch (e) { }
    try {
        m += s2.split('.')[1].length;
    } catch (e) { }
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
};
// 加法
const addNum = (num1, num2) => {
    var sq1, sq2, m;
    try {
        sq1 = num1.toString().split('.')[1].length;
    } catch (e) {
        sq1 = 0;
    }
    try {
        sq2 = num2.toString().split('.')[1].length;
    } catch (e) {
        sq2 = 0;
    }
    m = Math.pow(10, Math.max(sq1, sq2));
    return (num1 * m + num2 * m) / m;
};
// 减法
const accSub = (num1, num2) => {
    var r1, r2, m, n;
    try {
        r1 = num1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = num2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return (Math.round(num1 * m - num2 * m) / m).toFixed(n);
};
// 除法
const accDivision = (arg1, arg2) => {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split('.')[1].length;
    } catch (e) {}
    try {
        t2 = arg2.toString().split('.')[1].length;
    } catch (e) {}
    r1 = Number(arg1.toString().replace('.', ''));
    r2 = Number(arg2.toString().replace('.', ''));
    return (r1 / r2) * Math.pow(10, t2 - t1);
};


// 请使用以下封装的方法（上面为历史代码，谨慎使用）
// 状态转换为中文
const translateState = (params) => {
    if (Array.isArray(params) === true) {
        if (params.length !== 0) {
            params.forEach((item) => {
                switch (item.auditState) {
                    case 0:
                        item.auditStateName = '暂存';
                        break;
                    case 1:
                        item.auditStateName = '创建';
                        break;
                    case 2:
                        item.auditStateName = '待审核';
                        break;
                    case 3:
                        item.auditStateName = '已审核';
                        break;
                    case 4:
                        item.auditStateName = '已关闭';
                        break;
                };
                // 禁用状态
                switch (item.enableState) {
                    case 0:
                        item.enableStateName = '禁用';
                        break;
                    case 1:
                        item.enableStateName = '启用';
                        break;
                };
                // 引用状态
                switch (item.isQuote) {
                    case false:
                        item.isQuoteName = '未引用';
                        break;
                    case true:
                        item.isQuoteName = '已引用';
                        break;
                };
            });
        };
    } else {
        switch (params) { // 单据状态
            case 0:
                params = '暂存';
                break;
            case 1:
                params = '创建';
                break;
            case 2:
                params = '待审核';
                break;
            case 3:
                params = '已审核';
                break;
            case 4:
                params = '已关闭';
                break;
        };
    };
    return params;
};
/*  操作提示，如： 审核成功！
    参数：_this不是必传
*/
const noticeTips = (_this, type) => {
    switch (type) {
        case 'saveTips':
            Notice.success({ title: '提示', desc: '保存成功!' });
            break;
        case 'submitTips':
            Notice.success({ title: '提示', desc: '提交成功!' });
            break;
        case 'cancelTips':
            Notice.success({ title: '提示', desc: '撤销提交成功!' });
            break;
        case 'auditTips':
            Notice.success({ title: '提示', desc: '审核成功!' });
            break;
        case 'unAuditTips':
            Notice.success({ title: '提示', desc: '撤销审核成功!' });
            break;
        case 'closeTips':
            Notice.success({ title: '提示', desc: '关闭单据成功!' });
            break;
        case 'unCloseTips':
            Notice.success({ title: '提示', desc: '撤销关闭成功!' });
            break;
        case 'deleteTips':
            Notice.success({ title: '提示', desc: '删除成功!' });
            break;
        case 'disableTips':
            Notice.success({ title: '提示', desc: '禁用成功!' });
            break;
        case 'enableTips':
            Notice.success({ title: '提示', desc: '启用成功!' });
            break;
        case 'quoteTips':
            Modal.warning({ title: '提示', content: '单据已被引用，不能进行撤销审核!' });
            break;
        case 'unCheckTips':
            Notice.warning({ title: '提示', desc: '请选择操作对象!' }); // 慎用，用emptyTips取代
            break;
        case 'unCompleteTips':
            Message.warning('请填写完整!'); // 表单验证的提示
            break;
        default:
            Notice.success({ title: '提示', desc: '操作成功!' });
    };
};
/* 自定义内容notice提示： desc提示内容;type提示的类型;title提示的标题 */
const emptyTips = (_this, desc, type = 'warning', title = '提示') => {
    return Notice[type]({ title: title, desc: desc });
};
// 设置分页组件的参数
const setPage = {
    pageSize: 20,
    pageUp: 'top',
    pageOpts: [20, 50, 100]
};
// 设置输入框input的字符长度
const setInputLength = {
    pageSize: 20, // 弃用，使用setPage替代
    pageUp: 'top', // 弃用，使用setPage替代
    pageOpts: [20, 20, 50], // 弃用，使用setPage替代
    remarks: 100,
    code: 50,
    name: 100
};
// 日期格式转换（精确到秒）
const formatDate = (d) => {
    let date = new Date(d);
    return date.getFullYear() + '-' + filZero((date.getMonth() + 1)) + '-' + filZero(date.getDate()) + ' ' + filZero(date.getHours()) + ':' + filZero(date.getMinutes()) + ':' + filZero(date.getSeconds());
};
// 日期格式转换（精确到日）
const formatDay = (d) => {
    let date = new Date(d);
    return date.getFullYear() + '-' + filZero((date.getMonth() + 1)) + '-' + filZero(date.getDate());
};
// 日期格式转换（精确到月份）
const formatMonth = (d) => {
    let date = new Date(d);
    return date.getFullYear() + '-' + filZero((date.getMonth() + 1));
};
// 获取当前日期（精确到天）
const toDay = () => {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let date = year + '-' + filZero(month) + '-' + filZero(day);
    return date;
};
// 清除字符前后空格
const clearSpace = (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, '');
};
// 获取当前时间（精确到秒）
const toDaySeconds = () => {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let hour = d.getHours();
    let minute = d.getMinutes();
    let second = d.getSeconds();
    let date = year + '-' + filZero(month) + '-' + filZero(day) + ' ' + filZero(hour) + ':' + filZero(minute) + ':' + filZero(second);
    return date;
};
// 获取可视区高度
const compClientHeight = (height) => {
    return document.documentElement.clientHeight - height;
};
// 拼树的方法
const toTree = (data) => {
    data.forEach((item) => {
        delete item.children;
    });
    let map = {};
    data.forEach((item) => {
        map[item.id] = item;
    });
    let val = [];
    data.forEach((item) => {
        let parent = map[item.parentId];
        if (parent) {
            item.title = item.code;
            item.label = item.code;
            item.value = item.id;
            (parent.children || (parent.children = [])).push(item);
        } else {
            item.title = item.name;
            item.label = item.name;
            item.value = item.id;
            val.push(item);
        }
    });
    return val;
};
// 获取完整其他信息
const getOperationData = (responseData) => {
    let formActionList = [];
    let createUser = {}; // 创建人
    let updateUser = {}; // 修改人
    createUser.actionName = '创建';
    createUser.userName = responseData.createName;
    createUser.createTime = responseData.createTime;
    updateUser.actionName = '修改';
    updateUser.userName = responseData.updateName;
    updateUser.createTime = responseData.updateTime;
    formActionList = [createUser, updateUser, ...responseData.formActionList];
    return formActionList;
};
// 引用状态翻译中文（参数对象）
const translateIsQuote = (params) => {
    params.isQuote === false ? params.isQuoteName = '未引用' : params.isQuoteName = '已引用';
    return params;
};
// 图标列表
const iconList = [
    {
        name: 'shIcon',
        label: '基础图标',
        icons: ['sh-icon-pinzhongliaoji', 'sh-icon-pinzhongkaitai', 'sh-icon-banzhiguanli', 'sh-icon-technological-parameter', 'sh-icon-gongxuguanli', 'sh-icon-gangweiguanli', 'sh-icon-bianmaguize', 'sh-icon-baoyangleixing', 'sh-icon-gongyipinzhongdingliang', 'sh-icon-gongyiguanli', 'sh-icon-guzhangleixing', 'sh-icon-gongyiluxian', 'sh-icon-jichuziliao', 'sh-icon-jitaifenpei', 'sh-icon-jiaoseguanli', 'sh-icon-icon-test', 'sh-icon-mokuaiguanli', 'sh-icon-measure', 'sh-icon-gongsi', 'sh-icon-peijianguanli', 'sh-icon-kaoqinguizeshezhi', 'sh-icon-paibanguanli', 'sh-icon-pinzhonggongyidan', 'sh-icon-renshiguanli', 'sh-icon-quanxianxiangguanli', 'sh-icon-shebeijixing', 'sh-icon-shengchanbaogong', 'sh-icon-shebeiguanli', 'sh-icon-shengchanguanli', 'sh-icon-sehaoguanli', 'sh-icon-shengchandingdan', 'sh-icon-shebeidanganguanli', 'sh-icon-shengchantongzhidan', 'sh-icon-wuliaoguanli', 'sh-icon-tongjifenxi', 'sh-icon-wuliaofenlei', 'sh-icon-xitongguanli', 'sh-icon-wuliaoshuxing', 'sh-icon-zidian', 'sh-icon-zuzhijiagou', 'sh-icon-zhibanguanli', 'sh-icon-icon-test-copy', 'sh-icon-shucaijiance', 'sh-icon-jijianhesuan', 'sh-icon-guzhanghujiao', 'sh-icon-weixiugongdan', 'sh-icon-renyuanbaobiao', 'sh-icon-banzubaobiao', 'sh-icon-pinzhongbaobiao', 'sh-icon-jitaibaobiao', 'sh-icon-chengbenfenxi', 'sh-icon-guzhangyujing', 'sh-icon-dandingjiance', 'sh-icon-chanchengpindinge', 'sh-icon-huanjingjiance', 'sh-icon-nenghaojiance', 'sh-icon-nenghaodinge', 'sh-icon-jihuapaicheng', 'sh-icon-cushakuguanli', 'sh-icon-peimiandangan', 'sh-icon-pihaoguanli', 'sh-icon-gongyiyujing', 'sh-icon-shujubeifen', 'sh-icon-wuliaozhuisu', 'sh-icon-pinzhongjijiandinge', 'sh-icon-peimianguanli', 'sh-icon-yujingguanli', 'sh-icon-yuanliaodinge', 'sh-icon-zhiliangguanli', 'sh-icon-zhongliangjianyan', 'sh-icon-tairigongfeilirunbiao', 'sh-icon-paichengshitu', 'sh-icon-paichengfabu', 'sh-icon-paichengyunsuan', 'sh-icon-dandingxiaohaodinge', 'sh-icon-zaichanpindinge', 'sh-icon-niandujianyan', 'sh-icon-ziluojianyan', 'sh-icon-zhichengshuaidinge', 'sh-icon-qiangdujianyan', 'sh-icon-peimianpaibaotu', 'sh-icon-huihuadinge', 'sh-icon-huihuaguanli', 'sh-icon-tiaoganjianyan', 'sh-icon-beijianguanli', 'sh-icon-shujujiance', 'sh-icon-shebeibaoyang', 'sh-icon-zhizaoBOMsheji', 'sh-icon-shengchangongxu']
    },
    {
        name: 'iviewIcon',
        label: '其它',
        icons: ['ios-home', 'md-home', 'md-hand', 'md-settings', 'ios-stats', 'ios-list-box', 'ios-document', 'ios-construct', 'ios-card', 'ios-calculator', 'ios-paper', 'ios-book', 'md-school', 'md-person', 'md-apps', 'md-attach', 'md-ribbon', 'md-people', 'md-cog', 'md-body', 'md-construct', 'ios-analytics', 'ios-pie', 'ios-pricetag', 'ios-pricetags', 'ios-bookmarks']
    }
];
const defaultImgPath = 'https://service.shengtex.com/images/default.png';
// 加法
const mathJsAdd = (num1, num2) => {
    return parseFloat(mathJs.format(mathJs.chain(mathJs.bignumber(num1)).add(mathJs.bignumber(num2)).done()));
};
// 减法
const mathJsSub = (num1, num2) => {
    return parseFloat(mathJs.format(mathJs.chain(mathJs.bignumber(num1)).subtract(mathJs.bignumber(num2)).done()));
};
// 除法
const mathJsDiv = (num1, num2) => {
    return parseFloat(mathJs.format(mathJs.chain(mathJs.bignumber(num1)).divide(mathJs.bignumber(num2)).done()));
};
// 乘法
const mathJsMul = (num1, num2) => {
    return parseFloat(mathJs.format(mathJs.chain(mathJs.bignumber(num1)).multiply(mathJs.bignumber(num2)).done()));
};
const getTrees = (list, parentId) => {
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
const formatTree = (items, parentId) => {
    let result = [];
    if (!items[parentId]) {
        return result;
    }
    for (let t of items[parentId]) {
        t.children = formatTree(items, t.id);
        if (t.name.indexOf('/') !== -1) { // 路由存在"/"的在前面拼接'dynamic-router'
            t.name = 'dynamic-router' + t.name.substr(t.name.indexOf('/'));
            t.path = 'dynamic-router' + t.path.substr(t.path.indexOf('/'));
        };
        result.push(t);
    }
    return result;
}
export {
    getTrees,
    mathJsAdd,
    mathJsSub,
    mathJsDiv,
    mathJsMul,
    iconList,
    translateIsQuote,
    noticeTips,
    formatDate,
    formatMonth,
    formatDay,
    setPage,
    toDay,
    translateState,
    clearSpace,
    toDaySeconds,
    compClientHeight,
    toTree,
    getOperationData,
    defaultImgPath,
    setInputLength,
    addNum, // 弃用，使用mathJsAdd替代
    accSub, // 弃用，使用mathJsSub替代
    accMul, // 弃用，使用mathJsMul替代
    accDivision, // 弃用，使用mathJsDiv替代
    emptyTips
};
