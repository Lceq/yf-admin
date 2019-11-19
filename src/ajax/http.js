import axios from 'axios';
import qs from 'qs';
import Cookies from 'js-cookie';
import iView from 'iview';
import store from '../store/index';
import global from '../libs/common';
import xwTools from "../libs/xwTool";
const REQUEST_HOST = process.env.REQUEST_HOST;
// 全局定义请求配置默认值
// axios.defaults.timeout = 10000;
axios.defaults.baseURL = '';

// 请求拦截
axios.interceptors.request.use(
    config => {
        // config.data = qs.stringify(config.data);
        config.headers = {
            'Content-Type': 'application/json',
            // "Access-Control-Allow-Headers":"*",
            'auth-token': Cookies.get('token')
        };
        // 解决ie缓存不更新数据的问题
        let url = config.url;
        if (url.indexOf('http://') < 0 && url.indexOf('https://') < 0) {
            url = REQUEST_HOST + '/' + url;
        }
        if (url.indexOf('?') < 0) {
            url += '?';
        }
        url += '&r=' + Math.random();
        config.url = url;
        iView.LoadingBar.start();
        return config;
    },
    error => {
        iView.LoadingBar.error();
        return Promise.reject(error);
    }
);
// 响应拦截
axios.interceptors.response.use(
    res => {
        if (res.data.status === 200) {
            iView.LoadingBar.finish();
            return res;
        } else if (res.data.status === 415) { // 已存在、被引用
            iView.LoadingBar.destroy();
            // 过滤登录页
            let urls = res.config.url;
            if (urls.indexOf('login') === -1) {
                store.dispatch({
                    type: 'showErrorModal',
                    payload: {
                        message: res.data.message,
                        status: res.data.status
                    }
                });
            }
            return res;
        } else if (res.data.status === 500) {
            iView.LoadingBar.destroy();
            store.dispatch({
                type: 'showErrorModal',
                payload: {
                    message: '服务器端错误，请稍后重试！',
                    status: res.data.status
                }
            });
            return res;
        } else if (res.data.status === 4001) {  // 登录失效
            if (global.isTimeout === false) {
                global.isTimeout = true;
                store.dispatch({
                    type: 'showErrorModal',
                    payload: {
                        message: res.data.message,
                        status: res.data.status
                    }
                });
            }
            return res;
        } else {
            return res;
            iView.LoadingBar.finish();
        }
    },
    error => {
        if (error.message.indexOf('Network Error') >= 0) {
            if (global.isTimeout === false) {
                global.isTimeout = true;
                store.dispatch({
                    type: 'showErrorModal',
                    payload: {
                        message: '网络不可用,请检查网络连接是否正常！'
                    }
                });
            };
        };
        // 处理服务器端返回的错误
        iView.LoadingBar.error();
        return Promise.reject(error);
    }
);

// get
export function fetch (url, data) {
    return axios({
        url: url,
        method: 'get',
        params: data
    });
}

// post
export function post (url, data) {
    return axios({
        url: url,
        data: data,
        method: 'post'
    });
}

export const proxy = {
    async call (serviceName, ...rest) {
        // 根据接口名（如： user.list），获取完整的url地址(如： http://xx.xx.xx:8080/user/list)
        const serviceUrl = await xwTools.getServiceUrlByName(serviceName);
        async function doPost (count = 0) {
            try {
                return await axios.post(serviceUrl, ...rest)
            } catch (e) {
                if (count >= 2) {
                    throw e
                } else {
                    return await doPost(count + 1)
                }
            }
        }
        return await doPost()
    }
};
