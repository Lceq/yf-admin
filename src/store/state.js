import Cookies from 'js-cookie';
const state = {
    serverFindList: [],
    serviceList: localStorage.serviceList ? JSON.parse(localStorage.serviceList) : [],
    curProcessId: Cookies.get('curProcessId'),
    menuActiveName: localStorage.menu ? JSON.parse(localStorage.menu) : '1-2',
    menuOpenName: ['1'],
    curRightRoute: '',
    moduleRightItems: [],
    documentHeight: '',
    // 是否会乱码
    codeTestChinese: false,
    maniViewHeight: 0,
    addRouterList: [],
    allModuleList: [] // 所有模块列表
};
export default state;
