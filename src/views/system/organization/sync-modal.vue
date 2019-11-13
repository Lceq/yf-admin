<template>
    <div>
        <yf-Modal
                :modalState="showModal"
                :showConfirmBtn="false"
                :showCancelBtn="false"
                :width="1000"
                title="同步"
                @on-visible-change="onVisibleChangeEvent"
        >
            <div slot="content">
                <modal-content-loading :spinShow="spinShow"></modal-content-loading>
                <Row type="flex" justify="space-between" class="margin-bottom-10">
                    <Col>
                        <Button type="success" @click="onConfirmEvent">确认选择</Button>
                    </Col>
                    <Col>
                        <Input v-model.trim="queryBarDeptName" placeholder="请输入部门名称" class="modal-input-length queryBarMarginRight"></Input>
                        <Button icon="md-search" type="primary" @click="onSearchEvent">搜索</Button>
                    </Col>
                </Row>
                <Table border ref="selection" :columns="tableHeader" :data="tableData" @on-current-change="onSelectEvent" :loading="tableLoading" size="small" :height="650" highlight-row></Table>
                <div class="flex-right margin-top-10">
                    <Page :total="pageTotal" @on-change="onPageIndexEvent" size="small" show-total />
                </div>
            </div>
        </yf-Modal>
    </div>
</template>
<script>
    import { hrDeptListRequest } from '@api/basic/dept';
    import modalContentLoading from '@components/modal-content-loading.vue';
    import { setPage, noticeTips } from '../../../libs/common';
    export default {
        components: { modalContentLoading },
        props: {
            modalState: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                tableLoading: false,
                pageTotal: 0,
                pageIndex: 1,
                pageSize: setPage.pageSize,
                showModal: false,
                tableHeader: [
                    {title: '部门名称', key: 'name', sortable: true},
                    {title: '负责人', key: 'leaderName', sortable: true},
                    {title: '组织属性', key: 'typeId', sortable: true}
                ],
                tableData: [],
                queryBarDeptName: '',
                spinShow: false,
                selectObj: {}
            };
        },
        methods: {
            onConfirmEvent () {
                if (Object.keys(this.selectObj).length !== 0) {
                    this.$emit('on-confirm', this.selectObj);
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            onSearchEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getHrDeptListData();
            },
            onPageIndexEvent (e) {
                this.pageIndex = e;
                this.getHrDeptListData();
            },
            onSelectEvent (e) {
                this.selectObj = e;
            },
            onVisibleChangeEvent (e) {
                this.showModal = e;
                this.$emit('on-visible-change', e);
            },
            getHrDeptListData () {
                this.tableLoading = true;
                hrDeptListRequest({
                    isSync: false,
                    deptName: this.queryBarDeptName,
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize
                }).then(res => {
                    if (res.data.status === 200) {
                        this.tableData = res.data.res;
                        this.spinShow = false;
                        this.pageTotal = res.data.count;
                        this.tableLoading = false;
                    };
                });
            }
        },
        watch: {
            modalState (newVal) {
                this.showModal = newVal;
                if (newVal) {
                    this.spinShow = true;
                    this.getHrDeptListData();
                };
            }
        }
    };
</script>
