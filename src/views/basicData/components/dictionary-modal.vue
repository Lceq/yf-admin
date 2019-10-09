<template>
    <div>
        <Modal
                v-model="showModal"
                :title="saveModalTitle"
                :mask-closable="false"
                @on-visible-change="modalStateChange"
        >
            <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row>
                    <Col span="22">
                        <FormItem label="编码：" prop="addDirCodeIpt" class="formItemMargin">
                            <Input type="text" v-model="formValidate.addDirCodeIpt" placeholder="请输入编码"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="22">
                        <FormItem label="名称：" prop="addDirNameIpt" class="formItemMargin">
                            <Input type="text" v-model="formValidate.addDirNameIpt" placeholder="请输入名称"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row v-if="tubeTypeList.length">
                    <Col span="22">
                        <FormItem label="简称：" prop="shortName" class="formItemMargin">
                            <Input type="text" v-model="formValidate.shortName" placeholder="请输入简称"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row v-if="tubeTypeList.length">
                    <Col span="22">
                        <FormItem label="管圈类型：" prop="classId" class="formItemMargin">
                            <Select v-model="formValidate.classId" @on-change="getTubeColorEvent">
                                <Option v-for="(item, index) in classTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row v-if="showTubeColor">
                    <Col span="22">
                        <FormItem label="颜色：" class="formItemMargin">
                            <ColorPicker v-model="formValidate.colorValue" />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="22">
                        <FormItem label="排序：" class="formItemMargin">
                            <InputNumber v-model="newAddSortData" :editable="true" :max="100" :min="1" ></InputNumber>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="22">
                        <FormItem label="备注：" class="formItemMargin">
                            <Input v-model="addRemarks" type="textarea" placeholder="请输入"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer" class="flex-right">
                <modal-footer
                        :is-disable-confirm="isDisableConfirm"
                        :buttonLoading="buttonLoading"
                        @saveModalConfirmEvent="confirmEvent"
                        @saveModalCancelEvent="cancelEvent"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalFooter from '../../components/modal-footer';
    import xwValidate from '../../../libs/xwValidate';
    export default {
        components: { modalFooter },
        props: {
            isDisableConfirm: {
                type: Boolean,
                default: false
            },
            saveData: {
                type: Object
            },
            tubeTypeList: {
                type: Array,
                default: []
            },
            classId: {
                type: Number
            },
            shortName: {
                type: String
            },
            modalState: {
                type: Boolean,
                default: false
            },
            saveModalTitle: {
                type: String
            },
            buttonLoading: {
                type: Boolean,
                default: false
            },
            addDirCodeIpt: {
                type: String
            },
            addDirNameIpt: {
                type: String
            },
            sortData: {
                type: Number,
                default: 1
            },
            remarks: {
                type: String
            },
            showOther: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                showTubeColor: false,
                formValidate: {
                    addDirCodeIpt: '',
                    addDirNameIpt: '',
                    shortName: '',
                    classId: null,
                    colorValue: '',
                    className: ''
                },
                ruleValidate: {
                    addDirCodeIpt: [{required: true, validator: xwValidate.code, trigger: 'change'}],
                    addDirNameIpt: [{required: true, validator: xwValidate.input, trigger: 'blur'}],
                    shortName: [{required: true, validator: xwValidate.shortName, trigger: 'blur'}],
                    classId: [{required: true, validator: xwValidate.input, trigger: 'change'}]
                },
                newAddSortData: 1,
                classTypeList: [],
                addRemarks: '',
                showModal: false
            };
        },
        methods: {
            getTubeColorEvent (e) {
                if (e) {
                    this.classTypeList.forEach(item => {
                        if (item.id === e) { this.formValidate.className = item.name; };
                    });
                    if (this.formValidate.className.indexOf('纸管') !== -1) {
                        this.showTubeColor = true;
                    } else {
                        this.showTubeColor = false;
                        this.formValidate.colorValue = '';
                    };
                };
            },
            cancelEvent () {
                this.$refs['formValidate'].resetFields();
                this.$emit('on-cancel');
            },
            confirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        let editCollection = {
                            addDirCodeIpt: this.formValidate.addDirCodeIpt,
                            addDirNameIpt: this.formValidate.addDirNameIpt,
                            sortData: this.newAddSortData,
                            classId: this.formValidate.classId,
                            shortName: this.formValidate.shortName,
                            remarks: this.addRemarks,
                            colorValue: this.formValidate.colorValue
                        };
                        this.$emit('on-confirm', editCollection);
                    } else {
                        xwValidate.message();
                    };
                });
            },
            modalStateChange (e) {
                if (e === false) {
                    this.showTubeColor = false;
                    this.formValidate.colorValue = '';
                    this.$refs['formValidate'].resetFields();
                    this.addRemarks = '';
                    this.newAddSortData = 1;
                    this.formValidate.className = '';
                };
                this.$emit('on-visible-change', e);
            }
        },
        watch: {
            saveData: {
                handler (newVal, oldVal) {
                    if (Object.keys(newVal).length !== 0) {
                        !newVal.colorValue ? newVal.colorValue = '' : false;
                        this.formValidate = newVal;
                        if (this.formValidate.className) {
                            if (this.formValidate.className.indexOf('纸管') !== -1) {
                                this.showTubeColor = true;
                            } else {
                                this.showTubeColor = false;
                            };
                        } else {
                            this.showTubeColor = false;
                        };
                    };
                },
                deep: true
            },
            tubeTypeList (newData, oldData) {
                this.classTypeList = newData;
            },
            modalState (newData, oldData) {
                this.showModal = newData;
            },
            addDirCodeIpt (newData, oldData) {
                this.formValidate.addDirCodeIpt = newData;
            },
            classId (newData, oldData) {
                this.formValidate.classId = newData;
            },
            shortName (newData, oldData) {
                this.formValidate.shortName = newData;
            },
            addDirNameIpt (newData, oldData) {
                this.formValidate.addDirNameIpt = newData;
            },
            sortData (newData, oldData) {
                this.newAddSortData = newData;
            },
            remarks (newData, oldData) {
                this.addRemarks = newData;
            }
        }
    };
</script>
