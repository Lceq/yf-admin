import { Message } from 'iview';
import store from '@/store';
// import '../main';
const xwValidate = {};
/**
 * imput框架展示
 * @param rule
 * @param value
 * @param callback
 */
xwValidate.input = (rule, value, callback) => {
    if (value === '' || value === undefined || value === null) {
        callback(new Error());
    } else {
        callback();
    }
};
/**
 * 下拉框展示
 * @param rule
 * @param value
 * @param callback
 */
xwValidate.select = (rule, value, callback) => {
    if (value === '' || value === undefined || value === null || value.length === 0) {
        callback(new Error());
    } else {
        callback();
    }
};
/**
 * 下拉框多选选项
 * @param rule
 * @param value
 * @param callback
 */
xwValidate.selectedMultiple = (rule, value, callback) => {
    if (value.length === 0 || value === undefined || value === null) {
        callback(new Error());
    } else {
        callback();
    }
};
/**
 * 不能输入中文
 * @param rule
 * @param value
 * @param callback
 */
xwValidate.code = (rule, value, callback) => {
    let reg = /[\u4E00-\u9FA5]/;
    if (value === '' || value === undefined || value === null) {
        callback(new Error());
    } else {
        if (reg.test(value)) {
            store.commit('updateCodeTestChinese', true);
            Message.warning('编码不能输入中文');
            callback(new Error());
        } else {
            callback();
        }
    }
};
xwValidate.shortName = (rule, value, callback) => {
    let reg = /[\u4E00-\u9FA5]/;
    if (value === '' || value === undefined || value === null) {
        callback(new Error());
    } else {
        if (reg.test(value)) {
            store.commit('updateCodeTestChinese', true);
            Message.warning('简称不能输入中文');
            callback(new Error());
        } else {
            callback();
        }
    }
};
/**
 * 控制器不能输入中文
 * @param rule
 * @param value
 * @param callback
 */
xwValidate.IP = (rule, value, callback) => {
    let reg = /[\u4E00-\u9FA5]/;
    if (value === '' || value === undefined || value === null) {
        callback(new Error());
    } else {
        if (reg.test(value)) {
            store.commit('updateCodeTestChinese', true);
            Message.warning('控制器IP不能输入中文');
            callback(new Error());
        } else {
            callback();
        }
    }
};
/**
 * 校验提示内容
 */
xwValidate.message = () => {
    if (store.state.codeTestChinese) {
        store.commit('updateCodeTestChinese', false);
    } else {
        Message.warning('请填写完整的信息');
    }
};
export default xwValidate;
