<template>
    <div>
        <Card>
            <Row>
                <Col>
                    <Table :height="tableHeight" :loading="tableLoading" :columns="assemblyColumns" size="small" :data="assemblyData"></Table>
                </Col>
            </Row>
        </Card>
        <modal
            :isShow="assemblyShow"
            :title="assemblyTitle"
            :warnMsg="warnMsg"
            :loading="assemblyLoading"
            :is-delete="isDeleteShow"
            @deleteit="deleteModal"
            @cancel="assemblyCancel"
            @submit="assemblySubmit('assemblyFormValidate')"
        >
            <div slot="content">
                <Form ref="assemblyFormValidate" :model="assemblyFormValidate" :rules="assemblyRuleValidate" :label-width="100" :show-message="false">
                    <Row>
                        <Col span="20" offset="2">
                            <FormItem class="formItemMargin" label="模块：" prop="module">
                            <span>{{assemblyFormValidate.moduleName}}</span>
                            </FormItem>
                            <FormItem class="formItemMargin" label="权限名称：" prop="rightName">
                            <Input v-model="assemblyFormValidate.rightName" placeholder="请输入权限名称"></Input>
                            </FormItem>
                            <FormItem class="formItemMargin" label="权限编号：" prop="rightCode">
                            <Input v-model="assemblyFormValidate.rightCode" placeholder="请输入权限编号"></Input>
                            </FormItem>
                            <FormItem class="formItemMargin" label="备注：" prop="remark">
                            <Input v-model="assemblyFormValidate.remark" placeholder="说明"></Input>
                            </FormItem>
                            <FormItem class="formItemMargin" label="排序：" prop="sort">
                            <Input style="width: 50px;" v-model="assemblyFormValidate.sorNum" placeholder="0"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        </modal>
        <delete-warning
                :v-model="warnShow"
                :tipMsg="warnMessage"
                :loading="deleteLoading"
                @cancel="onCancelWarn"
                @confirm="onConfirmWarn"
        ></delete-warning>
    </div>
