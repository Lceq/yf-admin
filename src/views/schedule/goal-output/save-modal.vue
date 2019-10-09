<template>
    <div>
        <Modal
                v-model="showModal"
                :title="saveModalTitle"
                @on-visible-change="saveModalStateChangeEvent"
                :maskClosable="false"
                width="600"
                :styles="{top: '0px'}"
        >
            <Form :label-width="90" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row type="flex">
                    <Col span="12">
                        <FormItem label="所属车间：" prop="workshopId" class="formItemMargin">
                            <Select label-in-value v-model="formValidate.workshopId" placeholder="请选择所属车间" @on-change="getWorkshopEvent">
                                <Option v-for="item in formValidate.workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="月份：" prop="month" class="formItemMargin">
                            <DatePicker v-model="formValidate.month" type="month" placeholder="请选择日期" @on-change="getDateEvent"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table :height="750" border size="small" :columns="tableHeader" :data="tableData"></Table>
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
                        :buttonLoading="confirmButtonLoading"
                        @saveModalConfirmEvent="saveModalConfirmEvent"
                        @saveModalCancelEvent="saveModalCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { noticeTips, translateState, formatMonth, formatDay, emptyTips } from '../../../libs/common';
    import modalFooter from '../../components/modal-footer';
    import otherMessage from '../../components/otherMessage';
    export default {
        components: { modalFooter, otherMessage },
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
            }
        },
        data () {
            const validateMonth = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateWorkshopId = (rule, value, callback) => value ? callback() : callback(new Error());
            return {
                tableHeader: [
                    {
                        title: '日期',
                        key: 'date',
                        width: 100
                    },
                    {
                        title: '日入库目标产量(kg)',
                        key: 'stock',
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    display: 'flex'
                                }
                            }, [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.stock,
                                        min: 0
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.stock = e;
                                            this.tableData[params.index] = params.row;
                                        }
                                    }
                                }),
                                h('Tooltip', {
                                    props: {
                                        transfer: true,
                                        content: '点击赋值所有'
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'ios-copy',
                                            size: 'small'
                                        },
                                        style: {
                                            height: '32px',
                                            marginLeft: '4px'
                                        },
                                        on: {
                                            'click': () => {
                                                this.tableData.forEach(item => { item.stock = params.row.stock; });
                                                this.tableData[params.index] = params.row;
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    },
                    {
                        title: '日目标折标产量(kg)',
                        key: 'discountStock',
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    display: 'flex'
                                }
                            }, [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.discountStock,
                                        min: 0
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.discountStock = e;
                                            this.tableData[params.index] = params.row;
                                        }
                                    }
                                }),
                                h('Tooltip', {
                                    props: {
                                        transfer: true,
                                        content: '点击赋值所有'
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'ios-copy',
                                            size: 'small'
                                        },
                                        style: {
                                            height: '32px',
                                            marginLeft: '4px'
                                        },
                                        on: {
                                            'click': () => {
                                                this.tableData.forEach(item => { item.discountStock = params.row.discountStock; });
                                                this.tableData[params.index] = params.row;
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    },
                    {
                        title: '日目标细纱产量(kg)',
                        key: 'spunYarn',
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    display: 'flex'
                                }
                            }, [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.spunYarn,
                                        min: 0
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.spunYarn = e;
                                            this.tableData[params.index] = params.row;
                                        }
                                    }
                                }),
                                h('Tooltip', {
                                    props: {
                                        transfer: true,
                                        content: '点击赋值所有'
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'ios-copy',
                                            size: 'small'
                                        },
                                        style: {
                                            height: '32px',
                                            marginLeft: '4px'
                                        },
                                        on: {
                                            'click': () => {
                                                this.tableData.forEach(item => { item.spunYarn = params.row.spunYarn; });
                                                this.tableData[params.index] = params.row;
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                showModal: false,
                formValidate: {
                    month: '',
                    workshopId: null
                },
                ruleValidate: {
                    month: [{ required: true, validator: validateMonth, trigger: 'change' }],
                    workshopId: [{ required: true, validator: validateWorkshopId, trigger: 'change' }]
                },
                confirmButtonLoading: false,
                tableData: []
            };
        },
        methods: {
            getDateEvent (e) {
                if (e) {
                    if (this.formValidate.workshopId && this.formValidate.month) {
                        this.validatorExist(this.formValidate.workshopId, this.formValidate.month);
                    };
                };
            },
            // 验证选择的月份是否已经存在
            validatorExist (workshopId, month) {
                this.$call('output.goal.date.exist', {workshopId: workshopId, month: formatMonth(month)}).then(res => {
                    if (res.data.status === 200) {
                        if (res.data.res) {
                            emptyTips(this, '所选月份已经创建,请选择其他月份!');
                            this.tableData = [];
                        } else {
                            let date = new Date(this.formValidate.month);
                            this.getMonthAllDay(date.getFullYear(), date.getMonth() + 1);
                        };
                    };
                });
            },
            // 获取每月所有的天数及星期
            getMonthAllDay (fullYears, months) {
                let fullYear = fullYears;
                let month = months;
                let lastDayOfMonth = new Date(fullYear, month, 0).getDate();
                let arr = [];
                for (let i = 1; i <= lastDayOfMonth; i++) {
                    arr.push({
                        date: fullYear + '-' + this.filterZero(month) + '-' + this.filterZero(i),
                        stock: 0,
                        discountStock: 0,
                        spunYarn: 0
                    });
                };
                this.tableData = arr;
            },
            // 补零
            filterZero (data) {
                return data < 10 ? '0' + data : data;
            },
            // 获取车间
            getWorkshopEvent (e) {
                if (e) {
                    this.formValidate.workshopId = e.value;
                    this.formValidate.workshopName = e.label;
                    if (this.formValidate.workshopId && this.formValidate.month) {
                        this.validatorExist(this.formValidate.workshopId, this.formValidate.month);
                    };
                } else {
                    this.formValidate.workshopId = null;
                    this.formValidate.workshopName = '';
                };
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
                this.formValidate.month = formatMonth(this.formValidate.month);
                this.tableData.forEach(item => {
                    this.$delete(item, 'id');
                    item.date = formatDay(item.date);
                });
                this.formValidate.outputGoalDateList = this.tableData;
                this.$call('output.goal.date.save', this.formValidate).then(res => {
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
                    this.confirmButtonLoading = false;
                    this.formValidate = {};
                    this.tableData = [];
                    this.$refs['formValidate'].resetFields();
                };
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
                        this.tableData = newVal.outputGoalDateList;
                    };
                },
                deep: true
            }
        }
    };
</script>
