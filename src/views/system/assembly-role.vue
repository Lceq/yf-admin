<template>
    <Card>
        <Col>
            <Table border size="small" :height="tableHeight" :columns="assemblyColumns" :data="assemblyData"></Table>
        </Col>
        <Modal
                v-model="powerModule"
                :title="assemblyMessage"
                :mask-closable="false"
                @on-ok="confirmModule">
            <div>
                <Form ref="assemblyFormValidate" :model="assemblyFormValidate" :rules="assemblyRuleValidate" :label-width="100" :show-message="false">
                    <Row>
                        <Col span="20" offset="2">
                            <FormItem class="formItemMargin" label="模块：" prop="module">
                                <span>{{assemblyFormValidate.moduleName}}</span>
                            </FormItem>
                            <FormItem class="formItemMargin" label="权限名称：" prop="name">
                                <Input v-model="assemblyFormValidate.rightName" placeholder="请输入权限名称"></Input>
                            </FormItem>
                            <FormItem class="formItemMargin" label="权限编号：" prop="code">
                                <Input v-model="assemblyFormValidate.rightCode" placeholder="请输入权限编号"></Input>
                            </FormItem>
                            <FormItem class="formItemMargin" label="备注：" prop="remark">
                                <Input v-model="assemblyFormValidate.remark" placeholder=""></Input>
                            </FormItem>
                            <FormItem class="formItemMargin" label="排序：" prop="sort">
                                <Input style="width: 50px;" v-model="assemblyFormValidate.sorNum" placeholder="0"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <!--<AboutTime-->
                            <!--v-if="isEdit"-->
                            <!--:createTime="'2018-1-1'"-->
                            <!--:reviseTime="'2018-1-1'"-->
                            <!--:forbidTime="'2018-1-1'"-->
                    <!--&gt;-->
                    <!--</AboutTime>-->
                </Form>
            </div>
            <div slot="footer" class="modalFooterStyle">
                <span class="editFormErrorStyle">{{ newAddLowerErrorMsg }}</span>
                <div>
                    <Button type="success" :loading="loading" @click="submitAddSubordinate">确认</Button>
                    <Button v-if="isKeepRemove" type="error" @click="newRemove">删除</Button>
                    <Button class="cancelButton" @click="newAddLowerCancel">取消</Button>
                </div>
            </div>
        </Modal>
        <delete-warning
                :v-model="warnShow"
                :tipMsg="warnMessage"
                :loading="deleteLoading"
                @cancel="onCancelWarn"
                @confirm="onConfirmWarn"
        ></delete-warning>
    </Card>
</template>

