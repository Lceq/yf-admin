<template>
    <div>
        <modal
            :isShow="discFloralShow"
            :title="discFloralTitle"
            :width="1110"
            :isSubmit="isWatch"
            @cancel="discFloralCancel"
            @submit="discFloralSubmit">
            <div slot="content">
                <div>
                    <Form :label-width="90" ref="blendValidate" :model="blendValidate" :rules="blendValidateRules" :show-message="false">
                        <Row>
                            <Col span="6">
                                <FormItem label="配棉版本号：" class="" prop="versionNumber">
                                    <p class="modal-readonly">{{ blendValidate.versionNumber }}</p>
                                </FormItem>
                            </Col>
                            <Col span="10">
                                <FormItem label="清花机台：" class="" prop="curMachineId">
                                    <Select v-model="blendValidate.curMachineId" multiple placeholder="请选择清花机台...">
                                        <Option v-for="item in machineList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div>
                    <div class="outerBlend blend">
                        <span>外圈排包</span>
                        <Table size="small" border :data="outerBlendList" :columns="outerBlendColumns"></Table>
                    </div>
                    <div class="innerBlend blend">
                        <span>内圈排包</span>
                        <Table size="small" border :data="innerBlendList" :columns="innerBlendColumns"></Table>
                    </div>
                    <div class="chart-blend">
                        <div slot="content" style="position: relative; " class="textCenter">
                            <series-sh :roundelSeriesMath="roundelSeriesMath" :seriesList="seriesListOutSet" style=" position: absolute; left:0; top:0;"></series-sh>
                            <series-sh :roundelSeriesMath="roundelSeriesMath" :seriesList="seriesListInner"></series-sh>
                        </div>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import modal from '../../public/modal';
