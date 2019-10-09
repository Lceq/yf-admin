<template>
    <div>
        <Modal
                v-model="showModal"
                title="工艺翻改"
                :mask-closable="false"
                @on-visible-change="modificationModalStateChangeEvent"
                width="800"
        >
            <modal-content-loading
                :spinShow="spinShow"
            ></modal-content-loading>
            <Form :label-width="90" :show-message="false" ref="formValidate" :model="formValidate" :rules="ruleValidate">
                <Row>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="产品名称:">
                            <div class="exhibitionInputBackground" style="text-overflow: ellipsis;white-space: nowrap;">{{formValidate.productName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="产品编号:">
                            <div class="exhibitionInputBackground" style="text-overflow: ellipsis;white-space: nowrap;">{{formValidate.productCode}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="排产机台数量:">
                            <div class="exhibitionInputBackground">{{formValidate.machineNumber}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem class="margin-bottom-0" label="机台明细:">
                            <Poptip class="exhibitionInputBackground" trigger="hover" placement="bottom-start">
                                <div class="text-box-ellipsis">
                                    <span v-for="(item, index) in formValidate.machineCodeList" :key="index">{{`${item},`}}</span>
                                </div>
                                <div slot="content" class="tooltip-text-color">
                                    <p v-for="(item, index) in formValidate.machineCodeList" :key="index">{{item}}</p>
                                </div>
                            </Poptip>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="设备机型:">
                            <div class="exhibitionInputBackground">{{formValidate.machineModelName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="标准克重:">
                            <div class="exhibitionInputBackground">{{formValidate.gramWeight}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="标准米长:">
                            <div class="exhibitionInputBackground">{{formValidate.meters}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="台时单产:">
                            <div class="exhibitionInputBackground">{{formValidate.hourYield}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="公定回潮率%:">
                            <div class="exhibitionInputBackground">{{formValidate.moistureRegain}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="运转效率%:">
                            <div class="exhibitionInputBackground">{{formValidate.efficiencyPercent}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="管圈类型:">
                            <Select clearable label-in-value v-model="formValidate.tubeTypeId" placeholder="请选择管圈类型" @on-change="getTubeTypeEvent">
                                <Option v-for="item in tubeTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="16">
                        <FormItem class="formItemMargin" label="管圈颜色:">
                            <Select
                                    v-model="formValidate.tubeColorIds"
                                    multiple
                                    label-in-value
                                    filterable
                                    remote
                                    @on-change="getTubeColorEvent"
                            >
                                <Option v-for="item in tubeColorList" :value="item.id" :key="item.id">{{ `${item.name}(${item.shortName})` }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <Table :height="400" size="small" border :columns="tableHeader" :data="formValidate.noticeSpecParamList"></Table>
                    </Col>
                </Row>
            </Form>
            <card class="otherFontStyle margin-top-10" :dis-hover="true" v-show="formValidate.modificationName">
                <Row type="flex" justify="center">
                    <Col class="otherMessageBarNameWidth">
                        <p>
                            <span>翻改人:</span>
                            <span>{{formValidate.modificationName}}</span>
                        </p>
                    </Col>
                    <Col class="otherMessageBarTimeWidth">
                        <p>
                            <span>时间:</span>
                            <span>{{formValidate.modificationTime}}</span>
                        </p>
                    </Col>
                </Row>
            </card>
            <div slot="footer">
                <modal-footer
                        :buttonLoading="modificationModalBtnLoading"
                        @saveModalConfirmEvent="modificationModalConfirmEvent"
                        @saveModalCancelEvent="modificationModalCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalFooter from '../../components/modal-footer';
    import { noticeTips } from '../../../libs/common';
    import modalContentLoading from '../../components/modal-content-loading';
    export default {
        components: { modalFooter, modalContentLoading },
        props: {
            modificationModalState: {
                type: Boolean
            },
            modificationModalBtnLoading: {
                type: Boolean,
                default: false
            },
            specSheetDetail: {
                type: Object
            },
            spinShow: {
                type: Boolean,
                default: false
            }
        },
        data () {
            const validateTubeType = (rule, value, callback) => { value && value.length !== 0 ? callback() : callback(new Error()); };
            const validateTubeColor = (rule, value, callback) => { value && value.length !== 0 ? callback() : callback(new Error()); };
            return {
                formValidate: {
                    tubeTypeId: '',
                    tubeColorIds: []
                },
                ruleValidate: {
                    tubeTypeId: [ { required: true, validator: validateTubeType, trigger: 'change' } ],
                    tubeColorIds: [ { required: true, validator: validateTubeColor, trigger: 'change' } ]
                },
                tubeTypeList: [],
                tubeColorList: [],
                tableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '工艺项目',
                        key: 'specParamName',
                        align: 'center'
                    },
                    {
                        title: '项目类型',
                        key: 'paramTypeName',
                        align: 'center'
                    },
                    {
                        title: '设计工艺',
                        key: 'val',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '上机工艺',
                        key: 'actualVal',
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.dataType === 1) {
                                return h('div', [
                                    h('InputNumber', {
                                        props: {
                                            value: params.row.actualVal || params.row.actualVal === 0 ? parseFloat(params.row.actualVal) : null,
                                            min: 0
                                        },
                                        style: {
                                            width: '100%'
                                        },
                                        on: {
                                            'on-change': (e) => {
                                                if (e) {
                                                    params.row.actualVal = e;
                                                    this.formValidate.noticeSpecParamList[params.index] = params.row;
                                                };
                                            }
                                        }
                                    })
                                ]);
                            } else {
                                return h('div', [
                                    h('Input', {
                                        props: {
                                            value: params.row.actualVal
                                        },
                                        on: {
                                            'on-change': (e) => {
                                                params.row.actualVal = e.target.value;
                                                this.formValidate.noticeSpecParamList[params.index] = params.row;
                                            }
                                        }
                                    })
                                ]);
                            };
                        }
                    },
                    {
                        title: '数据类型',
                        key: 'dataTypeName'
                    },
                    {
                        title: '是否翻改项目',
                        key: 'isBusi',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.isBusi ? '是' : '否'
                                }
                            });
                        }
                    }
                ],
                showModal: false,
                machineModelList: []
            };
        },
        methods: {
            // 管圈类型的事件
            getTubeTypeEvent (e) {
                if (e) {
                    this.formValidate.tubeTypeName = e.label;
                    this.tubeTypeList.forEach(item => item.id === e.value ? this.formValidate.tubeTypeCode = item.code : false);
                } else {
                    this.formValidate.tubeTypeId = '';
                    this.formValidate.tubeTypeName = '';
                    this.formValidate.tubeTypeCode = '';
                };
                this.changeTubeType();
            },
            changeTubeType () {
                let params = {
                    classId: this.formValidate.tubeTypeId,
                    parentCode: 'tube_color'
                };
                this.$call('dict.list', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.tubeColorList = content.res;
                    }
                });
            },
            // 管圈颜色的事件
            getTubeColorEvent (arr) {
                if (arr && arr.length !== 0) {
                    this.formValidate.tubeColorNames = arr.map(item => item.label.split('(')[0]);
                };
            },
            // 监听modal
            modificationModalStateChangeEvent (e) {
                if (e === false) this.formValidate = {};
                this.$emit('modificationModalStateChangeEvent', e);
            },
            // 确认事件
            modificationModalConfirmEvent () {
                this.$emit('modificationModalConfirmEvent', this.formValidate);
                // this.$refs['formValidate'].validate((valid) => {
                //     if (valid) {
                //         this.$emit('modificationModalConfirmEvent', this.formValidate);
                //     } else {
                //         noticeTips(this, 'unCompleteTips');
                //     };
                // });
            },
            // 取消事件
            modificationModalCancelEvent () {
                this.$emit('modificationModalCancelEvent');
            },
            // 获取管圈类型列表数据
            getTubeTypeListHttp () {
                this.$api.dictionary.listHttp({'parentCode': 'tube_type'}).then(res => {
                    if (res.data.status === 200) {
                        this.tubeTypeList = res.data.res;
                        this.formValidate.tubeColorIds = [];
                        this.tubeColorList = [];
                        this.changeTubeType();
                    };
                });
            }
        },
        created () {
            this.getTubeTypeListHttp();
        },
        watch: {
            modificationModalState (newData, oldData) {
                this.showModal = newData;
            },
            specSheetDetail (newData, oldData) {
                this.formValidate = newData;
                this.changeTubeType();
            }
        }
    };
</script>
<style scoped>
    .text-box-ellipsis{
        width:672px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #ff9900
    }
</style>

