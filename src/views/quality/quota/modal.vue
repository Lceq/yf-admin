<template>
    <div>
        <div>
            <Modal
                :mask-closable="false"
                v-model="show"
                :closable="false"
                :title="quotaTitle"
                :width="800"
            >
                <div>
                    <Form :label-width="95" ref="formQmProductModelValidate" :model="formQmProductModelValidate" :rules="ruleQmProductModelValidate" :show-message="false">
                    <Row>
                        <Col span="8">
                            <FormItem label="产品编码：" prop="selectProductCode" class="formItemMargin">
                                <select-product-copy
                                    :processId="curProcessId"
                                    :selectProductCode="formQmProductModelValidate.selectProductCode"
                                    @selectProductVal="selectProduct"
                                ></select-product-copy>
                                <!--<select-product-->
                                    <!--v-show="!isCopy"-->
                                    <!--:selectProductCode="formQmProductModelValidate.selectProductCode"-->
                                    <!--@selectProductVal="selectProduct"-->
                                <!--&gt;</select-product>-->
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="规格：" prop="models" class="formItemMargin">
                                <p class="modal-readonly">{{ formQmProductModelValidate.models }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="存货类型：" prop="typeName" class="formItemMargin">
                                <p class="modal-readonly">{{ formQmProductModelValidate.typeName }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="工序：" prop="processId" class="formItemMargin">
                                <p class="modal-readonly">{{ formQmProductModelValidate.curProcessName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="克重偏差±%：" prop="gramDeviation" class="formItemMargin">
                                <!--<p class="modal-readonly">{{ formQmProductModelValidate.gramDeviation }}</p>-->
                                <InputNumber v-model="formQmProductModelValidate.gramDeviation"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="数据状态：" prop="auditState" class="formItemMargin">
                                <p v-if="formQmProductModelValidate.auditState" class="modal-readonly">{{ formQmProductModelValidate.auditState }}</p>
                                <p v-else class="modal-readonly">暂无</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Table border :data="qmProductModelData" :columns="qmProductModelColumns" size="small" :height="400"></Table>
                </Form>
                    <div class="margin-top-10" v-show="!isCopy">
                        <other-message
                            :createName="createName"
                            :createTime="createTime"
                            :updateName="updateName"
                            :updateTime="updateTime"
                            :auditName="auditName"
                            :auditTime="auditTime"
                        >
                        </other-message>
                    </div>
                </div>
                <a class="IconPosition"><Icon class="IconColse" @click="onCancel" type="ios-close" /></a>
                <div slot="footer">
                    <Button type="success" v-if="isCouldSave" :loading="loading" @click="onOk">确认</Button>
                    <Button v-if="isCouldSave" class="cancelButton" @click="onCancel">取消</Button>
                </div>
            </Modal>
        </div>
    </div>
</template>

<script>
import modal from '../../public/modal';
import otherMessage from '../../components/otherMessage';
import selectProduct from '../../components/xw-select-product/xw-select-xs-product';
import selectProductCopy from '../../components/xw-select-product/xw-select-xs-product-quota';
// import publicJs from '../../../libs/common';
import {auditStateList} from '../../../libs/utilState';
import xwValidate from '../../../libs/xwValidate';

export default {
    name: 'modal',
    components: {
        modal,
        otherMessage,
        selectProduct,
        selectProductCopy
    },
    props: {
        // isCopy: {
        //     type: Boolean
        // },
        saveModalState: {
            type: Boolean
        },
        qmProductDetail: {
            type: Object
        },
        isCouldSave: {
            type: Boolean
        },
        selectProductCodeState: {
            type: Boolean
        }
    },
    data () {
        return {
            isCopy: false,
            isEdit: false,
            // 详情当前的产品编码
            selectProductCode: '1',
            // 人物信息
            isShowTimeMessage: false,
            processId: '',
            createTime: '',
            createName: '',
            updateName: '',
            updateTime: '',
            auditName: '',
            auditTime: '',
            //
            show: false,
            qmProductModalLoading: '',
            formQmProductModelValidate: {
                name: '',
                code: '',
                processId: '',
                models: '',
                gramDeviation: 0,
                typeName: '',
                selectProductCode: '',
                curProcessName: ''
            },
            ruleQmProductModelValidate: {
                selectProductCode: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ]
            },
            qmProductModelData: [],
            qmProductModelColumns: [
                {
                    title: '参数编码',
                    key: 'code',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '参数名称',
                    key: 'name',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '质检类别',
                    key: 'qmTypeName',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '指标上限值',
                    key: 'valueMax',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                min: 0,
                                // placeholder: '两位有效数字',
                                value: params.row.valueMax ? params.row.valueMax : null
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.valueMax = val;
                                    this.qmProductModelData[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '指标下限值',
                    key: 'valueMin',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                min: 0,
                                // placeholder: '两位有效数字',
                                value: params.row.valueMin ? params.row.valueMin : null
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.valueMin = val;
                                    this.qmProductModelData[params.index] = params.row;
                                }
                            }
                        });
                    }
                }
            ],
            loading: false,
            curSelectProductDetail: '',
            curProcessId: '',
            middleProcessId: '',
            processList: [],
            //
            selectProductId: '',
            curProductId: '',
            quotaTitle: '',
            curProductDetailId: null
        };
    },
    methods: {
        // 获取工序
        getProcessList () {
            this.$api.process.getSearchProcessList().then(res => {
                this.processList = res;
            });
        },
        // 取消
        onCancel () {
            this.$emit('cancel');
        },
        // 确定
        onOk () {
            this.$refs['formQmProductModelValidate'].validate((valid) => {
                if (valid) {
                    let isContinue = false;
                    this.qmProductModelData.map(x => {
                        if (Number(x.valueMax) < Number(x.valueMin)) {
                            this.$Modal.warning({
                                title: '提示',
                                content: '<span>参数上限值不能小于参数下限值</span>'
                            });
                            isContinue = true;
                        }
                    });
                    if (isContinue) {
                        return false;
                    }
                    // debugger
                    let params = {
                        id: this.curProductDetailId,
                        processId: this.curProcessId,
                        productId: this.curProductId,
                        productCode: this.formQmProductModelValidate.code,
                        gramDeviation: this.formQmProductModelValidate.gramDeviation,
                        qmProductParamModels: this.qmProductModelData.map(x => {
                            return {
                                qmParamId: x.id,
                                qmParamCode: x.code,
                                qmParamName: x.name,
                                valueMax: Number(x.valueMax),
                                valueMin: Number(x.valueMin)
                            };
                        })
                    };
                    this.$emit('submit', params);
                } else {
                    xwValidate.message();
                }
            });
        },
        //
        // 选择产品
        selectProduct (val) {
            this.curSelectProductDetail = val;
            if (val.id) {
                this.curProductId = val.id;
                this.formQmProductModelValidate.code = val.code;
                this.formQmProductModelValidate.name = val.name;
                this.formQmProductModelValidate.models = val.models;
                this.formQmProductModelValidate.typeName = val.typeName;
                this.formQmProductModelValidate.curProcessName = val.processName;
                // this.curProcessId = this.isCopy ? val.processId : '';
                this.curProcessId = val.processId;
                this.middleProcessId = val.processId;
                this.formQmProductModelValidate.selectProductCode = val.name + ' (' + val.code + ')' + '+++' + Math.random();
                if (!this.isCopy) {
                    if (val.processId) {
                        this.isCanGetParams();
                    } else {
                        this.qmProductModelData = [];
                    }
                }
            } else {
                this.qmProductModelData = [];
                this.formQmProductModelValidate.code = '';
                this.formQmProductModelValidate.selectProductCode = Math.random();
                this.formQmProductModelValidate.name = '';
                this.formQmProductModelValidate.models = '';
                this.formQmProductModelValidate.typeName = '';
                this.formQmProductModelValidate.curProcessName = '';
                this.curProcessId = '';
                this.middleProcessId = '';
            }
        },
        // // 改变工序
        // changeProcess () {
        //     this.isCanGetParams();
        // },
        // 判断是否调用参数----条件是满足工序和产品
        isCanGetParams () {
            if (this.middleProcessId && this.formQmProductModelValidate.code) {
                // 都满足的情况下就获取到数据
                // if (this.processList.find(x => x.id === this.curProcessId).name === '并条') {
                //     this.qmProductModelData = [];
                // } else {
                this.getParamsList();
                // }
            }
        },
        getParamsList () {
            this.$call('qm.param.list2', { processId: this.middleProcessId }).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.qmProductModelData = content.res.map(item => {
                        item.valueMax = null;
                        item.valueMin = null;
                        return item;
                    });
                }
            });
        }
        // onVisibleChange (val) {
        //     this.show = val;
        // }
    },
    mounted () {
        this.getProcessList();
    },
    watch: {
        selectProductCodeState (newData, oldData) {
            // debugger
            this.formQmProductModelValidate.gramDeviation = 0;
            this.formQmProductModelValidate.selectProductCode = null;
        },
        saveModalState (newData, oldData) {
            // debugger
            if (newData) {
                this.formQmProductModelValidate.code = '';
                this.formQmProductModelValidate.name = '';
                this.formQmProductModelValidate.models = '';
                // this.formQmProductModelValidate.gramDeviation = 0;
                this.formQmProductModelValidate.typeName = '';
                this.formQmProductModelValidate.auditState = '';
                this.formQmProductModelValidate.curProcessName = '';
                // this.curProcessId = '';
            } else {
                // this.formQmProductModelValidate.gramDeviation = 0;
                this.formQmProductModelValidate.selectProductCode = '';
                this.isEdit = false;
                this.curProductDetailId = null;
            }
            this.createTime = '';
            this.createName = '';
            this.updateName = '';
            this.updateTime = '';
            this.auditName = '';
            this.auditTime = '';
            this.show = newData;
            this.isCopy = false;
            this.quotaTitle = '新增产品质量指标';
            this.qmProductModelData = [];
        },
        qmProductDetail (newData, oldData) {
            const _this = this;
            if (newData.id) {
                _this.isCopy = newData.isCopy;
                _this.isEdit = true;
                this.quotaTitle = newData.isCopy ? '复制产品质量指标' : (newData.auditState === 3 ? '产品质量指标详情' : '编辑产品质量指标');
                _this.curProductDetailId = newData.isCopy ? null : newData.id;
                _this.formQmProductModelValidate.selectProductCode = newData.productName + ' (' + newData.productCode + ')' + '+++' + Math.random();
                _this.formQmProductModelValidate.code = newData.productCode;
                _this.formQmProductModelValidate.name = newData.productName;
                _this.formQmProductModelValidate.models = newData.productModels;
                _this.formQmProductModelValidate.gramDeviation = newData.gramDeviation;
                _this.formQmProductModelValidate.typeName = newData.productTypeName;
                _this.formQmProductModelValidate.auditState = newData.isCopy ? '暂无' : auditStateList.find(x => x.id === newData.auditState).name;
                // _this.curProcessId = newData.isCopy ? newData.processId : '';
                _this.curProcessId = newData.processId;
                _this.middleProcessId = newData.processId;
                _this.curProductId = newData.productId;
                _this.formQmProductModelValidate.curProcessName = newData.processName;
                this.createTime = newData.createTime;
                this.createName = newData.createName;
                this.updateName = newData.updateName;
                this.updateTime = newData.updateTime;
                this.auditName = newData.auditName;
                this.auditTime = newData.auditTime;
                _this.qmProductModelData = newData.qmProductParamModels.map(item => {
                    return {
                        id: item.qmParamId,
                        code: item.qmParamCode,
                        name: item.qmParamName,
                        qmTypeName: item.qmTypeName,
                        valueMax: Number(item.valueMax),
                        valueMin: Number(item.valueMin)
                    };
                });
                this.show = true;
            } else {
                _this.isEdit = false;
            }
        }
    }
};
</script>

<style scoped>
    .IconPosition{
        position: absolute;
        right: 8px;
        top: -41px;
    }
    .IconColse{
        font-size: 31px;
        cursor: pointer;
        color: #999;
        top:1px;
        transition: color 0.2s ease;
    }
</style>
