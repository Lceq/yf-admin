<template>
    <div>
        <div class="endFlex marginBottom">
            <div class="user-report-return" @click="returnReport">返回</div>
        </div>
        <div class="parentFlexBetween marginBottom user-detail">
            <p>日期：2019-06-24</p>
            <p>人员：张峰</p>
            <p>批号：zk20002</p>
            <p>物料名称：天化</p>
        </div>
        <Table border :data="userDetailList" :columns="userDetailColumns"></Table>
    </div>
</template>

<script>
    export default {
        name: 'user-detail',
        data () {
            return {
                userDetailList: [],
                userDetailColumns: [
                    {
                        title: '时间',
                        key: 'createTime',
                        minWidth: 100,
                        align: 'left'
                    },
                    {
                        title: '圆盘',
                        key: 'createTime',
                        minWidth: 100,
                        align: 'left'
                    },
                    {
                        title: '投料重量(Kg)',
                        key: 'createName',
                        minWidth: 110,
                        align: 'center'
                    }
                ]
            };
        },
        methods: {
            returnReport () {
                this.$emit('returnUser');
            }
        }
    }
</script>

<style scoped>
.user-detail{
    font-size: 14px;
}
</style>