</template>
<script>
import DownTable from './table';
import modal from '../../public/modal';
import deleteWarning from '../../public/deleteWarning';
import publicJs from '../../../libs/common';
import xwValidate from '@/libs/xwValidate';
export default {
    components: {
        DownTable,
        deleteWarning,
        modal
    },
    data () {
        return {
            tableLoading: false,
            isDeleteShow: false,
            deleteLoading: false,
            moduleData: [],
            tableHeight: document.documentElement.clientHeight - 160,
            assemblyColumns: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h('Table', {
                            props: {
                                size: 'small',
                                // row: params.row
                                showHeader: false,
                                columns: this.moduleColumns,
                                data: params.row.children
                            }
                        });
                    }
                },
                {
                    title: '模块名称',
                    width: 200,
                    key: 'moduleName'
                },
                {
                    title: '权限项',
                    key: 'rightItem'
                }
            ],
            assemblyData: [],
            moduleColumns: [
                {
                    title: '模块名称',
                    width: 200,
                    key: 'moduleName',
                    render: (h, params) => {
                        return h('Span', [
                            h('Span', {}, params.row.moduleName),
                            h('A', {
                                on: {
                                    click: () => {
                                        this.assemblyTitle = '新增权限';
                                        this.currentModuleCode = params.row.moduleCode;
                                        this.assemblyFormValidate.moduleName = params.row.moduleName;
                                        this.currentModuleId = params.row.moduleId;
                                        this.assemblyFormValidate.rightName = '';
                                        this.assemblyFormValidate.rightCode = '';
                                        this.assemblyFormValidate.remark = '';
                                        this.assemblyFormValidate.sorNum = '';
                                        this.assemblyFormValidate.id = '';
                                        this.isDeleteShow = false;
                                        this.assemblyShow = true;
                                    }
                                }
                            }, '[ 添加权限]')
                        ]);
                    }
                },
                {
                    title: '权限项',
                    key: 'rightItem',
                    render: (h, params) => {
                        return h('Span', {
                        },
                        params.row.rightItems.map(item => {
                            return h('Span', [
                                h('Span', {
                                }, item.rightName),
                                h('A', {
                                    style: {
                                        marginRight: '10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.getModuleDetail(params.row, item.id);
                                        }
                                    }
                                }, '(' + item.rightCode + ')')
                            ]);
                        })
                        );
                    }
                }
            ],
            assemblyShow: false,
            assemblyTitle: '',
            warnMsg: '',
            assemblyLoading: false,
            // powerModule: false,
            assemblyMessage: '',
            // moduleData: assemblyJs.moduleData,
            assemblyFormValidate: {
                moduleId: '',
                moduleName: '',
                rightName: '',
                rightCode: '',
                remark: '',
                sorNum: '',
                id: ''
            },
            assemblyRuleValidate: {
                rightCode: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                rightName: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ]
            },
            isKeepRemove: false,
            newAddLowerErrorMsg: '',
            currentModuleId: '',
            loading: false,
            warnShow: false,
            warnMessage: ''
        };
    },
    methods: {
        // 获取模块code的列表
        getModuleCode () {
            const _this = this;
            this.tableLoading = true;
            this.$fetch('right/module/list').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    let data = [];
                    _this.moduleData = content.res;
                    for (let i of content.res) {
                        if (i.parentId === 1) {
                            let obj = i;
                            obj.children = [];
                            obj._expanded = true;
                            data.push(obj);
                            for (let c of content.res) {
                                if (obj.moduleId === c.parentId) {
                                    data.find(x => x.moduleId === c.parentId).children.push(c);
                                }
                            }
                        }
                    }
                    _this.assemblyData = [];
                    _this.assemblyData = data;
                    _this.tableLoading = false;
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                }
            });
        },
        getModuleDetail (item, id) {
            this.$fetch('right/item/detail/' + id).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger
                    this.assemblyTitle = '编辑权限';
                    this.currentModuleCode = content.res.moduleCode;
                    // this.assemblyFormValidate.moduleName = params.row.moduleName;
                    this.currentModuleId = content.res.moduleId;
                    this.assemblyFormValidate.moduleName = item.moduleName;
                    // this.assemblyFormValidate.moduleId = content.res.moduleId;
                    this.assemblyFormValidate.rightName = content.res.rightName;
                    this.assemblyFormValidate.rightCode = content.res.rightCode;
                    this.assemblyFormValidate.remark = content.res.remark;
                    this.assemblyFormValidate.sorNum = content.res.sorNum;
                    this.assemblyFormValidate.id = content.res.id;
                    // console.log(this.assemblyFormValidate);
                    this.isDeleteShow = true;
                    this.assemblyShow = true;
                }
            });
        },
        assemblyCancel () {
            this.assemblyShow = false;
            this.assemblyLoading = false;
        },
        assemblySubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    const params = {
                        moduleId: this.currentModuleId,
                        moduleCode: this.currentModuleCode,
                        rightName: this.assemblyFormValidate.rightName,
                        rightCode: this.assemblyFormValidate.rightCode,
                        remark: this.assemblyFormValidate.remark,
                        sorNum: this.assemblyFormValidate.sorNum,
                        id: this.assemblyFormValidate.id
                    };
                    // debugger
                    this.assemblyLoading = true;
                    this.$post('right/item/save', params).then(res => {
                        let content = res.data;
                        this.assemblyLoading = false;
                        if (content.status === 200) {
                            this.assemblyShow = false;
                            this.$Message.success('保存成功');
                            this.getModuleCode();
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
            // debugger
        },
        deleteModal () {
            // console.log('删除');
            this.warnMessage = '确认删除？';
            this.warnShow = true;
            // this.assemblyFormValidate.id
        },
        onCancelWarn () {
            this.warnShow = false;
            this.deleteLoading = false;
        },
        onConfirmWarn () {
            const _this = this;
            this.deleteLoading = true;
            this.$post('right/item/delete', this.assemblyFormValidate.id).then((res) => {
                let content = res.data;
                this.deleteLoading = false;
                if (content.status === 200) {
                    // console.log('删除成功');
                    this.warnShow = false;
                    this.assemblyShow = false;
                    this.$Message.success('删除成功');
                    _this.getModuleCode();
                }
            });
        }
    },
    created () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.getModuleCode();
    },
    mounted () {
        window.onresize = () => {
            this.tableHeight = publicJs.compClientHeight(160);
        };
    }
};
</script>
<style scoped>
    td {
        background-color: #fff;
    }
</style>
