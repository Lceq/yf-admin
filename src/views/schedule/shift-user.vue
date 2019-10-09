<template>
    <card>
        <Row>
            <Col span="10">
                <a @click="addTeams" class="addStyle"><Icon type="plus-round"></Icon>添加</a>
                <a @click="deleteTeams" class="addStyle"><Icon type="close"></Icon>删除</a>
                <a @click="moveTeams"><Icon type="arrow-move"></Icon>移动</a>
            </Col>
            <Col span="14">
                <div class="searchModel">
                    <DatePicker :value='dateValue' type="date" placeholder="请选择日期" class="screenMarginRight"></DatePicker>
                    <Select v-model="workshopValue" class="screenMarginRight" placeholder="请选择车间" @on-change="getSearchWorkshop">
                        <Option v-for="item in workshopList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="shiftValue" class="screenMarginRight" placeholder="请选择班次" @on-change="getSearchShift">
                        <Option v-for="item in shiftList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="groupsValue" class="screenMarginRight" placeholder="请选择班组" @on-change="getSearchGroups">
                        <Option v-for="item in groupsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Input v-model="searchData" placeholder="请输入搜索内容" class="searchStyle" @on-enter="searchEnter"/>
                    <Button type="primary" @click="searchClick">查询</Button>
                </div>
            </Col>
        </Row>
        <Row>
            <Col>
                <Table border :columns="tableHeader" :data="tableData"></Table>
            </Col>
        </Row>
        <Row>
            <Col>
                <Modal
                        v-model="moveStatus"
                        title="移动"
                        @on-ok="moveConfirm"
                        @on-cancel="moveCancel"
                        :mask-closable="false"

                >
                    <Form :label-width="100" :show-message="false">
                        <FormItem label="车间：" class="formItemMargin">
                            <span>{{modelCodeIpt}}</span>
                        </FormItem>
                        <FormItem label="日期：" class="formItemMargin">
                            <span>{{date}}</span>
                        </FormItem>
                        <FormItem label="班次：" class="formItemMargin">
                            <Select v-model="moveShiftValue" style="width:200px;margin:0 10px;" placeholder="请选择班次" @on-change="getMoveShift">
                                <Option v-for="item in moveShiftList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="班组：" class="formItemMargin">
                            <Select v-model="moveGroupsValue" style="width:200px;margin:0 10px;" placeholder="请选择班组" @on-change="getMoveGroups">
                                <Option v-for="item in moveGroupsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </Modal>
            </Col>
        </Row>
        <Row>
            <Col>
                <Modal
                        v-model="addStatus"
                        title="添加"
                        @on-ok="addConfirm"
                        @on-cancel="addCancel"
                        :mask-closable="false"
                        @on-visible-change="getAddStatusChange"
                >
                    <Row type="flex" justify="space-between" style="margin:10px 0">
                        <Col class="addHeader">
                            <span class="labelStyle">部门：</span>
                            <Cascader :data="addDeptValueList" change-on-select v-model="addDeptValue" placeholder="请选择部门" @on-change="getAddDept" :clearable="false"></Cascader>
                        </Col>
                        <Col class="addHeader">
                            <span class="labelStyle">名称：</span>
                            <Input type="text" v-model="userNameIpt" placeholder="请输入名称" style="width:130px;margin-right:4px;" @on-enter="addSearchEnter"/>
                            <Button type="primary" @click="addSearchClick">查询</Button>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Table border ref="selection" :columns="addTableHeader" :data="addTableData"></Table>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Page :total="pageTotal" :page-size-opts="pageOpts" size="small" show-total show-elevator show-sizer  :page-size="pageSize" class="pageStyle" @on-change="getPage" @on-page-size-change="pageChange"></Page>
                        </Col>
                    </Row>

                </Modal>
            </Col>
        </Row>
    </card>
</template>


