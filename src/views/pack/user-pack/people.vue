<template>
    <div>
        <change-time @getLastNextDay="getLastNextDay"></change-time>
        <p class="pack-size">总包数：<span>{{ totalQty }}</span></p>
        <Table :height="tableHeight" border :data="peopleList" :columns="peopleColumns"></Table>
        <left-right
            :pageTotal="pageTotal"
            :value="valueNumber"
            @leftRightClick="leftRightClick"
        ></left-right>
    </div>
</template>

<script>
import changeTime from './change-time';
import leftRight from './left-right';
import {curDate} from '../../../libs/tools';
import {breakUpList} from "../../../libs/tools";

export default {
    name: 'people',
    components: {
        changeTime,
        leftRight
    },
    props: {
        isPeopleShow: {
            type: Boolean,
            default: false
        },
        loginMes: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            valueNumber: 1,
            leftRightShow: true,
            tableHeight: '',
            peopleList: [
                {
                    belongDate: '2019-6-21',
                    groupName: '后纺甲班',
                    userName: '张三',
                    productCode: 'T/R 65？35 40S',
                    completeQty: '20111',
                    unCompleteQty: '201121'
                }
            ],
            peopleColumns: [
                {
                    title: '报工日期',
                    key: 'date',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '班组',
                    key: 'groupName',
                    minWidth: 100,
                    align: 'center'
                },
                {
                    title: '人员',
                    key: 'reporterName',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '产品',
                    key: 'productName',
                    minWidth: 100,
                    align: 'center'
                },
                {
                    title: '包装数量(Kg)',
                    key: 'reportQty',
                    minWidth: 100,
                    align: 'center'
                },
                {
                    title: '包数',
                    key: 'packNumber',
                    minWidth: 90,
                    align: 'center'
                }
            ],
            pageIndex: 1,
            pageTotal: 1,
            curTime: '',
            totalQty: 0,
            peopleListTotal: []
        };
    },
    watch: {
        isPeopleShow (newData, oldData) {
            if (newData) {
                this.curTime = curDate();
                this.getUserList();
            }
        }
    },
    methods: {
        leftRightClick (val) {
            this.pageIndex = val;
            this.valueNumber = val;
            this.peopleList = this.peopleListTotal[val - 1];
            // this.getUserList();
        },
        getLastNextDay (val) {
            // this.leftRightShow = false;
            this.valueNumber = 1;
            this.pageIndex = 1;
            this.curTime = val;
            this.getUserList();
        },
        getUserList () {
            let params = {
                groupId: this.loginMes[0].groupId,
                date: this.curTime
                // pageIndex: this.pageIndex,
                // pageSize: 8
            };
            this.$call('pack.report.user.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.pageTotal = Math.ceil(content.res.length / 8);
                    // debugger
                    this.peopleListTotal = breakUpList(content.res, 8);
                    this.peopleList = this.peopleListTotal[0];
                    this.totalQty = 0;
                    content.res.map(x => {
                        this.totalQty += Number(x.packNumber);
                    });
                }
            });
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableHeight = window.screen.height - 292;
        });
        window.onresize = () => {
            this.tableHeight = window.screen.height - 292;
        };
    }
};
</script>

<style scoped>
.pack-size{
    font-size: 20px;
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