<template>
    <div>
        <Modal
                v-model="showModal"
                title="选择产品"
                :mask-closable="false"
                @on-visible-change="selectMaterialModalStateChangeEvent"
                width="1000"
        >
            <modal-content-loading
                :spinShow="spinShow"
            ></modal-content-loading>
            <Row type="flex" justify="space-between">
                <Col>
                    <Button type="success" @click="selectMaterialConfirmEvent">确认选择</Button>
                </Col>
                <Col class="flex-left">
                    <Cascader v-if="showMaterialCategory" change-on-select @on-change="getMaterialCategoryEvent" :data="queryBarMaterialCategoryList" v-model="selectMaterialCategoryValue" class="modal-input-length queryBarMarginRight" placeholder="请选择产品分类"></Cascader>
                    <Input type="text" v-model="queryBarName" class="modal-input-length queryBarMarginRight" :placeholder="`请输入${dynamicName}编号或名称`"/>
                    <Button icon="ios-search" type="primary" @click="selectMaterialModalSearchBtnEvent">搜索</Button>
                </Col>
            </Row>
            <Row class="tableMargin">
                <Col span="24">
                    <Table :loading="selectMaterialTableLoading" highlight-row @on-row-dblclick="doubleClickRowEvent" @on-row-click="clickRowEvent" :height="600" size="small" border :columns="tableHeader" :data="selectMaterielModalTableData"></Table>
                </Col>
            </Row>
            <Row>
                <Col class="pageStyle">
                    <Page show-total :page-size="pageSize" :total="selectMaterialPageTotal" size="small" @on-change="getSelectMaterialModalPageCodeEvent"></Page>
                </Col>
            </Row>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import { clearSpace, setPage } from '../../../libs/common';
    import modalContentLoading from '../../components/modal-content-loading';
    export default {
        components: {
            modalContentLoading
        },
        props: {
            selectProductModalDefaultCategory: {
                type: Array
            },
            spinShow: {
                type: Boolean,
                default: false
            },
            selectMaterialModalState: {
                type: Boolean,
                default: false
            },
            selectMaterielModalTableData: {
                type: Array
            },
            showMaterialCategory: {
                type: Boolean,
                default: true
            },
            selectMaterialPageTotal: {
                type: Number
            },
            selectMaterialTableLoading: {
                type: Boolean,
                default: false
            },
            dynamicName: {
                type: String,
                default: '产品'
            }
        },
        data () {
            return {
                selectMaterialCategoryValue: [],
                pageSize: setPage.pageSize,
                pageCount: null,
                selectRow: null,
                showModal: false,
                queryBarName: '',
                queryBarMaterialCategoryList: [],
                tableHeader: [
                    {
                        title: `${this.dynamicName}类别`,
                        key: 'typeName',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: `${this.dynamicName}编号`,
                        key: 'code',
                        align: 'left'
                    },
                    {
                        title: `${this.dynamicName}名称`,
                        key: 'name',
                        align: 'left',
                        width: 200
                    },
                    {
                        title: '规格型号',
                        key: 'models',
                        align: 'left'
                    },
                    {
                        title: '生产工序',
                        key: 'processName',
                        align: 'center'
                    },
                    {
                        title: '计量单位',
                        key: 'unitName',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.unitName ? `${params.row.unitName}(${params.row.unitCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '图片',
                        key: 'picUrl',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            if (params.row.picUrl !== '') {
                                return h('div', [
                                    h('img', {
                                        style: {
                                            width: '30px',
                                            height: '30px',
                                            marginTop: '4px'
                                        },
                                        domProps: {
                                            src: params.row.picUrl
                                        }
                                    })
                                ]);
                            };
                        }
                    }
                ]
            };
        },
        methods: {
            getSelectMaterialModalPageCodeEvent (e) {
                this.queryBarName = clearSpace(this.queryBarName);
                this.$emit('on-change-page', {pageIndex: e, name: this.queryBarName, categoryIdArr: this.selectMaterialCategoryValue});
            },
            // 搜索按钮的点击事件
            selectMaterialModalSearchBtnEvent () {
                this.queryBarName = clearSpace(this.queryBarName);
                this.$emit('select-material-modal-search-event', {name: this.queryBarName, categoryIdArr: this.selectMaterialCategoryValue});
            },
            // 双击
            doubleClickRowEvent (e) {
                this.selectRow = e;
                this.$emit('confirm-event', this.selectRow);
            },
            // 单击
            clickRowEvent (e) {
                this.selectRow = e;
            },
            // 选择产品分类事件
            getMaterialCategoryEvent (e) {
                this.queryBarName = clearSpace(this.queryBarName);
                this.$emit('select-material-modal-category-event', {name: this.queryBarName, categoryIdArr: e});
            },
            // 确认选择事件
            selectMaterialConfirmEvent () {
                if (this.selectRow !== null) {
                    this.$emit('confirm-event', this.selectRow);
                } else {
                    this.$Message.warning('请选择产品!');
                };
            },
            selectMaterialModalStateChangeEvent (e) {
                if (e === false) {
                    this.queryBarName = '';
                    this.selectMaterialCategoryValue = [];
                    this.selectRow = null;
                };
                this.$emit('on-visible-change', e);
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
                        item.label = item.name;
                        item.value = item.id;
                        (parent.children || (parent.children = [])).push(item);
                    } else {
                        item.title = item.name;
                        item.label = item.name;
                        item.value = item.id;
                        val.push(item);
                    }
                });
                return val;
            },
            getMaterialCategoryHttp () {
                this.$api.category.getProductCategoryList({}).then(res => {
                    let arr = this.toTree(res.data.res);
                    this.queryBarMaterialCategoryList = arr;
                });
            }
        },
        watch: {
            selectMaterialModalState (newData, oldData) {
                this.showModal = newData;
            },
            selectProductModalDefaultCategory: {
                handler (newVal, oldVal) {
                    this.selectMaterialCategoryValue = newVal;
                },
                deep: true
            }
        },
        created () {
            // 获取产品类别的请求
            this.getMaterialCategoryHttp();
        }
    };
</script>
