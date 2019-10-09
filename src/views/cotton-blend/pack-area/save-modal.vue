<template>
    <div>
        <Modal
                v-model="showModal"
                :title="saveModalTitle"
                @on-visible-change="saveModalStateChangeEvent"
                :maskClosable="false"
                width="1000"
        >
            <Form :label-width="90" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row type="flex">
                    <Col span="8">
                        <FormItem label="区域编号：" prop="code" class="formItemMargin">
                            <Input type="text" v-model="formValidate.code" placeholder="请输入区域编号"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="区域名称：" prop="name" class="formItemMargin">
                            <Input type="text" v-model="formValidate.name" placeholder="请输入区域名称"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="所属车间：" prop="workshopId" class="formItemMargin">
                            <Select label-in-value v-model="formValidate.workshopId" placeholder="请选择所属车间" @on-change="getWorkshopEvent">
                                <Option v-for="item in formValidate.workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="清花机台：" prop="machineId" class="formItemMargin">
                            <Select v-model="formValidate.machineId" placeholder="请选择清花机台" @on-change="getMachineEvent">
                                <Option v-for="item in formValidate.machineList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="抓包方式：" prop="typeId" class="formItemMargin">
                            <Select label-in-value v-model="formValidate.typeId" placeholder="请选择抓包方式" @on-change="getTypeEvent">
                                <Option v-for="item in formValidate.typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8" v-if="showOther">
                        <FormItem label="数据状态：" class="formItemMargin">
                            <div class="widthPercentage">{{formValidate.auditStateName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8" v-if="isDiscType">
                        <FormItem v-if="isDiscType" label="内圈包数：" prop="innerPacketNumber" class="formItemMargin">
                            <InputNumber :min="0" :max="6" v-if="isDiscType" v-model="formValidate.innerPacketNumber" class="widthPercentage"/>
                        </FormItem>
                    </Col>
                    <Col span="8" v-if="isDiscType">
                        <FormItem v-if="isDiscType" label="外圈包数：" prop="outerPacketNumber" class="formItemMargin">
                            <InputNumber :min="0" :max="20" v-if="isDiscType" v-model="formValidate.outerPacketNumber" class="widthPercentage"/>
                        </FormItem>
                    </Col>
                    <Col span="8" v-if="isRecType">
                        <FormItem v-if="isRecType" label="行数：" prop="rowNumber" class="formItemMargin">
                            <InputNumber :min="0" :max="30" v-if="isRecType" v-model="formValidate.rowNumber" class="widthPercentage"/>
                        </FormItem>
                    </Col>
                    <Col span="8" v-if="isRecType">
                        <FormItem v-if="isRecType" label="列数：" prop="columnNumber" class="formItemMargin">
                            <InputNumber :min="0" :max="4" v-if="isRecType" v-model="formValidate.columnNumber" class="widthPercentage"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="是否预混：" class="formItemMargin">
                            <Checkbox v-model="formValidate.isPremix" @on-change="getIsPremixEvent">是</Checkbox>
                        </FormItem>
                    </Col>
                </Row>
                <Row v-if="showAddMachine">
                    <Col>
                        <div class="margin-bottom-10">
                            <Button type="success" @click="addMachineEvent">添加梳棉设备</Button>
                        </div>
                        <Table border :columns="tableHeader" :data="formValidate.packingAreaMachineList"></Table>
                    </Col>
                </Row>
                <div v-show="showOther">
                    <other-message
                            :createName="formValidate.createName"
                            :createTime="formValidate.createTime"
                            :updateName="formValidate.updateName"
                            :updateTime="formValidate.updateTime"
                            :auditName="formValidate.auditName"
                            :auditTime="formValidate.auditTime"
                    ></other-message>
                </div>
            </Form>
            <div slot="footer">
                <modal-footer
                        :showPreviewButton="formValidate.typeId?true:false"
                        :buttonLoading="confirmButtonLoading"
                        :isDisableConfirm="isDisableConfirm"
                        @on-preview-event="savePreviewButtonEvent"
                        @saveModalConfirmEvent="saveModalConfirmEvent"
                        @saveModalCancelEvent="saveModalCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
        <preview-modal
                :pieChartData="pieChartData"
                :previewModalState="previewModalState"
                @on-visible-change="previewModalStateChangeEvent"
        ></preview-modal>
        <select-machine-modal
                :selectMachineModalProcessList="selectMachineModalProcessList"
                :existData="formValidate.packingAreaMachineList"
                :workshopId="formValidate.workshopId"
                :selectMachineModalState="selectMachineModalState"
                @on-visible-change="selectMachineModalStateChangeEvent"
                @on-confirm="selectMachineModalConfirmEvent"
        ></select-machine-modal>
    </div>
</template>
<script>
    import { noticeTips, translateState } from '../../../libs/common';
    import modalFooter from '../../components/modal-footer';
    import otherMessage from '../../components/otherMessage';
    import previewModal from './preview-modal';
    import selectMachineModal from './select-machine-modal';
    let _this = this;
    export default {
        components: { modalFooter, otherMessage, previewModal, selectMachineModal },
        props: {
            saveModalData: {
                type: Object
            },
            saveModalState: {
                type: Boolean,
                default: false
            },
            saveModalTitle: {
                type: String
            },
            showOther: {
                type: Boolean,
                default: false
            },
            selectMachineModalProcessList: {
                type: Array
            }
        },
        data () {
            const validateCode = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateName = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateTypeId = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateWorkshopId = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateMachineId = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateRowNumber = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateColumnNumber = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateInnerPacketNumber = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateOuterPacketNumber = (rule, value, callback) => value ? callback() : callback(new Error());
            return {
                showAddMachine: false,
                selectMachineModalState: false,
                tableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        width: 60,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        icon: 'md-remove'

                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            _this.reduceTableButton(params.index);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        minWidth: 100,
                        title: '设备编号',
                        key: 'machineCode'
                    },
                    {
                        minWidth: 100,
                        title: '设备名称',
                        key: 'machineName'
                    }
                ],
                previewModalState: false,
                pieChartData: {},
                isDiscType: false,
                isRecType: false,
                isDisableConfirm: false,
                showModal: false,
                formValidate: {
                    code: '',
                    name: '',
                    typeId: '',
                    workshopId: null,
                    machineId: null,
                    machineList: [],
                    rowNumber: 0,
                    columnNumber: 0,
                    innerPacketNumber: null,
                    outerPacketNumber: null,
                    packingAreaMachineList: [],
                    isPremix: false
                },
                ruleValidate: {
                    code: [{ required: true, validator: validateCode, trigger: 'change' }],
                    name: [{ required: true, validator: validateName, trigger: 'change' }],
                    typeId: [{ required: true, validator: validateTypeId, trigger: 'change' }],
                    workshopId: [{ required: true, validator: validateWorkshopId, trigger: 'change' }],
                    machineId: [{ required: true, validator: validateMachineId, trigger: 'change' }],
                    rowNumber: [{ required: true, validator: validateRowNumber, trigger: 'change' }],
                    columnNumber: [{ required: true, validator: validateColumnNumber, trigger: 'change' }],
                    innerPacketNumber: [{ required: true, validator: validateInnerPacketNumber, trigger: 'change' }],
                    outerPacketNumber: [{ required: true, validator: validateOuterPacketNumber, trigger: 'change' }]
                },
                confirmButtonLoading: false
            };
        },
        methods: {
            // 获取是否预混
            getIsPremixEvent (e) {
                if (e) {
                    this.showAddMachine = false;
                    this.formValidate.packingAreaMachineList = [];
                } else {
                    this.showAddMachine = true;
                };
            },
            selectMachineModalConfirmEvent (e) {
                this.formValidate.packingAreaMachineList = [...this.formValidate.packingAreaMachineList, ...e];
                this.selectMachineModalState = false;
            },
            // 监听选择设备modal
            selectMachineModalStateChangeEvent (e) {
                this.selectMachineModalState = e;
            },
            // 配棉生条表移除事件
            reduceTableButton (index) {
                if (this.formValidate.packingAreaMachineList.length > 1) {
                    this.formValidate.packingAreaMachineList.splice(index, 1);
                };
            },
            // 添加设备
            addMachineEvent () {
                this.selectMachineModalState = true;
            },
            // 监听预览modal状态
            previewModalStateChangeEvent (e) {
                this.previewModalState = e;
            },
            savePreviewButtonEvent () {
                this.pieChartData = JSON.parse(JSON.stringify(this.formValidate));
                this.previewModalState = true;
            },
            // 获取机台
            getMachineEvent (e) {
                if (e) {
                    this.formValidate.machineList.forEach(item => {
                        if (item.id === e) {
                            this.formValidate.machineId = item.id;
                            this.formValidate.machineCode = item.code;
                            this.formValidate.machineName = item.name;
                        };
                    });
                } else {
                    this.formValidate.machineId = null;
                    this.formValidate.machineCode = '';
                    this.formValidate.machineName = '';
                };
            },
            // 获取车间
            getWorkshopEvent (e) {
                if (e) {
                    this.getMachineListRequest(e.value);
                    this.formValidate.workshopId = e.value;
                    this.formValidate.workshopName = e.label;
                } else {
                    this.formValidate.workshopId = null;
                    this.formValidate.workshopName = '';
                };
            },
            getMachineListRequest (workshopId) {
                this.$call('machine.list.cotton', {workshopId: workshopId, typeId: 26}).then(res => {
                    if (res.data.status === 200) {
                        this.formValidate.machineList = res.data.res;
                    };
                });
            },
            // 抓包方式
            getTypeEvent (e) {
                if (e) {
                    this.formValidate.innerPacketNumber = 0;
                    this.formValidate.outerPacketNumber = 0;
                    this.formValidate.rowNumber = 0;
                    this.formValidate.columnNumber = 0;
                    this.formValidate.typeId = e.value;
                    this.formValidate.typeName = e.label;
                    if (e.label.indexOf('圆盘式') !== -1) {
                        this.isDiscType = true;
                        this.isRecType = false;
                    } else {
                        this.isDiscType = false;
                        this.isRecType = true;
                    }
                } else {
                    this.formValidate.typeId = null;
                    this.formValidate.typeName = '';
                }
            },
            // 确认事件
            saveModalConfirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.confirmButtonLoading = true;
                        this.saveRequest();
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            // 保存的请求
            saveRequest () {
                this.formValidate.packingAreaMachineList.map(item => { this.$delete(item, 'id'); });
                this.$call('packing.area.save', this.formValidate).then(res => {
                    if (res.data.status === 200) {
                        this.$emit('on-confirm');
                        noticeTips(this, 'saveTips');
                    } else {
                        this.confirmButtonLoading = false;
                    };
                });
            },
            saveModalCancelEvent () {
                this.$emit('on-cancel');
                this.$refs['formValidate'].resetFields();
            },
            saveModalStateChangeEvent (e) {
                this.$emit('on-visible-change', e);
                if (e === false) {
                    this.isDiscType = false;
                    this.isRecType = false;
                    this.confirmButtonLoading = false;
                    this.formValidate = {};
                }
            }
        },
        watch: {
            saveModalState (newVal, oldVal) {
                this.showModal = newVal;
            },
            saveModalData: {
                handler (newVal, oldVal) {
                    if (Object.keys(newVal).length !== 0) {
                        this.formValidate = newVal;
                        this.formValidate.auditStateName = translateState(newVal.auditState);
                        if (this.formValidate.auditState) {
                            this.formValidate.auditState === 1 ? this.isDisableConfirm = false : this.isDisableConfirm = true;
                        } else {
                            this.isDisableConfirm = false;
                        };
                        if (this.formValidate.isPremix) {
                            this.showAddMachine = false;
                        } else {
                            this.showAddMachine = true;
                        };
                        if (newVal.typeName) {
                            if (newVal.typeName.indexOf('圆盘式') !== -1) {
                                this.isDiscType = true;
                                this.isRecType = false;
                            } else {
                                this.isDiscType = false;
                                this.isRecType = true;
                            }
                        };
                    }
                },
                deep: true
            }
        },
        created () {
            _this = this;
        }
    };
</script>
