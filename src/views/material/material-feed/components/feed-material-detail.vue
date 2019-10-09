<template>
    <div id="view-pack" class="user-report" style="padding: 30px;">
        <div class="endFlex margin-bottom-10">
            <div class="user-report-return" style="margin-right: 20px;" @click="submitReport">提交</div>
            <div class="user-report-return" @click="returnReport">返回</div>
        </div>
        <Row type="flex" justify="space-between" align="middle" class="feed-material-title margin-bottom-10">
            <Col>投料人：{{userName}}</Col>
            <Col class="flex-between-center">
                <span>辅助投料人：</span>
                <Select clearable v-model="feedMaterialDetail.auxiliaryFeedingId" @on-change="getSelectUserEvent" filterable placeholder="请选择辅助投料人" style="width:200px">
                    <Option v-for="item in userList" :value="item.id" :key="item.id">{{ `${item.name}(${item.code})` }}</Option>
                </Select>
            </Col>
        </Row>
        <Table  v-if="tableContentShow" :height="tableHeight" border :data="feedMaterialDetail.detailList" :columns="tableHeader" :loading="tableLoading"></Table>
        <fixed-number
            :fixedNumber="fixedNumber"
            :isShowNumber="isShowNumber"
            @submitNumber="submitNumber"
            @cancelNumber="cancelNumber"
        ></fixed-number>
    </div>
</template>
<script>
    import {noticeTips, emptyTips} from '../../../../libs/common';
    import fixedNumber from './fixed-number';
    import xwTableContent from '../../../components/xw-table/xw-table-content';
    import {curDate, breakUpList} from '../../../../libs/tools';
    import Cookies from 'js-cookie';
    import Icon from '../../../xw/modal/icon';
    export default {
        components: {Icon, fixedNumber, xwTableContent},
        props: {
            isUserReport: {
                type: Boolean,
                default: false
            },
            curOrderId: [Number, String],
            isUserActiveShow: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                userList: [],
                loginMes: [],
                tableLoading: false,
                feedMaterialDetail: {
                    auxiliaryFeedingId: null,
                    auxiliaryFeedingName: ''
                },
                userName: '',
                fixedNumber: 0,
                leftRightShow: true,
                valueNumber: 1,
                tableContentShow: true,
                tableHeight: null,
                isShowNumber: false,
                changeTableState: false,
                userReportValidate: {},
                userReportRules: {},
                userReportList: {
                    orderPackingEntity: {
                        bagMouthName: '',
                        paperTubeName: '',
                        waistRopeName: '',
                        packetQty: '',
                        packingBag: '',
                        packetWeightMin: '',
                        packetWeightMax: ''
                    },
                    packReportDetailList: []
                },
                tableHeader: [
                    {
                        title: '批号',
                        key: 'batchCode',
                        minWidth: 90,
                        align: 'center'
                    },
                    {
                        title: '物料',
                        key: 'productName',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '已投料',
                        key: 'feedingQty',
                        minWidth: 90,
                        align: 'center'
                    },
                    {
                        title: '占比',
                        key: 'mixtureRatio',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '平均包重',
                        key: 'packetWeight',
                        minWidth: 110,
                        align: 'center'
                    },
                    {
                        title: '包数',
                        key: 'applyPacketQty',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '领出量',
                        key: 'leadOutQty',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '剩余量',
                        key: 'surplusQty',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '重量',
                        key: 'applyWeightQty',
                        minWidth: 90,
                        align: 'center',
                        render: (h, params) => {
                            const _this = this;
                            return h('div', {
                                style: {
                                    width: '100%',
                                    textAlign: 'left',
                                    border: '1px solid #dcdee2',
                                    padding: '5px 5px',
                                    height: '42px',
                                    borderRadius: '5px'
                                },
                                on: {
                                    'click': () => {
                                        _this.fixedNumber = params.row.applyWeightQty;
                                        setTimeout(() => {
                                            _this.isShowNumber = true;
                                        }, 0);
                                        _this.dataIndex = params.index;
                                        _this.dataName = 'number';
                                    }
                                }
                            }, params.row.applyWeightQty);
                        }
                    }
                ],
                dataIndex: 0,
                dataName: '',
                realList: []
            };
        },
        methods: {
            getSelectUserEvent (e) {
                if (e) {
                    this.userList.forEach(item => {
                        if (e === item.id) {
                            this.feedMaterialDetail.auxiliaryFeedingName = item.name;
                        };
                    })
                } else {
                    this.feedMaterialDetail.auxiliaryFeedingId = null;
                    this.feedMaterialDetail.auxiliaryFeedingName = '';
                };
            },
            submitNumber (val) {
                this.isShowNumber = false;
                this.feedMaterialDetail.detailList[this.dataIndex].applyWeightQty = val;
                this.tableContentShow = false;
                setTimeout(() => {
                    this.tableContentShow = true;
                }, 0);
            },
            focusSubmit (key, index) {
                this.isShowNumber = true;
                this.dataIndex = index - 1;
                this.dataName = key;
            },
            getMachineFeedMaterial () {
                this.tableLoading = true;
                return this.$call('user.get.post').then(resItem => {
                    if (resItem.data.status === 200) {
                        this.loginMes = resItem.data.res;
                        return this.$call('prd.material.application.area.detail', {id: this.curOrderId}).then(res => {
                            let content = res.data;
                            if (content.status === 200) {
                                this.feedMaterialDetail = res.data.res;
                                this.tableLoading = false;
                            }
                        });
                    }
                });
            },
            submitReport () {
                this.$set(this.feedMaterialDetail, 'id');
                this.feedMaterialDetail.date = this.loginMes[0].date;
                this.feedMaterialDetail.workshopId = this.loginMes[0].workshopId;
                this.feedMaterialDetail.workshopName = this.loginMes[0].workshopName;
                this.feedMaterialDetail.groupId = this.loginMes[0].groupId;
                this.feedMaterialDetail.groupName = this.loginMes[0].groupName;
                this.feedMaterialDetail.detailList.forEach(item => { this.$set(item, 'id'); });
                this.$call('prd.material.feeding.save', this.feedMaterialDetail).then(res => {
                    if (res.data.status === 200) {
                        this.$emit('returnReport', '1');
                    };
                });
            },
            cancelNumber () {
                this.isShowNumber = false;
            },
            returnReport () {
                this.$emit('returnReport', '0');
            },
            // 获取辅助投料工列表数据
            getUserListRequest () {
                return this.$call('user.list', {
                    isFeeding: true,
                    auditState: 3,
                    onJob: true,
                    deptId: this.loginMes[0].workshopId,
                    isSupplement: false
                }).then(res => {
                    if (res.data.status === 200) {
                        this.userList = res.data.res;
                    };
                });
            },
            async getDependentDataRequest () {
                await this.getMachineFeedMaterial();
                await this.getUserListRequest();
            }
        },
        mounted () {
            this.userName = Cookies.get('user');
            this.$nextTick(() => {
                this.tableHeight = window.screen.height - 490;
            });
            window.onresize = () => {
                this.tableHeight = window.screen.height - 490;
            };
        },
        watch: {
            isUserReport (newData, oldData) {
                if (newData) {
                    this.getDependentDataRequest();
                } else {
                    this.feedMaterialDetail.detailList = [];
                }
            }
        }
    };
</script>
<style scoped>
    .feed-material-title {
        font-size: 24px;
        font-weight: bold;
    }
    .user-report-return{
        background-color: #f9f9f9;
        border-radius: 2px;
        padding: 10px 30px;
        font-size: 20px;
        border: 1px solid #515a6e;
    }
</style>
