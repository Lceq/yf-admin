<template>
    <Card>
        <div>
            <Row id="selectedHeight" class="parentFlexBetween marginBottom">
                <Col class="leftFlex">
                    <Button class="margin-right-5" type="success" @click="addNumber">新增</Button>
                    <Button :disabled="!selectedIds.length" type="error" @click="deleteClick">删除</Button>
                </Col>
                <Col>
                    <!--<span class="">车间：</span>-->
                    <!--<Select class="formWidth textLeft" clearable v-model="workshopId">-->
                        <!--<Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>-->
                    <!--</Select>-->
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table :height="tableHeight" border @on-selection-change="changeSelected" :data="numberList" :columns="numberColumns"></Table>
                </Col>
            </Row>
        </div>
        <modal
            :isShow="show"
            :title="title"
            @submit="submit"
            @cancel="cancel">
            <div slot="content">
                <Form ref="numberValidate" :label-width="98" :model="numberValidate" :rules="numberValidateRules" :show-message="false">
                    <Row>
                        <Col>
                            <FormItem label="支数：" prop="yarnCount" class="formItemMargin">
                                <Input class="modal-readonly" v-model="numberValidate.yarnCount" />
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="系数：" prop="coefficient" class="formItemMargin">
                                <Input class="modal-readonly" v-model="numberValidate.coefficient" />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        </modal>
        <delete-warning
            :v-model="deleteWarnShow"
            :tipMsg="deleteWarnMsg"
            :loading="deleteWarnLoading"
            @cancel="deleteWarnCancel"
            @confirm="deleteWarnConfirm"
        ></delete-warning>
    </Card>
</template>
<script>
import modal from '../../public/modal';
import deleteWarning from '../../public/deleteWarning';
import xwValidate from './../../../libs/xwValidate';
export default {
    name: 'number',
    components: {
        modal,
        deleteWarning
    },
    data () {
        return {
            deleteWarnShow: false,
            deleteWarnLoading: false,
            deleteWarnMsg: '',
            show: false,
            tableHeight: '',
            numberValidate: {
                yarnCount: '',
                coefficient: ''
            },
            numberValidateRules: {
                yarnCount: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                coefficient: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ]
            },
            title: '',
            numberList: [],
            editId: null,
            selectedIds: [],
            numberColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '支数',
                    key: 'yarnCount',
                    align: 'center',
                    sortable: true,
                    minWidth: 130,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    this.editId = params.row.id;
                                    this.$call('product.coefficient.detail', {id: params.row.id}).then(res => {
                                        let content = res.data;
                                        if (content.status === 200) {
                                            this.numberValidate = content.res;
                                            this.show = true;
                                            this.title = '编辑';
                                        }
                                    });
                                }
                            }
                        }, params.row.yarnCount);
                    }
                },
                {
                    title: '系数',
                    key: 'coefficient',
                    align: 'center',
                    sortable: true,
                    minWidth: 80
                }
            ]
        };
    },
    methods: {
        deleteWarnConfirm () {
            this.$call('product.coefficient.delete', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.warning('删除成功');
                    this.getNumberList();
                    this.deleteWarnShow = false;
                }
            });
        },
        deleteWarnCancel () {
            this.deleteWarnShow = false;
        },
        changeSelected (val) {
            this.selectedIds = val.map(x => x.id);
        },
        getNumberList () {
            let params = {
                workshopId: this.workshopId
            };
            this.$call('product.coefficient.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.numberList = content.res;
                }
            });
        },
        addNumber () {
            this.show = true;
            this.editId = null;
            this.numberValidate.yarnCount = '';
            this.numberValidate.coefficient = '';
            this.title = '新增';
        },
        deleteClick () {
            this.deleteWarnShow = true;
            this.deleteWarnMsg = '确定要删除吗？';
        },
        submit () {
            this.$refs['numberValidate'].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.editId,
                        yarnCount: this.numberValidate.yarnCount,
                        coefficient: this.numberValidate.coefficient
                    };
                    this.$call('product.coefficient.save', params).then(res => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.getNumberList();
                            this.selectedIds = [];
                            this.$Message.success('保存成功');
                            this.show = false;
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        cancel () {
            this.show = false;
        },
        // 判断是否有默认车间
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.getNumberList();
            });
        }
    },
    mounted () {
        this.getUserWorkshop();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 200;
        });
        window.onresize = () => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 200;
        };
    }
};
</script>

<style scoped>

</style>
