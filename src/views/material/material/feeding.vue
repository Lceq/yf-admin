<template>
    <div>
        <div class="endFlex marginBottom">
            <div class="user-report-return" style="margin-right: 5px;" @click="returnReport">提交</div>
            <div class="user-report-return" @click="returnReport">返回</div>
        </div>
        <div>
            <H3 class="marginBottom" style="text-align: center">投料人：张三</H3>
        </div>
        <Table border :data="feedingList" :columns="feedingColumns"></Table>
    </div>
</template>
<script>
export default {
    name: 'feeding',
    data () {
        return {
            feedingList: [
                {
                    productName: '粘胶R'
                },
                {
                    productName: '粘胶R'
                },
                {
                    productName: '回花'
                }
            ],
            feedingColumns: [
                {
                    title: '批号',
                    key: 'batchCode',
                    minWidth: 100,
                    align: 'left',
                    render: (h, params) => {
                        if (params.index === this.feedingList.length - 1) {
                            return h('Input', {}, '1231412');
                        } else {
                            return h('span', {}, params.row.batchCode);
                        }
                    }
                },
                {
                    title: '物料',
                    key: 'productName',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '已投料',
                    key: 'createName',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '占比',
                    key: 'createTime',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '平均包重',
                    key: 'createTime',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '包数',
                    key: 'createName',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '重量',
                    key: 'qty',
                    minWidth: 100,
                    align: 'left',
                    render: (h, params) => {
                        return h('Input', {}, params.row.qty);
                    }
                }
            ]
        };
    },
    methods: {
        returnReport () {
            this.$emit('returnFeeding');
        }
    }
};
</script>

<style scoped>

</style>