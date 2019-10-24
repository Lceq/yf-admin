<template>
    <div>
        <div class="content-bar">
            <Menu @on-select="onSelectMenuEvent" :active-name="activeName" class="content-left" style="width: 160px;">
                <MenuItem name="QH">清花</MenuItem>
                <MenuItem name="SM">梳棉</MenuItem>
                <MenuItem name="YB">预并</MenuItem>
                <MenuItem name="TJ">条卷</MenuItem>
                <MenuItem name="JS">精梳</MenuItem>
                <MenuItem name="MB">末并</MenuItem>
                <MenuItem name="CS">粗纱</MenuItem>
                <MenuItem name="XS">细纱</MenuItem>
                <MenuItem name="LT">络筒</MenuItem>
            </Menu>
            <div class="content-right">
                <Table border :columns="tableHeader" :data="tableData" :loading="showLoading" size="small" :height="tableHeight"></Table>
            </div>
        </div>
        <yf-modal
                :title="savePropsModalTitle"
                :modalState="savePropsModalState"
                :mask-closable="false"
                :confirm-loading="confirmLoading"
                @on-visible-change="savePropsModalStateEvent"
                @on-confirm="savePropsModalConfirmEvent"
                @on-cancel="savePropsModalCancelEvent"
        >
            <div slot="content">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90" :show-message="false">
                    <Row>
                        <Col span="22">
                            <FormItem label="名称：" prop="fieldName" class="margin-bottom-10">
                                <Input v-model="formValidate.fieldName"></Input>
                            </FormItem>
                        </Col>
                        <Col span="22">
                            <FormItem label="字段：" class="margin-bottom-10">
                                <div class="read-only-item">{{formValidate.fieldCode}}</div>
                            </FormItem>
                        </Col>
                        <Col span="22">
                            <FormItem label="排序：" class="margin-bottom-10">
                                <InputNumber v-model="formValidate.sort"></InputNumber>
                            </FormItem>
                        </Col>
                        <!--<Col span="22">
                            <FormItem label="是否展示：" class="margin-bottom-10">
                                <Checkbox v-model="formValidate.enable"></Checkbox>
                            </FormItem>
                        </Col>-->
                    </Row>
                </Form>
            </div>
        </yf-modal>
    </div>
</template>
<script>
    import { noticeTips } from '../../../libs/common';
    export default {
        name: 'scada-config',
        data () {
            const validateName = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateCode = (rule, value, callback) => value ? callback() : callback(new Error());
            return {
                tableHeight: this.$store.state.maniViewHeight - 50,
                confirmLoading: false,
                showLoading: false,
                activeName: 'QH',
                menuVal: '',
                savePropsModalTitle: '',
                savePropsModalState: false,
                formValidate: {
                    fieldName: '',
                    fieldCode: ''
                },
                ruleValidate: {
                    fieldName: [{required: true, validator: validateName, trigger: 'change'}],
                    fieldCode: [{required: true, validator: validateCode, trigger: 'change'}]
                },
                tableHeader: [
                    {title: '字段', key: 'fieldCode', align: 'left', minWidth: 120, sortable: true},
                    {title: '名称', key: 'fieldName', align: 'left', sortable: true, minWidth: 120},
                    {title: '排序', key: 'sort', align: 'left', minWidth: 120},
                    {
                        title: '是否展示',
                        key: 'enable',
                        sortable: true,
                        minWidth: 120,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.enable ? '是' : '否'
                                }
                            });
                        }
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    'click': () => {
                                        this.onEditEvent(params.row);
                                    }
                                }
                            }, '编辑');
                        }
                    }
                ],
                tableData: []
            };
        },
        methods: {
            onSelectMenuEvent (name) {
                this.activeName = name;
                this.getListData();
            },
            onEditEvent (row) {
                this.savePropsModalTitle = '编辑';
                row.enable ? row.enable = true : row.enable = false;
                this.formValidate = JSON.parse(JSON.stringify(row));
                this.savePropsModalState = true;
            },
            savePropsModalStateEvent (e) {
                this.savePropsModalState = e;
                if (!e) {
                    this.formValidate = {};
                }
            },
            savePropsModalConfirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.confirmLoading = true;
                        this.saveData();
                        noticeTips(this, 'saveTips');
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    }
                });
            },
            savePropsModalCancelEvent () {
                this.savePropsModalState = false;
            },
            saveData () {
                this.$call('data.allocation.save', {
                    ...this.formValidate,
                    processCode: this.activeName
                }).then(res => {
                    if (res.data.status === 200) {
                        this.savePropsModalState = false;
                        this.getListData();
                        this.confirmLoading = false;
                    } else {
                        this.confirmLoading = false;
                    };
                });
            },
            getListData () {
                this.showLoading = true;
                this.$call('data.allocation.config.list', { processCode: this.activeName }).then(res => {
                    if (res.data.status === 200) {
                        this.tableData = res.data.res;
                        this.showLoading = false;
                    };
                });
            }
        },
        mounted () {
            this.tableHeight = this.$store.state.maniViewHeight - 50;
            window.addEventListener('resize', () => {
                this.tableHeight = this.$store.state.maniViewHeight - 50;
            })
            this.getListData();
        }
    };
</script>
<style scoped lang="less">
    .content-bar {
        position: relative;
        .content-left {
            position: absolute;
            left: 0;
        }
        .content-right {
            width: 100%;
            position: absolute;
            padding-left: 170px;
        }
    }

</style>
