<template>
    <div>
        <Modal
                v-model="showModal"
                title="创建快捷入口"
                @on-visible-change="addShortCutModalStateChange"
                width="800"
                :mask-closable="false"
        >
            <modal-content-loading :spinShow="addShortCutModalContentLoading"></modal-content-loading>
            <Row style="display: flex">
                <Col span="6" style="height:600px;overflow-y: auto;margin-right: 10px;">
                    <Tree :data="allModuleList" show-checkbox @on-check-change="getSelectTreeEvent"></Tree>
                </Col>
                <Col span="18">
                    <Table size="small" border ref="selection" :columns="columns" :data="tableData" :height="600"></Table>
                </Col>
            </Row>
            <div slot="footer">
                <modal-footer
                        :buttonLoading="addShortCutModalConfirmLoading"
                        @saveModalConfirmEvent="saveModalConfirmEvent"
                        @saveModalCancelEvent="saveModalCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
        <select-icon-modal
                :selectIconModalState="selectIconModalState"
                @visible-change="selectIconModalStateChangeEvent"
                @cancel-event="selectIconModalStateCancelEvent"
                @confirm-event="selectIconModalStateConfirmEvent"
        ></select-icon-modal>
    </div>
</template>
<script>
    import modalFooter from '../../components/modal-footer';
    import modalContentLoading from '../../components/modal-content-loading';
    import selectIconModal from './select-icon-modal';
    import { noticeTips, emptyTips } from '../../../libs/common';
    export default {
        components: { modalFooter, modalContentLoading, selectIconModal },
        data () {
            return {
                addIconIndex: null,
                selectIconModalState: false,
                showModal: false,
                tableData: [],
                columns: [
                    {
                        title: '序号',
                        align: 'center',
                        width: 90,
                        type: 'index'
                    },
                    {
                        title: '名称',
                        align: 'center',
                        key: 'moduleName'
                    },
                    {
                        title: '路由',
                        align: 'center',
                        key: 'moduleNavUrl'
                    },
                    {
                        title: '排序',
                        align: 'center',
                        key: 'sortNum',
                        render: (h, params) => {
                            return h('InputNumber', {
                                props: {
                                    value: params.row.sortNum,
                                    min: 1
                                },
                                on: {
                                    'on-change': (e) => {
                                        params.row.sortNum = e;
                                        this.tableData[params.index] = params.row;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '图标',
                        align: 'center',
                        width: 140,
                        key: 'moduleIconUrl',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        custom: params.row.moduleIconUrl,
                                        type: params.row.moduleIconUrl,
                                        size: 24
                                    },
                                    style: {
                                        width: '26px',
                                        height: '26px',
                                        marginRight: '10px'
                                    }
                                }),
                                h('Tooltip', {
                                    props: {
                                        content: '点击选择图标',
                                        transfer: true
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            size: 'small',
                                            icon: 'md-search'
                                        },
                                        on: {
                                            'click': () => {
                                                this.addIconEvent(params.index);
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    }
                ],
                addShortCutModalConfirmLoading: false
            };
        },
        props: {
            addShortCutModalContentLoading: {
                type: Boolean,
                default: false
            },
            addShortCutModalState: {
                type: Boolean,
                default: false
            },
            allModuleList: {
                type: Array
            },
            selectShortCutList: {
                type: Array
            }
        },
        methods: {
            // 添加图标按钮事件
            addIconEvent (index) {
                this.selectIconModalState = true;
                this.addIconIndex = index;
            },
            // 监听选择图标modal事件
            selectIconModalStateChangeEvent (e) {
                this.selectIconModalState = e;
            },
            // 选择图标modal取消事件
            selectIconModalStateCancelEvent () {
                this.selectIconModalState = false;
            },
            selectIconModalStateConfirmEvent (iconName) {
                // 判断昇虹的图标和iview自带图标
                if (iconName.indexOf('sh-icon') !== -1) {
                    this.tableData[this.addIconIndex].moduleIconUrl = `sh-iconfont ${iconName}`;
                } else {
                    this.tableData[this.addIconIndex].moduleIconUrl = iconName;
                };
                this.selectIconModalState = false;
            },
            toTree (data) {
                data.forEach((item) => {
                    delete item.children;
                });
                var map = {};
                data.forEach((item) => {
                    map[item.id] = item;
                });
                var val = [];
                data.forEach((item) => {
                    var parent = map[item.parentId];
                    if (parent) {
                        item.title = item.name;
                        item.value = item.id;
                        (parent.children || (parent.children = [])).push(item);
                    } else {
                        item.title = item.name;
                        item.value = item.id;
                        val.push(item);
                    }
                });
                return val;
            },
            // tree勾选事件
            getSelectTreeEvent (data) {
                this.tableData = data.filter(item => {
                    if (!item.children) {
                        item.moduleId = item.id;
                        item.moduleName = item.name;
                        item.moduleNavUrl = item.navUrl;
                        item.moduleIconUrl = item.iconUrl;
                        return item;
                    };
                });
            },
            // 保存快捷列表
            saveModalConfirmEvent () {
                if (this.tableData.length <= 8) {
                    this.tableData.forEach((item) => delete item.id);
                    this.addShortCutModalConfirmLoading = true;
                    this.$call('shortcut.entry.save', this.tableData).then(res => {
                        if (res.data.status === 200) {
                            noticeTips(this, 'saveTips');
                            this.$emit('confirm-event');
                            this.addShortCutModalConfirmLoading = false;
                        };
                    });
                } else {
                    emptyTips(this, '最多只能设置8个快捷入口!');
                };
            },
            // 取消事件
            saveModalCancelEvent () {
                this.$emit('cancel-event');
            },
            // 确认事件
            addShortCutModalStateChange (e) {
                this.$emit('visible-change', e);
            }
        },
        watch: {
            addShortCutModalState (newVal, oldVal) {
                this.showModal = newVal;
            },
            selectShortCutList: {
                handler (newVal, oldVal) {
                    this.tableData = newVal;
                },
                deep: true
            }
        }
    };
</script>