import seriesSh from './series-sh.vue';
import xwValidate from '@/libs/xwValidate';
export default {
    name: 'disc-floral',
    props: {
        isWatch: {
            type: Boolean
        },
        show: {
            type: String
        },
        blendArchivesId: {
            type: Number
        }
    },
    components: {
        modal,
        seriesSh
    },
    data () {
        return {
            discFloralShow: false,
            discFloralTitle: '机台排包',
            blendValidate: {
                versionNumber: '',
                curMachineId: []
            },
            blendValidateRules: {
                curMachineId: [
                    {required: true, validator: xwValidate.selectedMultiple, trigger: 'change'}
                ]
            },
            curMachineId: [],
            machineList: [],
            outerBlendList: [],
            cottonBlendingMaterialList: [],
            packColor: '#F2622D',
            seamColor: '#EFC51B',
            fffColor: '#fff',
            outerBlendColumns: [
                {
                    title: '编号',
                    key: 'index',
                    align: 'center',
                    width: 40,
                    render: (h, params) => {
                        return h('span', {}, params.index + 1);
                    }
                },
                {
                    title: '包',
                    key: 'pack',
                    align: 'center',
                    render: (h, params) => {
                        return h('Select', {
                            style: {textAlign: 'left'},
                            props: {
                                transfer: true,
                                clearable: true,
                                size: 'small',
                                placeholder: '请选择配棉原料',
                                value: params.row.pack
                            },
                            on: {
                                'on-change': (data) => {
                                    if (data) this.seriesListOutSet.colorList[2 * (params.index) + 1] = this.packColor;
                                    else this.seriesListOutSet.colorList[2 * (params.index) + 1] = this.fffColor;
                                    this.outerBlendList[params.index].pack = data;
                                    this.roundelSeriesMath = Math.random();
                                }
                            }
                        }, [
                            this.cottonBlendingMaterialList.map(item => {
                                return h('Option', {
                                    props: {value: item.productId, key: item.productId}
                                }, item.productName);
                            })
                        ]);
                    }
                },
                {
                    title: '缝',
                    align: 'center',
                    key: 'seam',
                    render: (h, params) => {
                        return h('Select', {
                            style: {textAlign: 'left'},
                            props: {
                                transfer: true,
                                clearable: true,
                                size: 'small',
                                placeholder: '请选择配棉原料',
                                value: params.row.seam
                            },
                            on: {
                                'on-change': (data) => {
                                    if (data) this.seriesListOutSet.colorList[2 * (params.index)] = this.seamColor;
                                    else this.seriesListOutSet.colorList[2 * (params.index)] = this.fffColor;
                                    this.outerBlendList[params.index].seam = data;
                                    this.roundelSeriesMath = Math.random();
                                }
                            }
                        }, [
                            this.cottonBlendingMaterialList.map(item => {
                                return h('Option', {
                                    props: {value: item.productId, key: item.productId}
                                }, item.productName);
                            })
                        ]);
                    }
                }
            ],
            innerBlendList: [],
            innerBlendColumns: [
                {
                    title: '编号',
                    key: 'index',
                    align: 'center',
                    width: 40,
                    render: (h, params) => {
                        return h('span', {}, params.index + 1);
                    }
                },
                {
                    title: '包',
                    key: 'pack',
                    align: 'center',
                    render: (h, params) => {
                        return h('Select', {
                            style: {textAlign: 'left'},
                            props: {
                                transfer: true,
                                clearable: true,
                                size: 'small',
                                placeholder: '请选择配棉原料',
                                value: params.row.pack
                            },
                            on: {
                                'on-change': (data) => {
                                    if (data) this.seriesListInner.colorList[2 * (params.index) + 1] = this.packColor;
                                    else this.seriesListInner.colorList[2 * (params.index) + 1] = this.fffColor;
                                    this.innerBlendList[params.index].pack = data;
                                    this.roundelSeriesMath = Math.random();
                                }
                            }
                        }, [
                            this.cottonBlendingMaterialList.map(item => {
                                return h('Option', {
                                    props: {value: item.productId, key: item.productId}
                                }, item.productName);
                            })
                        ]);
                    }
                },
                {
                    title: '缝',
                    align: 'center',
                    key: 'seam',
                    render: (h, params) => {
                        return h('Select', {
                            style: {textAlign: 'left'},
                            props: {
                                transfer: true,
                                clearable: true,
                                size: 'small',
                                placeholder: '请选择配棉原料',
                                value: params.row.seam
                            },
                            on: {
                                'on-change': (data) => {
                                    if (data) this.seriesListInner.colorList[2 * (params.index)] = this.seamColor;
                                    else this.seriesListInner.colorList[2 * (params.index)] = this.fffColor;
                                    this.innerBlendList[params.index].seam = data;
                                    this.roundelSeriesMath = Math.random();
                                }
                            }
                        }, [
                            this.cottonBlendingMaterialList.map(item => {
                                return h('Option', {
                                    props: {value: item.productId, key: item.productId}
                                }, item.productName);
                            })
                        ]);
                    }
                }
            ],
            baseList: {
                pack: null,
                seam: null
            },
            roundelSeriesMath: null,
            seriesListInner: {
                average: 6,
                radius: ['33%', '90%'],
                colorList: [],
                style: 'width: 300px; height: 300px;border-radius: 100px; overflow: hidden; display: inline-block;position: absolute; left:75px; top:75px;'
            },
            seriesListOutSet: {
                average: 14,
                colorList: [],
                radius: ['61%', '95%'],
                style: 'width: 450px; height: 450px;display: inline-block'
            }
        };
    },
    methods: {
        getColorList (val) {
            let data = [];
            for (let i = 1; i <= val; i++) {
                data.push('#fff');
                data.push('#fff');
            }
            return data;
        },
        getDataList (val) {
            const _this = this;
            let data = [];
            _this.dataColorList = [];
            for (let i = 1; i <= val; i++) {
                data.push({
                    id: i,
                    pack: '',
                    seam: ''
                });
            }
            return data;
        },
        discFloralCancel () {
            this.discFloralShow = false;
            this.$emit('submitCancel');
        },
        cottonBlendingMachineList (val) {
            let cottonBlendingMachineList = [];
            val.map(x => {
                let objMachine = this.machineList.find(y => y.id === x);
                let obj = {
                    machineId: objMachine.id,
                    machineCode: objMachine.code,
                    machineName: objMachine.name,
                    innerPacketNumber: 6,
                    outerPacketNumber: 14
                };
                cottonBlendingMachineList.push(obj);
            });
            return cottonBlendingMachineList;
        },
        cottonBlendingPlaceList (val, int) {
            let cottonBlendingPlaceList = [];
            val.map(x => {
                let obj = {
                    serialNumber: x.id,
                    innerOrOuter: int
                }
                if (!x.pack) {
                    obj.mpProductId = '';
                    obj.mpProductCode = '';
                    obj.mpProductName = '';
                } else {
                    obj.mpProductId = x.pack;
                    obj.mpProductCode = this.cottonBlendingMaterialList.find(y => y.productId === x.pack).productCode;
                    obj.mpProductName = this.cottonBlendingMaterialList.find(y => y.productId === x.pack).productName;
                }
                if (!x.seam) {
                    obj.msProductId = '';
                    obj.msProductCode = '';
                    obj.msProductName = '';
                } else {
                    obj.msProductId = x.seam;
                    obj.msProductCode = this.cottonBlendingMaterialList.find(y => y.productId === x.seam).productCode;
                    obj.msProductName = this.cottonBlendingMaterialList.find(y => y.productId === x.seam).productName;
                }
                cottonBlendingPlaceList.push(obj);
            });
            return cottonBlendingPlaceList;
        },
        discFloralSubmit () {
            this.$refs['blendValidate'].validate((valid) => {
                if (valid) {
                    let params = {
                        innerPacketNumber: 6,
                        outerPacketNumber: 14,
                        versionNumber: this.blendValidate.versionNumber,
                        prdCottonBlendingId: this.blendArchivesId,
                        cottonBlendingMachineList: this.cottonBlendingMachineList(this.blendValidate.curMachineId),
                        cottonBlendingPlaceList: this.cottonBlendingPlaceList(this.innerBlendList, 1).concat(this.cottonBlendingPlaceList(this.outerBlendList, 0))
                    };
                    // debugger
                    this.$call('prd.cotton.blending.place.save', params).then(res => {
                        let content = res.data;
                        this.discFloralShow = false;
                        if (content.status === 200) {
                            this.$Message.success('保存成功');
                            this.$emit('submitCancel');
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        getMachineListCotton (val, Array) {
            const _this = this;
            this.$call('machine.list.cotton', {workshopId: val}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.machineList = content.res;
                    if (Array.length) {
                        _this.blendValidate.curMachineId = Array.map(x => x.machineId);
                    } else {
                        _this.blendValidate.curMachineId = [];
                    }
                }
            });
        }
    },
    mounted () {
        // this.innerBlendList = this.getDataList(this.seriesListInner.average);
        // this.outerBlendList = this.getDataList(this.seriesListOutSet.average);
    },
    watch: {
        show (newData, oldData) {
            if (newData) {
                const _this = this;
                this.blendValidate.curMachineId = [];
                this.innerBlendList = this.getDataList(this.seriesListInner.average);
                this.outerBlendList = this.getDataList(this.seriesListOutSet.average);
                this.seriesListInner.colorList = this.getColorList(this.seriesListInner.average);
                this.seriesListOutSet.colorList = this.getColorList(this.seriesListOutSet.average);
                this.discFloralShow = true;
                this.roundelSeriesMath = Math.random();
                this.$call('prd.cotton.blending.place.detail', {id: this.blendArchivesId}).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        // this.versionNumber =
                        _this.blendValidate.versionNumber = content.res.versionNumber;
                        _this.cottonBlendingMaterialList = content.res.cottonBlendingMaterialList;
                        const workshopId = content.res.workshopId;
                        // 存在证明已经排包，不存在证明没有进行排包
                        if (content.res.cottonBlendingMachineList.length) {
                            _this.getMachineListCotton(workshopId, content.res.cottonBlendingMachineList);
                            // _this.curMachineId = content.res.cottonBlendingMachineList.map(x => x.machineId);
                            _this.innerBlendList = _this.innerBlendList.map(item => {
                                if (content.res.cottonBlendingPlaceList.length) {
                                    let obj = content.res.cottonBlendingPlaceList.find(x => x.innerOrOuter === 1 && x.serialNumber === item.id);
                                    if (obj) {
                                        item.pack = obj.mpProductId;
                                        item.seam = obj.msProductId;
                                        if (obj.mpProductId) this.seriesListInner.colorList[2 * (item.id) - 1] = this.packColor;
                                        if (obj.msProductId) this.seriesListInner.colorList[2 * (item.id - 1)] = this.seamColor;
                                    }
                                }
                                return item;
                            });
                            _this.outerBlendList = _this.outerBlendList.map(item => {
                                if (content.res.cottonBlendingPlaceList.length) {
                                    let obj = content.res.cottonBlendingPlaceList.find(x => x.innerOrOuter === 0 && x.serialNumber === item.id);
                                    if (obj) {
                                        item.pack = obj.mpProductId;
                                        item.seam = obj.msProductId;
                                        if (obj.mpProductId) this.seriesListOutSet.colorList[2 * (item.id) - 1] = this.packColor;
                                        if (obj.msProductId) this.seriesListOutSet.colorList[2 * (item.id - 1)] = this.seamColor;
                                    }
                                }
                                return item;
                            });
                        } else {
                            _this.getMachineListCotton(workshopId, []);
                        }
                    }
                    this.roundelSeriesMath = Math.random();
                });
            } else {
                this.discFloralShow = false;
            }
        }
    }
};
</script>

<style scoped>
.formWidth{
    width: 250px;
}
    .blend{
        vertical-align: top;
        width: 316px;
        display: inline-block;
        overflow: inherit;
    }
    .chart-blend{
        vertical-align: top;
        display: inline-block;
    }
</style>