<script>
    import api from '../../ajax/api';

    export default {
        data () {
            return {
                dateValue: '',
                pageIndex: 1,
                pageSize: 5,
                pageTotal: 0,
                pageOpts: [5, 10],
                addDeptValue: [],
                addDeptValueList: [
                    {
                        value: 'beijing',
                        label: '北京',
                        children: [
                            {
                                value: 'gugong',
                                label: '故宫'
                            },
                            {
                                value: 'tiantan',
                                label: '天坛'
                            },
                            {
                                value: 'wangfujing',
                                label: '王府井'
                            }
                        ]
                    }, {
                        value: 'jiangsu',
                        label: '江苏',
                        children: [
                            {
                                value: 'nanjing',
                                label: '南京',
                                children: [
                                    {
                                        value: 'fuzimiao',
                                        label: '夫子庙'
                                    }
                                ]
                            },
                            {
                                value: 'suzhou',
                                label: '苏州',
                                children: [
                                    {
                                        value: 'zhuozhengyuan',
                                        label: '拙政园'
                                    },
                                    {
                                        value: 'shizilin',
                                        label: '狮子林'
                                    }
                                ]
                            }
                        ]
                    }],
                moveGroupsValue: '',
                moveGroupsList: [
                    {
                        label: '前纺甲班',
                        value: '前纺甲班'
                    },
                    {
                        label: '前纺乙班',
                        value: '前纺乙班'
                    }
                ],
                groupsValue: '',
                groupsList: [
                    {
                        label: '前纺甲班',
                        value: '前纺甲班'
                    },
                    {
                        label: '前纺乙班',
                        value: '前纺乙班'
                    }
                ],
                moveShiftList: [
                    {
                        value: '早1',
                        label: '早1'
                    },
                    {
                        value: '中1',
                        label: '中1'
                    }
                ],
                addTableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '编码',
                        key: 'code'
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align: 'center'
                    }
                ],
                addTableData: [],
                userNameIpt: '',
                addShiftValue: '',
                addStatus: false,
                modelCodeIpt: 'table-expand.vue',
                date: '2018-6-20',
                moveStatus: false,
                searchData: '',
                workshopValue: '',
                workshopList: [
                    {
                        value: '一车间',
                        label: '一车间'
                    },
                    {
                        value: '二车间',
                        label: '二车间'
                    }
                ],
                moveShiftValue: '',
                shiftValue: '',
                shiftList: [
                    {
                        value: '早1',
                        label: '早1'
                    },
                    {
                        value: '中1',
                        label: '中1'
                    }
                ],
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '班次',
                        key: 'shift'
                    },
                    {
                        title: '班组',
                        key: 'groups',
                        align: 'center'
                    },
                    {
                        title: '用户编号',
                        key: 'code',
                        align: 'center'
                    },
                    {
                        title: '用户名称',
                        key: 'name',
                        align: 'center'
                    }
                ],
                tableData: [
                    {
                        shift: '早1',
                        groups: '前纺甲班',
                        code: '001',
                        name: '王大锤'
                    }
                ],
                allDepartmentData: [],
                items: [],
                selectDeptArray: []
            };
        },
        methods: {
            // 监听添加框的状态
            getAddStatusChange (e) {
                if (e === false) {
                    // 初始化
                    this.addTableData = [];
                    this.userNameIpt = '';
                    this.pageTotal = 0;
                    this.addDeptValue = [];
                };
            },
            // 获取每页的条数
            pageChange (e) {
                this.pageSize = e;
                // 调用获取部门下的所有员工的请求
                this.getAllStaffHttp();
            },
            // 获取页码
            getPage (e) {
                this.pageIndex = e;
                // 获取页对应的表格数据
                this.$fetch(
                    api.empPageData(this.selectDeptArray.id, this.pageSize, this.pageIndex, this.userNameIpt)
                ).then((res) => {
                    console.log(res);
                    if (res.data.status === 200) {
                        // 赋值表格
                        this.addTableData = res.data.res;
                    }
                });
            },
            // 获取移动栏的班次
            getMoveShift () {},
            // 获取移动栏的班组
            getMoveGroups () {},
            // 获取筛选栏的班次
            getSearchShift () {},
            // 获取筛选栏的班组
            getSearchGroups () {},
            // 添加栏的搜索请求
            addSearchHttp () {
                this.$fetch(
                    api.empPageData(this.selectDeptArray.id, this.pageSize, this.pageIndex, this.userNameIpt)
                ).then((res) => {
                    console.log(res);
                    if (res.data.status === 200) {
                        // 赋值表格
                        this.addTableData = res.data.res;
                        this.pageTotal = res.data.count;
                    }
                });
            },
            // 新增框内的查询点击事件
            addSearchClick () {
                // 调用添加栏的搜索请求
                this.addSearchHttp();
            },
            // 添加栏内搜索框的回车事件
            addSearchEnter () {
                // 调用添加栏的搜索请求
                this.addSearchHttp();
            },
            // 获取部门下的所有员工
            getAllStaffHttp () {
                console.log(this.pageIndex);
                this.$fetch(
                    api.empPageData(this.selectDeptArray.id, this.pageSize, this.pageIndex, this.userNameIpt)
                ).then((res) => {
                    if (res.data.status === 200) {
                        this.pageTotal = 1;
                        setTimeout(() => {
                            this.pageTotal = res.data.count;
                        }, 0);
                        // 赋值表格
                        this.addTableData = res.data.res;
                    };
                });
            },
            // 获取添加栏内的选中的部门(返回数组)
            getAddDept (e, selectedData) {
                // 拿到选中部门对象
                this.selectDeptArray = selectedData[selectedData.length - 1];
                console.log(this.selectDeptArray.id);
                // 清空搜索框的值
                this.userNameIpt = '';
                // 初始化页码
                this.pageIndex = 1;

                // 调用获取部门下的所有员工的请求
                this.getAllStaffHttp();
            },
            // 新增的确认按钮
            addConfirm () {
                this.addStatus = false;
            },
            // 新增的取消按钮
            addCancel () {
                this.addStatus = false;
            },
            // 移动
            moveTeams () {
                this.moveStatus = true;
            },
            // 移动的确认按钮
            moveConfirm () {
                this.moveStatus = false;
            },
            // 移动的取消按钮
            moveCancel () {
                this.moveStatus = false;
            },
            // 新增
            addTeams () {
                this.addStatus = true;
            },
            // 删除
            deleteTeams () {},

            // 搜索的回车事件
            searchEnter () {},
            // 搜索的点击事件
            searchClick () {},
            // 获取筛选栏的车间
            getSearchWorkshop () {},
            // 拼树的方法
            getAllTreeNode (list, parentId) {
                this.items = [];
                for (let i = 0; i < list.length; i++) {
                    let key = list[i].parentId;

                    if (this.items[key]) {
                        this.items[key].push(list[i]);
                    } else {
                        this.items[key] = [];
                        this.items[key].push(list[i]);
                    };
                };
                return this.formatTree(this.items, parentId);
            },
            // 归类tree子节点的方法
            formatTree (items, parentId) {
                let result = [];
                if (!items[parentId]) {
                    return result;
                };
                for (let t of items[parentId]) {
                    t.children = this.formatTree(items, t.id);
                    result.push(t);
                };
                return result;
            },
            // 渲染添加栏的部门级联控件的方法
            getTreeNode () {
                // 调用拼树的方法
                this.getAllTreeNode(this.allDepartmentData, 0);
                // 给每一个节点都添加title
                for (var key in this.items) {
                    this.items[key].forEach((value, index) => {
                        value.title = value.name;
                        // 添加栏的所属部门
                        value.value = value.name;
                        value.label = value.name;
                    });
                };
                // 排除根
                this.addDeptValueList = [];
                this.items[0][0].children.forEach((obj) => {
                    // 赋值给添加员工框的所属部门
                    this.addDeptValueList.push(obj);
                });
            },
            // 获取所有部门信息的方法
            getAllDepartmentData () {
                this.$fetch(
                    api.getDept()
                ).then((res) => {
                    if (res.data.status === 200) {
                        // 得到所有部门的信息
                        this.allDepartmentData = res.data.res;
                        // 调用渲染tree结构的方法
                        this.getTreeNode();
                    };
                });
            }
        },
        created () {
            // 获取所有的部门信息
            this.getAllDepartmentData();
            // 获取当前的时间
            let d = new Date();
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let day = d.getDate();
            // 赋值日期
            this.dateValue = year + '-' + month + '-' + day;
        }

    };
</script>

<style scoped>
    .pageStyle{
        float:right;
        margin-top: 20px;
    }
    .screenMarginRight{
        width:200px;
        margin-right:10px;
    }
    .addStyle{
        margin-right: 20px;
        line-height: 40px
    }
    .searchStyle{
        width: 200px;
        margin-right: 4px;
    }
    .searchModel{
        display: flex;
        justify-content:flex-end;
    }
    .addHeader{
        display:flex;justify-items: center;align-items: center
    }
    .labelStyle{
        width:44px;
        margin-left:4px;
        text-align: center;
    }
</style>