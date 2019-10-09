<template>
    <div style="padding: 30px;" id="view-pack">
<!--        <change-time @getLastNextDay="getLastNextDay"></change-time>-->
        <div class="endFlex margin-bottom-10">
            <div class="user-report-return" @click="returnReport">返回</div>
        </div>
        <Row class="user-feed-title-bar">
<!--            <Col span="6">日期：{{toUserFeedDetailData.date}}</Col>-->
            <Col span="8">人员：{{toUserFeedDetailData.userName}}</Col>
            <Col span="8" class="textCenter">批号：{{toUserFeedDetailData.batchCode}}</Col>
            <Col span="8" class="textRight">物料名称：{{toUserFeedDetailData.productName}}</Col>
        </Row>
        <Table :height="tableHeight" border :data="toUserFeedDetailData.packingAreaList" :columns="tableHeader"></Table>
       <!-- <left-right
                :pageTotal="pageTotal"
                :value="valueNumber"
                @leftRightClick="leftRightClick"
        ></left-right>-->
    </div>
</template>
<script>
    import leftRight from '../../../pack/view-pack/left-right';
    import changeTime from '../../../pack/view-pack/change-time';
    export default {
        name: 'people',
        components: {changeTime, leftRight},
        props: {
            isUserFeedDetail: {
                type: Boolean,
                default: false
            },
            toUserFeedDetailData: {
                type: Object
            }
        },
        data () {
            return {
                valueNumber: 1,
                leftRightShow: true,
                tableHeight: '',
                tableData: [],
                tableHeader: [
                    {
                        title: '时间',
                        key: 'date',
                        minWidth: 110
                    },
                    {
                        title: '圆盘',
                        key: 'packingAreaName',
                        minWidth: 100
                    },
                    {
                        title: '投料重量(kg)',
                        key: 'weightQty',
                        minWidth: 110,
                        align: 'right'
                    }
                ],
                pageIndex: 1,
                pageTotal: 1,
                curTime: ''
            };
        },
        watch: {
            isPeopleShow (newData, oldData) {
                if (newData) {}
            }
        },
        methods: {
            returnReport () {
                this.$emit('on-return');
            },
            leftRightClick (val) {
                this.pageIndex = val;
                this.valueNumber = val;
            },
            getLastNextDay (val) {
                this.valueNumber = 1;
                this.pageIndex = 1;
                this.curTime = val;
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.tableHeight = window.screen.height - 340;
            });
            window.onresize = () => {
                this.tableHeight = window.screen.height - 340;
            };
        }
    };
</script>

<style scoped>
    .user-report-return{
        background-color: #f9f9f9;
        border-radius: 2px;
        padding: 10px 30px;
        font-size: 20px;
        border: 1px solid #515a6e;
    }
    .user-feed-title-bar {
        font-size: 20px;
    }
    .pack-size{
        font-size: 24px;
        margin-bottom: 10px;
    }
    .pack-size span {
        color: crimson;
    }
    .report-bar {
        width: 25%;
        display: inline-block;
    }
    .report-title{
        font-size: 24px;
    }
    .report-text {
        font-size: 16px;
    }
</style>
