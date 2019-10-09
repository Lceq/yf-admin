<template>
    <div>
        124123
<!--        <Table border ref="selection" :data="TableData" :columns="TableColumns"></Table>-->
<!--        <Input type="number" style="width: 300px" />-->
<!--        <Input type="number"></Input>-->
<!--        <input type="number">-->
<!--        <Button @click="submit">提交</Button>-->
        <Table border :data="list" :columns="columns"></Table>
    </div>
</template>

<script>
    import excel from '../../../libs/excel.js';
    // import Vue from 'vue';
    export default {
        name: 'Select',
        data () {
            return {
                list: [],
                columns: [
                    {
                        title: '物料编码',
                        key: 'code',
                        sortable: true,
                        fixed: 'left',
                        minWidth: 110
                    },
                    {
                        title: '物料名称',
                        key: 'name',
                        sortable: true,
                        align: 'left',
                        fixed: 'left',
                        minWidth: 150
                    },
                    {
                        title: '生产工序',
                        key: 'processName',
                        sortable: true,
                        align: 'center',
                        fixed: 'left',
                        minWidth: 130
                    },
                    {
                        title: '规格型号',
                        align: 'left',
                        key: 'models',
                        sortable: true,
                        minWidth: 150
                    },
                    {
                        title: '计量单位',
                        align: 'left',
                        key: 'unitName',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '物料分类',
                        align: 'left',
                        key: 'categoryName',
                        sortable: true,
                        minWidth: 110
                    }
                ]
            };
        },
        methods: {
            // getList () {
            //     debugger
            //     this.$call('product/list').then(res => {
            //         let content = res.data;
            //         this.list = content.res;
            //         const params = {
            //             title: this.columns.map(x => x.title),
            //             key: this.columns.map(x => x.key),
            //             data: this.list,
            //             autoWidth: true,
            //             filename: '产品'
            //         };
            //         excel.export_array_to_excel(params);
            //     });
            // }
        },
        mounted () {
            // this.getList();
        }
    };
</script>

<style scoped>

</style>
