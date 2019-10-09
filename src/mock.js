
// 导入请求方法
var axios = require('axios');
// 导入依赖的插件
var MockAdapter = require('axios-mock-adapter');

// 实例化对象
var mock = new MockAdapter(axios);

// 模拟请求接口和返回数据
// arguments (status == 响应状态, data == 响应数据, headers == 响应头部信息)
mock.onGet('/user/list').reply(200, {
    users: [
        {
            id: 21,
            name: 'jiang',
            code: 'sss',
            state: 1,
            sort_num: 0,
            dept_id: 1,
            dept_name: 'testdept',
            corp: 1
        }
    ]
});

mock.onGet('/menus').reply(200, {
    menus: [
        {
            path: '/group',
            icon: 'ios-folder',
            name: 'group',
            title: 'GroupAA',
            component: 'Main',
            children: [
                {
                    path: 'page1',
                    icon: 'ios-paper-outline',
                    name: 'page1',
                    title: 'Page1',
                    component: 'page1'
                },
                {
                    path: 'page2',
                    icon: 'ios-list-outline',
                    name: 'page2',
                    title: 'Page2',
                    component: 'page2'
                }
            ]
        }
    ]
});

// 导出
export default mock;
