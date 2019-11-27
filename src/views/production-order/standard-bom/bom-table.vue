<template>
    <div>
        <div>
            <Table size="small" border :columns="tableHeader" :data="tableData"></Table>
        </div>
        <Row type="flex" justify="end" class="total-num-big-box">
            合计：
            <div class="total-num-box total-MixtureRatio-width">
                <div>{{ totalMixtureRatioNum }}%</div>
            </div>
            <div class="total-num-box total-MixtureRatio-width">
                <!--<div>{{ totalMattritionRateNum }}%</div>-->
            </div>
            <div class="total-num-box total-num-box-width">
                <div>{{ totalPutinQty }}</div>
            </div>
        </Row>
    </div>
</template>
<script>
    import { accMul, addNum, accDivision, accSub } from '../../../libs/common';
    export default {
        props: {
            tabsItem: {
                type: Object
            },
            tableData: {
                type: Array
            },
            dataIndex: {
                type: Number
            },
            productionQty: {
                type: Number
            }
        },
        data () {
            return {
                totalPutinQty: 0,
                totalMixtureRatioNum: 0,
                totalMattritionRateNum: 0,
                tableRemoteLoading: false,
                tableHeader: [
                    {title: '序号', type: 'index', width: 60, align: 'center'},
                    {
                        title: '操作',
                        key: 'operation',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        icon: 'md-add'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.addTableButtonEvent(params.index);
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        icon: 'md-remove'

                                    },
                                    style: {},
                                    on: {
                                        click: () => {
                                            this.reduceTableButtonEvent(params.index);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '投入物料',
                        key: 'mproductCode',
                        minWidth: 200,
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    display: 'flex',
                                    paddingTop: '2px'
                                }
                            }, [
                                h('Select', {
                                    props: {
                                        value: params.row.mproductCode,
                                        icon: 'ios-search',
                                        filterable: true,
                                        transfer: true,
                                        clearable: true,
                                        placeholder: '请输入物料编号或名称'
                                    },
                                    on: {
                                        'on-clear': () => {
                                            params.row.mproductId = '';
                                            params.row.mproductCode = '';
                                            params.row.mproductName = '';
                                            params.row.mproductModels = '';
                                            params.row.munitId = '';
                                            params.row.munitCode = '';
                                            params.row.munitName = '';
                                            params.row.mbatchCode = '';
                                            params.row.mbatchCodeList = [];
                                            this.tableData[params.index] = params.row;
                                        },
                                        'on-change': (e) => {
                                            if (e) {
                                                params.row.mproductCode = e;
                                                params.row.mbatchCode = '';
                                                params.row.mbatchCodeList = [];
                                                this.$call('product.batch.list', { productNameCode: e, auditState: 3 }).then(res => {
                                                    if (res.data.status === 200) {
                                                        params.row.batchList = res.data.res;
                                                        params.row.remoteProductList.forEach((item) => {
                                                            if (item.code === e) {
                                                                params.row.mproductId = item.id;
                                                                params.row.mproductCode = item.code;
                                                                params.row.mproductName = item.name;
                                                                params.row.mproductModels = item.models;
                                                                params.row.munitId = item.unitId;
                                                                params.row.munitCode = item.unitCode;
                                                                params.row.munitName = item.unitName;
                                                            };
                                                        });
                                                        this.tableData[params.index] = params.row;
                                                        this.$emit('getSelectProductEvent', {
                                                            dataIndex: this.dataIndex,
                                                            rowIndex: params.index,
                                                            row: this.tableData[params.index]
                                                        });
                                                    };
                                                });
                                            }
                                        }
                                    }
                                }, params.row.remoteProductList.map((item) => {
                                    return h('Option', {
                                        props: {
                                            value: item.code,
                                            label: item.label
                                        }
                                    });
                                })),
                                h('Button', {
                                    props: {
                                        icon: 'ios-search',
                                        size: 'small'
                                    },
                                    style: {
                                        marginLeft: '-2px',
                                        zIndex: '99'
                                    },
                                    on: {
                                        'click': () => {
                                            this.$emit('remoteSelectPrdIconSearchBtnEvent', {
                                                dataIndex: this.dataIndex,
                                                rowIndex: params.index
                                            });
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {title: '规格', key: 'mproductModels', align: 'center', minWidth: 100},
                    {
                        title: '计量单位',
                        key: 'munitCode',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.munitCode ? `${params.row.munitName}(${params.row.munitCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '占比%',
                        key: 'mmixtureRatio',
                        fixed: 'right',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.mmixtureRatio,
                                        min: 0,
                                        max: 100
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            if (e === 0 || e) {
                                                if (params.row.mattritionRate === 0 || params.row.mattritionRate) {
                                                    let putinQtyNum = accMul(this.productionQty, e);
                                                    if (params.row.mattritionRate === 100) {
                                                        params.row.mputinQty = 0;
                                                    } else {
                                                        params.row.mputinQty = parseInt(accDivision(putinQtyNum, accSub(100, params.row.mattritionRate)));
                                                    };
                                                };
                                                this.mMixtureRatioChangeEvent(e, params.index);
                                                params.row.mmixtureRatio = e;
                                                this.tableData[params.index] = params.row;
                                                this.calculationTotalPutinQty();
                                            };
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '损耗率%',
                        key: 'mattritionRate',
                        fixed: 'right',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.mattritionRate,
                                        min: 0,
                                        max: 100
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            if (e === 0 || e) {
                                                if (params.row.mmixtureRatio === 0 || params.row.mmixtureRatio) {
                                                    let putinQtyNum = accMul(this.productionQty, params.row.mmixtureRatio);
                                                    if (e === 100) {
                                                        params.row.mputinQty = 0;
                                                    } else {
                                                        params.row.mputinQty = parseInt(accDivision(putinQtyNum, accSub(100, e)));
                                                    };
                                                };
                                                this.mAttritionRateChangeEvent(e, params.index);
                                                params.row.mattritionRate = e;
                                                this.tableData[params.index] = params.row;
                                                this.calculationTotalPutinQty();
                                            };
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '投料数量',
                        key: 'mputinQty',
                        align: 'center',
                        fixed: 'right',
                        width: 160,
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.mputinQty,
                                        min: 0,
                                        precision: 0
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            if (e === 0 || e) {
                                                this.mPutinQtyChangeEvent(e, params.index);
                                                params.row.mputinQty = e;
                                                this.tableData[params.index] = params.row;
                                                this.calculationTotalPutinQty();
                                            };
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ]
            };
        },
        methods: {
            // 合计
            calculationTotalPutinQty () {
                let totalNum = 0;
                let totalMixtureRatio = 0;
                let totalMattritionRate = 0;
                this.tableData.forEach((item) => {
                    if (item.mputinQty) {
                        totalNum = addNum(item.mputinQty, totalNum);
                    };
                    if (item.mmixtureRatio) {
                        totalMixtureRatio = addNum(item.mmixtureRatio, totalMixtureRatio);
                    };
                    if (item.mattritionRate) {
                        totalMattritionRate = addNum(item.mattritionRate, totalMattritionRate);
                    };
                });
                this.totalPutinQty = totalNum;
                this.totalMixtureRatioNum = totalMixtureRatio;
                this.totalMattritionRateNum = totalMattritionRate;
            },
            mBatchCodeChangeEvent (e, rowIndex) {
                this.$emit('mBatchCodeChangeEvent', {
                    dataIndex: this.dataIndex,
                    rowIndex: rowIndex,
                    materialData: this.tableData
                });
            },
            mMixtureRatioChangeEvent (e, rowIndex) {
                this.$emit('mMixtureRatioChangeEvent', {
                    dataIndex: this.dataIndex,
                    rowIndex: rowIndex,
                    materialData: this.tableData
                });
            },
            mAttritionRateChangeEvent (e, rowIndex) {
                this.$emit('mAttritionRateChangeEvent', {
                    dataIndex: this.dataIndex,
                    rowIndex: rowIndex,
                    materialData: this.tableData
                });
            },
            mPutinQtyChangeEvent (e, rowIndex) {
                this.$emit('mPutinQtyChangeEvent', {
                    dataIndex: this.dataIndex,
                    rowIndex: rowIndex,
                    materialData: this.tableData
                });
            },
            addTableButtonEvent (index) {
                this.$emit('addTableButtonEvent', {
                    index: index,
                    dataIndex: this.dataIndex
                });
            },
            reduceTableButtonEvent (index) {
                this.$emit('reduceTableButtonEvent', {
                    index: index,
                    dataIndex: this.dataIndex
                });
                this.calculationTotalPutinQty();
            }
        },
        created () {
            this.calculationTotalPutinQty();
        }
    };
</script>
<style scoped>
    .total-MixtureRatio-width{
        width: 100px;
        border-right: none;
    }
</style>
