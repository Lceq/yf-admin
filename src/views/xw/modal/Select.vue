<template>
    <div>
        <Table border ref="selection" :data="TableData" :columns="TableColumns"></Table>
        <Button @click="submit">提交</Button>
        <select-product @selectProductVal="selectProduct" :selectProductCode="selectProductCode"></select-product>
        <div>{{ value }}</div>
        <select-machine-quality @selectMachineVal="selectMachine" :selectMachineCode="selectMachineCode"></select-machine-quality>
    </div>
</template>

<script>
import selectProduct from '../../components/xw-select-product/xw-select-product';
import selectMachineQuality from '../../components/xw-select-machine/xw-select-machine-quality';
import {getTime} from "../../../libs/tools";

export default {
    name: 'Select',
    components: {
        selectProduct,
        selectMachineQuality
    },
    data () {
        return {
            selectProductCode: '',
            selectMachineCode: '',
            value: '',
            TableData: [
                {
                    id: 1,
                    name: [
                        {
                            id: 1,
                            name: 'name1'
                        },
                        {
                            id: 2,
                            name: 'name2'
                        }
                    ]
                }
            ],
            TableColumns: [
                {
                    type: 'selection'
                },
                {
                    title: 'Id',
                    key: 'id',
                    render: (h, params) => {
                        return h('Div', [
                            h('Span', {}, params.row.id)
                        ]);
                    }
                },
                {
                    title: '输入框',
                    render: (h, params) => {
                        // const _this = this;
                        return h('Div', [
                            h('Select', {
                                props: {
                                    value: ''
                                },
                                on: {
                                    'on-change': (event) => {
                                    // debugger
                                    // _this.TableData.name[params.index].id = event;
                                    // params.row.name = event.target.value;
                                    // debugger
                                    // this.TableData[params.index] = params.row;
                                    // debugger
                                    // console.log(params.row);
                                    // console.log(event.target);
                                    // params.row.name =
                                    }
                                }
                            }, [
                                params.row.name.map(item => {
                                    return h('Option', {
                                        props: {
                                            value: item.id
                                        }
                                    }, item.name);
                                })
                            ])
                        ]);
                    }
                }
            ]
        };
    },
    methods: {
        selectProduct (val) {
            this.value = val;
            // console.log(val)
        },
        selectMachine (val) {
            this.value = val;
            // console.log(val)
        },
        submit () {
            // console.log(this.TableData);
        }
    },
    mounted () {
        // console.log(getTime(0))
        //上周的开始时间
        console.log(getTime(7));
        // 上周的结束时间
        console.log(getTime(1));
        // 本周的开始时间
        console.log(getTime(0));
        // 本周的结束时间
        console.log(getTime(-6));
        this.selectProductCode = 'B00064 (wkx_2)';
    }
};
</script>

<style scoped>

</style>
