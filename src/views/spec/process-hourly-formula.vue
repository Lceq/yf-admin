<template>
    <div>
        <Card>
            <Row>
                <Col id="selectedHeight" class="marginBottom">
                    <!--<Button icon="md-add" type="success" @click="addClickEvent">新增</Button>-->
                </Col>
                <Col>
                    <Table border :columns="hourlyFormulaColumns" :data="hourlyFormulaData" :height="tableHeight" size="small"></Table>
                </Col>
            </Row>
            <modal
                    :isShow="hourlyFormulaShow"
                    :title="hourlyFormulaTitle"
                    @submit="hourlyFormulaSubmit"
                    @cancel="hourlyFormulaCancel"
            >
                <div slot="content">
                    <Input v-model="productionFormula" :rows="4" type="textarea" placeholder="设置台时产公式" />
                </div>
            </modal>
        </Card>
    </div>
</template>

<script>
import modal from '../public/modal';
export default {
    name: 'process-hourly-formula',
    components: {
        modal
    },
    data () {
        return {
            hourlyFormulaColumns: [
                {
                    title: '操作',
                    key: 'enableState',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                        const _this = this;
                        return h('Button', {
                            props: {
                                size: 'small'
                            },
                            style: {
                            },
                            on: {
                                'click': () => {
                                    this.$api.process.getProcessDetail({id: params.row.id}).then(res => {
                                        let content = res.data;
                                        if (content.status === 200) {
                                            _this.curProcessId = params.row.id;
                                            _this.productionFormula = content.res.productionFormula;
                                            _this.hourlyFormulaShow = true;
                                        }
                                    });
                                }
                            }
                        }, '设置台时产公式');
                    }
                },
                {
                    title: '工序编码',
                    key: 'code',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('span', {
                        }, params.row.code);
                    }
                },
                {
                    title: '工序名称',
                    key: 'name',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '工序类别',
                    key: 'typeName',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '台时产公式',
                    key: 'productionFormula',
                    align: 'center',
                    minWidth: 200
                }
            ],
            hourlyFormulaData: [],
            tableHeight: '',
            productionFormula: null,
            hourlyFormulaTitle: '设置台时产公式',
            hourlyFormulaShow: false,
            curProcessId: ''
        };
    },
    methods: {
        // addClickEvent () {
        //     // this.productionFormula = '';
        //     this.curProcessId = null;
        //     this.hourlyFormulaShow = true;
        // },
        hourlyFormulaSubmit () {
            let params = {
                id: this.curProcessId,
                productionFormula: this.productionFormula
            };
            this.$api.process.getProcessSave(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getProcessList();
                    this.$Message.success('保存成功');
                }
            });
            this.hourlyFormulaShow = false;
        },
        hourlyFormulaCancel () {
            this.hourlyFormulaShow = false;
        },
        getProcessList () {
            let params = {
                auditState: 3
            };
            this.$api.process.getProcessList(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.hourlyFormulaData = content.res;
                }
            });
        }
    },
    mounted () {
        this.getProcessList();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 180;
        });
        window.onresize = () => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 180;
            }
        };
    }
};
</script>

<style scoped>

</style>