<script>
    import AboutTime from '../public/AboutTime';
    import deleteWarning from '../public/deleteWarning';
    import publicJs from '../../libs/common';
    export default {
        components: {
            AboutTime,
            deleteWarning
        },
        data () {
            return {
                tableHeight: document.documentElement.clientHeight - 160,
                warnShow: false,
                warnMessage: '',
                deleteLoading: false,
                isAdd: false,
                isEdit: false,
                hiddenDelete: false,
                isKeepRemove: false,
                assemblyMessage: '',
                currentModuleId: '',
                currentModuleData: '',
                loading: false,
                powerModule: false,
                newAddLowerErrorMsg: '',
                assemblyFormValidate: {},
                assemblyRuleValidate: {
                    name: [
                        {required: true, trigger: 'blur'}
                    ],
                    code: [
                        {required: true, trigger: 'blur'}
                    ]
                },
                assemblyColumns: [
                    {
                        title: '模块名称',
                        width: 250,
                        key: 'name',
                        render: (h, params) => {
                            const _this = this;
                            return h('div', [
                                h('Div', {
                                }, [
                                    h('Span', {
                                        style: {
                                        }
                                    }, params.row.moduleName),
                                    h('A', {
                                        style: {
                                            fontSize: '12px;'
                                        },
                                        on: {
                                            'click': (val) => {
                                                _this.newAddLowerErrorMsg = '';
                                                _this.powerModule = true;
                                                _this.isKeepRemove = false;
                                                _this.isAdd = true;
                                                _this.isEdit = false;
                                                _this.assemblyMessage = '添加权限';
                                                _this.currentModuleCode = params.row.moduleCode;
                                                _this.assemblyFormValidate.moduleName = params.row.moduleName;
                                                _this.currentModuleId = params.row.moduleId;
                                                _this.assemblyFormValidate.rightName = '';
                                                _this.assemblyFormValidate.rightCode = '';
                                                _this.assemblyFormValidate.remark = '';
                                                _this.assemblyFormValidate.sorNum = '';
                                                // debugger
                                            }
                                        }
                                    }, '[添加权限]')
                                ])
                            ]);
                        }
                    },
                    {
                        title: '权限项',
                        key: 'rightItems',
                        render: (h, params) => {
                            // const paramsData = params
                            return h('div', [
                                h('Div', {
                                },
                                params.row.rightItems.map(item => {
                                    return h('Span', {
                                        on: {
                                            click: (val) => {
                                                // console.log(params);
                                                // console.log(item.rightName)
                                                this.isEdit = true;
                                                this.isKeepRemove = true;
                                                this.isAdd = false;
                                                this.newAddLowerErrorMsg = '';
                                                this.assemblyMessage = '编辑权限';
                                                this.currentModuleId = params.row.moduleId;
                                                this.getAssemblyDetail(item.id);
                                            }
                                        }
                                    }, [
                                        h('Span', {
                                        }, item.rightName),
                                        h('A', {
                                            style: {marginRight: '10px'}
                                        }, '(' + item.rightCode + ')')
                                    ]);
                                })
                                )
                            ]);
                        }
                    }
                ],
                assemblyData: []
            };
        },
        methods: {
            getAssemblyDetail (id) {
                const _this = this;
                // debugger
                this.$fetch('right/item/detail/' + id).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.assemblyFormValidate.moduleName = _this.assemblyData.find(x => x.moduleId === content.res.moduleId).moduleName;
                        _this.assemblyFormValidate.moduleId = content.res.moduleId;
                        _this.assemblyFormValidate.rightName = content.res.rightName;
                        _this.assemblyFormValidate.rightCode = content.res.rightCode;
                        _this.assemblyFormValidate.remark = content.res.remark;
                        _this.assemblyFormValidate.sorNum = content.res.sorNum;
                        _this.assemblyFormValidate.id = content.res.id;
                        // console.log(_this.assemblyFormValidate);
                        this.powerModule = true;
                        // debugger
                    }
                });
            },
            // 获取模块code的列表
            getModuleCode () {
                // debugger
                const _this = this;
                this.$fetch('right/module/list').then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        // console.log('获取模块列表');
                        _this.assemblyData = (content.res || []).map(item => {
                            return {
                                moduleId: item.moduleId,
                                moduleName: item.moduleName,
                                moduleCode: item.moduleCode,
                                rightItems: item.rightItems
                            };
                        });
                    }
                }).catch(function (error) {
                    this.$Modal.error({
                        title: '网络错误',
                        content: error
                    });
                });
            },
            confirmModule () {
                // console.log(2);
            },
            newAddLowerCancel () {
                // console.log('取消');
                this.powerModule = false;
                this.loading = false;
            },
            newRemove () {
                // console.log('删除');
                this.warnShow = true;
                this.warnMessage = '确认删除？';
                // debugger
            },
            submitAddSubordinate () {
                // console.log('确认');
                if (this.assemblyFormValidate.rightName === '') {
                    this.newAddLowerErrorMsg = '权限项名称不能为空';
                    return false;
                }
                if (this.assemblyFormValidate.rightCode === '') {
                    this.newAddLowerErrorMsg = '权限项代码不能为空';
                    return false;
                }
                const _this = this;
                const params = {
                    moduleId: this.currentModuleId,
                    moduleCode: this.currentModuleCode,
                    rightName: this.assemblyFormValidate.rightName,
                    rightCode: this.assemblyFormValidate.rightCode,
                    remark: this.assemblyFormValidate.remark,
                    sorNum: this.assemblyFormValidate.sorNum,
                    id: this.isEdit === true ? this.assemblyFormValidate.id : ''
                };
                // debugger
                this.loading = true;
                this.$post('right/item/save', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        // console.log('保存成功');
                        this.loading = false;
                        this.$Message.success('保存成功');
                        _this.getModuleCode();
                    } else {
                        this.$Modal.error({
                            title: '保存失败',
                            content: content.message
                        });
                    }
                }).catch(function (error) {
                    this.$Modal.error({
                        title: '网络错误',
                        content: error
                    });
                });
                this.powerModule = false;
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
                    if (content.status === 200) {
                        // console.log('删除成功');
                        this.deleteLoading = false;
                        this.warnShow = false;
                        this.powerModule = false;
                        this.$Message.success('删除成功');
                        _this.getModuleCode();
                    }
                });
            }
        },
        mounted () {
            this.getModuleCode();
            window.onresize = () => {
                this.tableHeight = publicJs.compClientHeight(160);
            };
        }
    };
</script>

<style scoped>

</style>
