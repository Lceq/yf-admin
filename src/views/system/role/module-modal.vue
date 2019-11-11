<template>
    <div>
        <Modal
                v-model="showModal"
                title="模块"
                @on-visible-change="onVisibleChange"
        >
            <modal-content-loading :spinShow="spinShow"></modal-content-loading>
            <div style="height: 700px;overflow-y: auto">
                <Tree :data="treeData" @on-check-change="getCheckEvent" show-checkbox multiple></Tree>
            </div>
            <div slot="footer">
                <modal-footer
                        @saveModalConfirmEvent="saveModalConfirmEvent"
                        @saveModalCancelEvent="saveModalCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalFooter from '../../components/modal-footer';
    import modalContentLoading from '../../components/modal-content-loading';
    import { noticeTips } from '../../../libs/common';
    export default {
        name: 'module-modal',
        components: { modalFooter, modalContentLoading },
        props: {
            modalState: {
                type: Boolean,
                default: false
            },
            roleId: {
                type: [String, Number]
            }
        },
        data () {
            return {
                roleList: [],
                allModuleList: [],
                spinShow: false,
                showModal: false,
                treeData: [],
                checkArr: []
            };
        },
        methods: {
            getCheckEvent (e) {
                this.checkArr = e;
            },
            saveRequest () {
                this.$call('role.module.save', this.checkArr.map(item => item.id)).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'saveTips');
                    };
                });
            },
            saveModalConfirmEvent () {
                this.showModal = false;
            },
            saveModalCancelEvent () {
                this.showModal = false;
            },
            onVisibleChange (e) {
                this.$emit('on-visible-change', e);
            },
            getModuleAndRoleData (id) {
                this.spinShow = true;
                this.$call('module.list').then((res) => {
                    if (res.data.status === 200) {
                        this.allModuleList = res.data.res.map(item => {
                            item.title = item.name;
                            return item;
                        });
                    };
                }).then(() => {
                    this.$call('role.module.list', {
                        roleId: id
                    }).then((res) => {
                        this.roleList = res.data.res;
                        this.allModuleList.forEach(moduleItem => {
                            this.roleList.forEach(roleItem => {
                                if (moduleItem.id === roleItem) {
                                    this.$set(moduleItem, 'checked', true);
                                };
                            });
                        });
                        let rootNode = this.allModuleList.find(item => item.parentId === 0);
                        this.treeData = this.toTreeData(rootNode);
                        this.spinShow = false;
                    });
                });
            },
            toTreeData (treeNode) {
                treeNode.children = [];
                this.allModuleList.forEach(item => {
                    if (item.parentId === treeNode.id) {
                        if (!item.checked) { // 只要有一个子级没有勾选，那父级就不能勾选checked
                            treeNode.checked = false;
                        };
                        treeNode.children.push(item);
                        this.toTreeData(item);
                    };
                });
                return [treeNode];
            }
        },
        watch: {
            modalState (newVal) {
                this.showModal = newVal;
            },
            roleId (newVal) {
                if (newVal) {
                    this.getModuleAndRoleData(newVal);
                };
            }
        }
    };
</script>
