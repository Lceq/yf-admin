// import Cookies from 'js-cookie';
// import {post, fetch} from "../ajax/http";
// import store from '../store'

// 获取到当前时间---精确到秒
export const curDatetime = () => {
    let mydate = new Date();
    let y = mydate.getFullYear();
    let m = mydate.getMonth() + 1;
    let d = mydate.getDate();
    if (m < 10) {
        m = '0' + m;
    }
    if (d < 10) {
        d = '0' + d;
    }
    const h = mydate.getHours() < 10 ? '0' + mydate.getHours() + ':' : mydate.getHours() + ':';
    const mi = mydate.getMinutes() < 10 ? '0' + mydate.getMinutes() + ':' : mydate.getMinutes() + ':';
    const s = mydate.getSeconds() < 10 ? '0' + mydate.getSeconds() : mydate.getSeconds();
    return y + '-' + m + '-' + d + ' ' + h + mi + s;
};
// 获取当前时间精确天
export const curDate = () => {
    let mydate = new Date();
    let y = mydate.getFullYear();
    let m = mydate.getMonth() + 1;
    let d = mydate.getDate();
    if (m < 10) {
        m = '0' + m;
    }
    if (d < 10) {
        d = '0' + d;
    }
    return y + '-' + m + '-' + d;
};
export const lastDay = (d = curDate()) => {
    d = new Date(d);
    d = +d - 1000 * 60 * 60 * 24;
    d = new Date(d);
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var e = d.getDate();
    if (m < 10) {
        m = '0' + m;
    }
    if (e < 10) {
        e = '0' + e;
    }
    return y + '-' + m + '-' + e;
};
export const nextDay = (d) => {
    d = new Date(d);
    d = +d + 1000 * 60 * 60 * 24;
    d = new Date(d);
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var e = d.getDate();
    if (m < 10) {
        m = '0' + m;
    }
    if (e < 10) {
        e = '0' + e;
    }
    return y + '-' + m + '-' + e;
};
export const getWeekTime = (n) => {
    // function getTime(n){
    let now = new Date();
    let year = now.getFullYear();
    // 因为月份是从0开始的,所以获取这个月的月份数要加1才行
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let day = now.getDay();
    // console.log(date);
    // 判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
    if (day !== 0) {
        n = n + (day - 1);
    } else {
        n = n + day;
    }
    if (day) {
    // 这个判断是为了解决跨年的问题
        if (month > 1) {
            month = month;
        } else {
            // 这个判断是为了解决跨年的问题,月份是从0开始的
            year = year - 1;
            month = 12;
        }
    }
    now.setDate(now.getDate() - n);
    year = now.getFullYear();
    month = now.getMonth() + 1;
    date = now.getDate();
    // console.log(n);
    let s = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (date < 10 ? ('0' + date) : date);
    return s;
    // }
    // 用法
    // 上周的开始时间
    // console.log(getWeekTime(7));
    // 上周的结束时间
    // console.log(getWeekTime(1));
    // 本周的开始时间
    // console.log(getWeekTime(0));
    // 本周的结束时间
    // console.log(getWeekTime(-6));
};
export const getCurMonth = (n) => {
    // function getTime(n){
    let now = new Date();
    let year = now.getFullYear();
    // 因为本月份的时间n=1为月初，
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let day = now.getDay();
    let s = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (n === 1 ? '01' : (date < 10 ? ('0' + date) : date));
    return s;
};
export const getLastMonth = (n) => {
    // function getTime(n){
    let now = new Date();
    let year = now.getFullYear();
    // 因为本月份的时间n=1为月初，
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let day = now.getDay();
    if (month > 1) {
        month = month - 1;
    } else {
        // 这个判断是为了解决跨年的问题,月份是从0开始的
        year = year - 1;
        month = 12;
    }
    // now.setDate(now.getDate());
    // year = now.getFullYear();
    // month = now.getMonth() + 1;
    let days = new Date(year, month, 0).getDate();
    date = now.getDate();
    let s = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (n === 1 ? '01' : days);
    return s;
};
// 获取默认的页数、页数的方向
export const page = () => {
    let pageOpts = [20, 50, 100];
    let pageSize = 20;
    let pageUp = 'top';
    return {pageOpts, pageSize, pageUp};
};
// 获取树状结构
export const isNull = (n) => {
    return n ? n : 0;
};
export const breakUpList = (List, n) => {
    let data = [];
    let m = 1;
    let num = 0;
    data[num] = [];
    for (let i = 0; i < List.length; i++) {
        data[num].push(List[i]);
        if (m % n === 0) {
            num++;
            data[num] = [];
            m = 0;
        }
        m++;
    }
    return data;
};
