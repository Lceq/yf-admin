<template>
    <div>
        <Card>
            <Row :gutter='16'>
                <Col>
                    <Row class="buttonBottom">
                        <Button @click="addNewRole" type="success">添加</Button>
                    </Row>
                    <Row class="margin-top-10">
                        <Table :height="tableHeight" size="small" :loading="tableLoading" border ref="selection" :columns="columns4" :data="tableData"></Table>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Modal v-model="addEditShow"
                           :title="addEditData"
                           :mask-closable="false">
                        <Form :label-width="130" :model="newFormValidate" :rules="newFormValidateRules" :show-message="false">
                            <Row>
                                <Col :span="20">
                                    <FormItem label="班制名称：" class="formItemMargin" prop="typeName">
                                        <Select v-model="newFormValidate.typeName" style="width:200px">
                                            <Option v-for="item in shiftData" :value="item.typeId" :key="item.typeId">{{item.typeName}}</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="班组名称：" class="formItemMargin" prop="name">
                                        <Input v-model="newFormValidate.name" placeholder="请输入班组名称"></Input>
                                    </FormItem>
                                    <FormItem class="formItemMargin" prop="beginHour" label="开始时间：">
                                        <TimePicker v-model="newFormValidate.beginHour" @on-change="getBeginTime" format="HH:mm" :value="beginHour" placeholder="请选择时间" style="width: 112px"></TimePicker>
                                    </FormItem>
                                    <FormItem class="formItemMargin" prop="endHour" label="结束时间：">
                                        <TimePicker v-model="newFormValidate.endHour" @on-change="getEndTime" format="HH:mm" :value="endHour" placeholder="请选择时间" style="width: 112px"></TimePicker>
                                    </FormItem>
                                    <FormItem class="formItemMargin" prop="remark" label="备注：">
                                        <Input v-model="newFormValidate.remark" type="textarea" :rows="4" placeholder="请输入..."></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        <modal-button
                                slot="footer"
                                :WarnMsg="newAddLowerErrorMsg"
                                :loading="loading"
                                @cancel="newAddLowerCancel"
                                @submit="submitAddSubordinate"
                        >
                        </modal-button>
                    </Modal>
                    <delete-warning
                        :v-model="warnShow"
                        :tipMsg="warnMessage"
                        :loading="deleteLoading"
                        @cancel="onCancelWarn"
                        @confirm="onConfirmWarn"
                    ></delete-warning>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    import api from '../../ajax/api';
    import deleteWarning from '../public/deleteWarning';
    import modalButton from '../public/modalButton';
    import publicJs from '../../libs/common';
    export default {
        components: {
            deleteWarning,
            modalButton
        },
        data () {
            return {
                tableHeight: document.documentElement.clientHeight - 236,
                tableLoading: false,
                deleteLoading: false,
                loading: false,
                treeIndex: '',
                typeName: '',
                addEditShow: false,
                addEditData: '',
                warnShow: false,
                apartIndex: 0,
                warnMessage: '',
                beginHour: '',
                editData: '',
                endHour: '',
                deleteRow: '',
                isAdd: false,
                isEdit: false,
                isSureDelete: false,
                newAddLowerErrorMsg: '',
                newFormValidate: {
                    typeName: '',
                    name: '',
                    remark: '',
                    beginHour: '',
                    endHour: ''
                },
                newFormValidateRules: {
                    typeName: [
                        {required: true, message: 'The code cannot be empty', trigger: 'blur'}
                    ],
                    name: [
                        { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    ]
                },
                columns4: [
                    // {
                    //     type: 'selection',
                    //     width: 60,
                    //     align: 'center'
                    // },
                    {
                        title: '班制',
                        sortable: true,
                        key: 'typeName'
                    },
                    {
                        title: '名称',
                        sortable: true,
                        key: 'name'
                    },
                    {
                        title: '开始时间',
                        sortable: true,
                        key: 'beginHour'
                    },
                    {
                        title: '结束时间',
                        sortable: true,
                        key: 'endHour'
                    },
                    {
                        title: '备注',
                        key: 'remark'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 180,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        // type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            // const _this = this
                                            this.newAddLowerErrorMsg = '';
                                            // console.log(params.index);
                                            this.addEditShow = true;
                                            this.addEditData = '编辑班制';
                                            this.isEdit = true;
                                            this.getShiftDetail(params.row.id);
                                            // this.editData = params.row;
                                            // this.newFormValidate.name = params.row.name;
                                            // this.newFormValidate.beginHour = params.row.beginHour;
                                            // this.newFormValidate.endHour = params.row.endHour;
                                            // debugger
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        // type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.warnShow = true;
                                            this.warnMessage = '确定要删除吗';
                                            // this.isSureDelete = true;
                                            this.deleteRow = params.row;
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                tableData: [
                    {
                        typeName: '两班制',
                        name: '早1',
                        remark: '12',
                        beginHour: '8:00',
                        endHour: '20:00'
                    }
                ],
                shiftData: [
                    {
                        typeId: 1,
                        typeName: '两班制'
                    }
                ]
            };
        },
        methods: {
            getShiftDetail (id) {
                const _this = this;
                this.$fetch('shift/detail/' + id).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.newFormValidate.id = content.res.id;
                        _this.newFormValidate.name = content.res.name;
                        // this.newFormValidate.typeId = params.row.typeId;
                        _this.newFormValidate.typeName = content.res.typeId;
                        _this.newFormValidate.remark = content.res.remark;
                        _this.newFormValidate.beginHour = content.res.beginHour === 0 ? '00:00' : _this.getTimeStyle(content.res.beginHour);
                        _this.newFormValidate.endHour = content.res.endHour === 0 ? '00:00' : _this.getTimeStyle(content.res.endHour);
                        _this.beginHour = content.res.beginHour === 0 ? '00:00' : _this.getTimeStyle(content.res.beginHour);
                        _this.endHour = content.res.endHour === 0 ? '00:00' : _this.getTimeStyle(content.res.endHour);
                    }
                });
            },
            // 时间格式的转换
            getTimeStyle (time) {
                // debugger
                const timeStyle = time < 1000 ? '0' + time : time + '';
                const obj = timeStyle.substring(0, 2) + ':' + timeStyle.substring(2, 4);
                return obj;
            },
            // 获取时间班次表
            getShiftTime () {
                this.tableLoading = true;
                this.$fetch('shift/list').then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.tableData = (content.res || []).map(item => {
                            return {
                                id: item.id,
                                typeId: item.typeId,
                                typeName: item.typeName,
                                name: item.name,
                                remark: item.remark,
                                beginHour: item.beginHour === 0 ? '00:00' : this.getTimeStyle(item.beginHour),
                                endHour: item.endHour === 0 ? '00:00' : this.getTimeStyle(item.endHour)
                            };
                        });
                        this.$store.dispatch({
                            type: 'hideLoading'
                        });
                        this.tableLoading = false;
                    }
                });
            },
            addNewRole () {
                // console.log('添加按钮');
                this.addEditShow = true;
                this.newAddLowerErrorMsg = '';
                this.isAdd = true;
                this.addEditData = '增加班制';
                this.newFormValidate.name = '';
                // this.newFormValidate.typeId = params.row.typeId;
                this.newFormValidate.typeName = '';
                this.newFormValidate.remark = '';
                this.newFormValidate.id = '';
                this.newFormValidate.beginHour = '00:00';
                this.beginHour = '';
                this.endHour = '';
                this.newFormValidate.endHour = '00:00';
            },
            onCancelWarn () {
                this.warnShow = false;
                this.deleteLoading = false;
            },
            onConfirmWarn () {
                // if (this.isSureDelete) {
                this.deleteLoading = true;
                this.$post('shift/delete/' + this.deleteRow.id).then((res) => {
                    let content = res.data;
                    this.deleteLoading = false;
                    if (content.status === 200) {
                        this.getShiftTime();
                        this.warnShow = false;
                        this.$Message.success('删除成功');
                    }
                });
            },
            newAddLowerCancel () {
                // console.log('取消添加按钮');
                this.loading = false;
                this.addEditShow = false;
            },
            getBeginTime (value) {
                this.beginHour = value;
            },
            getEndTime (value) {
                this.endHour = value;
            },
            getTwentyFour (val) {
                if (val === '' || val.split(':').join('') === '0000') {
                    return 2400;
                } else {
                    return val.split(':').join('');
                }
            },
            submitAddSubordinate () {
                // console.log('添加按钮');
                if (this.newFormValidate.typeName === '') {
                    this.newAddLowerErrorMsg = '班制不能为空';
                    return false;
                }
                if (this.newFormValidate.name === '') {
                    this.newAddLowerErrorMsg = '班组不能为空';
                    return false;
                }
                const _this = this;
                const params = {
                    id: this.newFormValidate.id,
                    name: this.newFormValidate.name,
                    typeId: this.newFormValidate.typeName,
                    typeName: this.shiftData.find(x => x.typeId === this.newFormValidate.typeName).typeName,
                    remark: this.newFormValidate.remark,
                    beginHour: this.getTwentyFour(this.beginHour),
                    endHour: this.getTwentyFour(this.endHour)
                };

                // debugger
                this.loading = true;
                this.$post(api.ShiftManager(), params).then((res) => {
                    let content = res.data;
                    _this.loading = false;
                    if (content.status === 200) {
                        _this.isEdit = false;
                        _this.$Message.success('保存成功');
                        _this.getShiftTime();
                    }
                });
                this.addEditShow = false;
            },
            // 获取班制
            getShifts () {
                this.$fetch('dict/list', {parentcode: 'shift_type'}).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.shiftData = (content.res || []).map(item => {
                            return {
                                typeId: item.id,
                                typeName: item.name
                            };
                        });
                    }
                });
            }
        },
        created () {
            this.getShifts();
            this.getShiftTime();
            window.onresize = () => {
                this.tableHeight = publicJs.compClientHeight(236);
            };
        }
    };
</script>

<style scoped>

</style>
