<template>
    <Card>
        <Col>
            <Table border :columns="assemblyColumns" :data="assemblyData"></Table>
        </Col>
        <Modal
                v-model="powerModule"
                :title="assemblyMessage"
                :mask-closable="false"
                @on-ok="confirmModule">
            <div>
                        <Form ref="assemblyFormValidate" :model="assemblyFormValidate" :rules="assemblyRuleValidate" :label-width="80" :show-message="false">
                            <Row>
                                <Col span="20" offset="2">
                                    <FormItem class="formItemMargin" label="模块" prop="module">
                                        <span>模块管理</span>
                                    </FormItem>
                                    <FormItem class="formItemMargin" label="权限名称" prop="name">
                                        <Input v-model="assemblyFormValidate.name" placeholder="..."></Input>
                                    </FormItem>
                                    <FormItem class="formItemMargin" label="权限编号" prop="code">
                                        <Input v-model="assemblyFormValidate.code" placeholder="..."></Input>
                                    </FormItem>
                                    <FormItem class="formItemMargin" label="备注" prop="node">
                                        <Input v-model="assemblyFormValidate.node" placeholder="..."></Input>
                                    </FormItem>
                                    <FormItem class="formItemMargin" label="排序" prop="sort">
                                        <Input style="width: 50px;" v-model="assemblyFormValidate.sort" placeholder="..."></Input>
                                    </FormItem>
                                </Col>
                    </Row>
                </Form>
            </div>
            <div slot="footer" class="modalFooterStyle">
                <span class="editFormErrorStyle">{{ newAddLowerErrorMsg }}</span>
                <div>
                    <Button type="warning" @click="newRemove">删除</Button>
                    <Button type="error" @click="newAddLowerCancel">取消</Button>
                    <Button type="success" :loading="loading" @click="submitAddSubordinate">确认</Button>
                </div>
            </div>
        </Modal>
    </Card>
</template>

<script>
export default {
    data () {
        return {
            assemblyMessage: '',
            loading: false,
            powerModule: false,
            newAddLowerErrorMsg: '',
            assemblyFormValidate: {},
            assemblyRuleValidate: {
                name: [
                    { required: true }
                ],
                code: [
                    { required: true }
                ]
            },
            assemblyColumns: [
                {
                    title: '模块名称',
                    width: 250,
                    key: 'name',
                    render: (h, params) => {
                        const _this = this;
                        return h('div', [
                            h('Div', {
                            }, [
                                h('Span', {
                                    style: {
                                    }
                                }, _this.assemblyData[0].name),
                                h('A', {
                                    props: {
                                        value: '123',
                                        Html: '456'
                                    },
                                    style: {
                                        fontSize: '12px;'
                                    },
                                    on: {
                                        'click': (val) => {
                                            console.log(val);
                                            _this.powerModule = true;
                                        }
                                    }
                                }, '[添加权限]')
                            ])
                        ]);
                    }
                },
                {
                    title: '权限项',
                    key: 'assembly',
                    render: (h, params) => {
                        const _this = this;
                        return h('div', [
                            h('Div', {
                            },
                            _this.assemblyData[0].rightItems.map(item => {
                                return h('Span', [
                                    h('Span', {
                                    }, item.name),
                                    h('A', {
                                        style: {marginRight: '5px'}
                                    }, '(' + item.code + ')')
                                ]);
                            })
                            )
                            //         [
                            //
                            //     h('A', {
                            //         style: {
                            //             fontSize: '12px;',
                            //             marginRight: '5px'
                            //         },
                            //         on: {
                            //             click: (val) => {
                            //                 console.log(val);
                            //                 debugger
                            //             }
                            //         }
                            //     }, '增加(add)')
                            // ])
                        ]);
                    }
                }
            ],
            assemblyData: [
                {
                    name: '模块管理',
                    assembly: '增加(add)',
                    rightItems: [
                        {
                            name: 'guan',
                            code: '123'
                        },
                        {
                            name: 'zhu',
                            code: '456'
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        // 获取模块code的列表
        getModuleCode () {
            // debugger
            const _this = this;
            this.$fetch('right/module/list').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    console.log('获取模块列表');
                    // _this.assemblyData = (content.res || []).map(item => {
                    //     return {
                    //         moduleId: item.moduleId,
                    //         moduleName: item.moduleName,
                    //         moduleCode: item.moduleCode,
                    //         rightItems: item.rightItems
                    //     }
                    // })
                    // debugger
                }
            });
        },
        confirmModule () {
            console.log(2);
        },
        newAddLowerCancel () {
            console.log(2);
            this.powerModule = false;
        },
        newRemove () {
            console.log(2);
            this.powerModule = false;
        },
        submitAddSubordinate () {
            console.log(2);
            this.powerModule = false;
        }
    },
    mounted () {
        this.getModuleCode();
    }
};
</script>

<style scoped>

</style>
