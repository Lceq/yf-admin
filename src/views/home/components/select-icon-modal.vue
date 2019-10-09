<template>
    <div>
        <Modal
                v-model="showModal"
                title="选择图标"
                @on-visible-change="selectIconModalStateChange"
                width="800"
                :mask-closable="false"
        >
            <modal-content-loading :spinShow="selectIconModalContentLoading"></modal-content-loading>
            <Tabs v-model="activeTabPane" :animated="false">
                <TabPane :label="iconData.label" :name="index+''" :key="index" v-for="(iconData, index) of iconAllData">
                    <div class="iconHeight">
                        <div class="iconOutStyle">
                            <div :class="selectIcon === icon && parseInt(activeTabPane) === index ? 'activeIconStyle iconStyleClass' : 'iconStyleClass'" v-for="(icon, iconindex) of iconData.icons" :key="iconindex" @click="selectIconEvent(icon,index, iconindex)">
                                <Icon v-if="iconData.name === 'shIcon'" :custom="'sh-iconfont' + ' ' + icon" size="28"></Icon>
                                <Icon v-if="iconData.name === 'iviewIcon'" :type="icon" size="28"></Icon>
                            </div>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
            <div slot="footer">
                <modal-footer
                        :buttonLoading="selectIconModalConfirmLoading"
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
    import { noticeTips, iconList, emptyTips } from '../../../libs/common';
    export default {
        components: { modalFooter, modalContentLoading },
        data () {
            return {
                activeTabPane: '0',
                showModal: false,
                selectIconModalConfirmLoading: false,
                iconAllData: iconList,
                selectIcon: ''
            };
        },
        props: {
            selectIconModalContentLoading: {
                type: Boolean,
                default: false
            },
            selectIconModalState: {
                type: Boolean,
                default: false
            },
            selectShortCutList: {
                type: Array
            }
        },
        methods: {
            selectIconEvent (e, tabIndex, index) {
                this.activeTabPane = tabIndex + '';
                this.selectIcon = e;
            },
            // 确认事件
            saveModalConfirmEvent () {
                if (this.selectIcon) {
                    this.$emit('confirm-event', this.selectIcon);
                } else {
                    emptyTips(this, '请选择图标!');
                };
            },
            // 取消事件
            saveModalCancelEvent () {
                this.$emit('cancel-event');
            },
            // 监听modal
            selectIconModalStateChange (e) {
                if (!e) {
                    this.activeTabPane = '0';
                    this.selectIcon = '';
                }
                this.$emit('visible-change', e);
            }
        },
        watch: {
            selectIconModalState (newVal, oldVal) {
                this.showModal = newVal;
            }
        }
    };
</script>
<style scoped>
    .activeIconStyle{
        box-shadow: 0 0 10px 2px gray;
        border-radius: 4px;
    }
    .iconHeight{
        height: 380px;
        overflow: auto;
    }
    .iconOutStyle{
        width: 100%;
        font-size: 0;
        line-height: 0;
        border-top:1px solid #dddee1;
        border-left:1px solid #dddee1;
    }
    .iconStyleClass{
        width: 12.5%;
        font-size: 20px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        display: inline-block;
        border-right:1px solid #dddee1;
        border-bottom:1px solid #dddee1;
    }
    .iconStyleClass:hover{
        background-color: #00c261;
        color: #fff;
    }
</style>
