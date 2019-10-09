<template>
    <div>
        <div>
            <change-time></change-time>
        </div>
        <Table border :height="450" :data="userMaterialList" :columns="userMaterialColumns"></Table>
    </div>
</template>

<script>
import changeTime from './../../pack/user-pack/change-time';
export default {
    name: 'user',
    data () {
        return {
            userMaterialList: [{}],
            userMaterialColumns: [
                {
                    title: '人员编号',
                    key: 'createTime',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '姓名',
                    key: 'createTime',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '批号',
                    key: 'createName',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '物料名称',
                    key: 'createTime',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '已投',
                    key: 'createName',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '操作',
                    key: 'createTime',
                    minWidth: 100,
                    align: 'center',
                    render: (h, params) => {
                        return h('Button', {
                            props: {
                                size: 'small'
                            },
                            style: {
                            },
                            on: {
                                'click': () => {
                                    this.$emit('returnUserDetail');
                                }
                            }
                        }, '详情');
                    }
                }
            ]
        };
    },
    components: {
        changeTime
    },
};
</script>

<style scoped>
    .user-report-return{
        background-color: #f9f9f9;
        border-radius: 2px;
        padding: 5px 20px;
        font-size: 14px;
        border: 1px solid #515a6e;
    }
</style>