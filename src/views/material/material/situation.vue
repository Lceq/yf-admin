<template>
    <div>
<!--        <H3>圆盘原料投入情况</H3>-->
        <change-time></change-time>
        <Table border :height="450" :data="situationList" :columns="situationColumns"></Table>
    </div>
</template>

<script>
import changeTime from './../../pack/user-pack/change-time';
export default {
    name: 'situation',
    components: {
        changeTime
    },
    data () {
        return {
            situationList: [
                {}
            ],
            situationColumns: [
                {
                    title: '物料',
                    key: 'createTime',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '批号',
                    key: 'createTime',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '领出量',
                    key: 'createName',
                    minWidth: 90,
                    align: 'right'
                },
                {
                    title: '已投量',
                    key: 'createTime',
                    minWidth: 90,
                    align: 'right'
                },
                {
                    title: '剩余量',
                    key: 'createTime',
                    minWidth: 100,
                    align: 'right'
                },
                {
                    title: '1号',
                    key: 'createTime',
                    minWidth: 50,
                    align: 'right'
                },
                {
                    title: '2号',
                    key: 'createName',
                    minWidth: 50,
                    align: 'right'
                },
                {
                    title: '3号',
                    key: 'createTime',
                    minWidth: 50,
                    align: 'right'
                },
                {
                    title: '4号',
                    key: 'createTime',
                    minWidth: 50,
                    align: 'right'
                },
                {
                    title: '5号',
                    key: 'createTime',
                    minWidth: 50,
                    align: 'right'
                },
                {
                    title: '6号',
                    key: 'createName',
                    minWidth: 50,
                    align: 'right'
                },
                {
                    title: '7号',
                    key: 'createTime',
                    minWidth: 50,
                    align: 'right'
                },
                {
                    title: '8号',
                    key: 'createTime',
                    minWidth: 50,
                    align: 'right'
                },
                {
                    title: '9号',
                    key: 'createTime',
                    minWidth: 50,
                    align: 'right'
                },
                {
                    title: '10号',
                    key: 'createName',
                    minWidth: 50,
                    align: 'right'
                },
                {
                    title: '11号',
                    key: 'createTime',
                    minWidth: 50,
                    align: 'right'
                }
            ]
        };
    }
};
</script>

<style scoped>

</style>