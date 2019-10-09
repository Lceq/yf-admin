<template>
    <div>
        <div class="pack-area-box">
            <div class="pack-area-item" v-for="(item, index) of discList">
                <div>
                    <p>{{item.packingAreaCode}}</p>
                    <p>{{item.packingAreaName}}</p>
                    <Select v-model="item.id" :disabled="item.openingState===1" class="pack-area-item-sub" placeholder="请选择批号" @on-change="getSelectBatchCodeEvent($event,index)">
                        <Option v-for="(item, index) in item.applicationAreaList" :value="item.id" :key="index">{{ item.batchCode }}</Option>
                    </Select>
                    <p>{{item.openingState? '已开台':'未开台'}}</p>
                    <Button :disabled="item.id&&item.openingState!==1?false:true" @click="getPackAreaItem(item.id)" class="margin-top-10">投料</Button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {curDate, breakUpList} from '../../../../libs/tools';
import leftRight from '../../../pack/view-pack/left-right';
export default {
    name: 'report',
    components: {leftRight},
    props: {
        isPackAreaShow: {
            type: Boolean
        }
    },
    data () {
        return {
            show: false,
            pageTotal: 1,
            discList: [],
            loginMes: []
        };
    },
    methods: {
        getSelectBatchCodeEvent (e, index) {
            this.discList[index].id = e;
        },
        leftRightClick (val) {
            this.pageIndex = val;
            this.getPackAreaList();
        },
        // 投料事件
        getPackAreaItem (id) {
            this.$emit('on-feed-material', id);
        },
        getPackAreaList () {
            const _this = this;
            this.$call('user.get.post').then(resItem => {
                if (resItem.data.status === 200) {
                    this.loginMes = resItem.data.res;
                    let params = {
                        workshopId: this.loginMes[0].workshopId,
                        groupId: this.loginMes[0].groupId,
                        date: this.loginMes[0].date,
                        pageIndex: this.pageIndex,
                        pageSize: 16
                    };
                    this.$call('packing.area.feedList', params).then(res => {
                        let content = res.data;
                        if (content.status === 200) {
                            _this.pageTotal = Math.ceil(content.count / 16);
                            res.data.res.forEach(item => item.id = null);
                            _this.discList = res.data.res;
                        }
                    });
                }
            });
        }
    },
    mounted () {
        this.getPackAreaList();
    },
    watch: {
        isPackAreaShow (newData, oldData) {
            if (newData) {
                this.getPackAreaList();
            }
        }
    }
};
</script>

<style scoped lang="less">
    .pack-area-box {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 20px;
        .pack-area-item{
            width: 250px;
            height: 250px;
            font-size: 18px;
            background-color: #f9f9f9;
            border: 1px solid #515a6e;
            border-radius: 100%;
            margin-bottom: 20px;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            .pack-area-item-sub {
                width: 200px;
            }
        }
    }
    .report-title{
        color: #2d8cf0;
        font-size: 30px;
    }
    .report-text {
        font-size: 18px;
        line-height: 30px;
    }
    .report-text-red{
        color: red;
    }
</style>
