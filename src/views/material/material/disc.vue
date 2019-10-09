<template>
    <div>
        <change-time></change-time>
        <div class="parentFlexBetween">
            <div class="disc-bar" v-for="i of 11">{{ i }}号</div>
        </div>
        <div>
            <h3 style="text-align: center; line-height: 40px;">一号圆盘</h3>
            <Table border :data="discList" :columns="discColumns"></Table>
        </div>
    </div>
</template>

<script>
import changeTime from './../../pack/user-pack/change-time';
export default {
    name: 'disc',
    components: {
        changeTime
    },
    data () {
        return {
            discList: [],
            discColumns: [
                {
                    title: '批号',
                    key: 'createTime',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '物料名称',
                    key: 'createTime',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '已投(Kg)',
                    key: 'createName',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '未投(Kg)',
                    key: 'createName',
                    minWidth: 110,
                    align: 'center'
                }
            ]
        };
    }
};
</script>

<style scoped>
.disc-bar{
    width: 100%;
    height: 50px;
    border:1px solid #999999;
    line-height: 50px;
    font-size: 16px;
    text-align: center;
}
.disc-bar{
    border-left: none;
}
.disc-bar:first-child{
    border-left: 1px solid #999999;
}
</style>