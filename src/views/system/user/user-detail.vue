<template>
    <div>
        <Row>
            <Col>
                <Modal
                        v-model="showModal"
                        title="员工详情"
                        :width="480"
                        @on-visible-change="detailModalStateChangeEvent"
                >
                    <Form :label-width="100">
                        <FormItem label="集团编号:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.code}}</span>
                        </FormItem>
                        <FormItem label="内部编号:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.internalCode}}</span>
                        </FormItem>
                        <FormItem label="名称:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.name}}</span>
                        </FormItem>
                        <FormItem label="性别:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.gender}}</span>
                        </FormItem>
                        <FormItem label="出生日期:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.birthday}}</span>
                        </FormItem>
                        <FormItem label="身份证:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.idCard}}</span>
                        </FormItem>
                        <FormItem label="工作手机:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.mobile}}</span>
                        </FormItem>
                        <FormItem label="办公电话:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.tel}}</span>
                        </FormItem>
                        <FormItem label="办公邮箱:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.email}}</span>
                        </FormItem>
                        <FormItem label="直接上级:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.leaderName}}</span>
                        </FormItem>
                        <FormItem label="岗位工种:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.postName}}</span>
                        </FormItem>
                        <FormItem label="所属部门:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.deptName}}</span>
                        </FormItem>
                        <FormItem label="工作状态:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.onJob === true ?  '在职' :  '离职'}}</span>
                        </FormItem>
                        <FormItem label="是否操作用户:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.state}}</span>
                        </FormItem>
                        <FormItem label="员工描述:" class="inSerDetailMargin">
                            <span class="inSerDetailSpan">{{detailResponseData.remark}}</span>
                        </FormItem>
                    </Form>
                    <other-message
                            :createName="detailResponseData.createName"
                            :createTime="detailResponseData.createTime"
                            :updateName="detailResponseData.updateName"
                            :updateTime="detailResponseData.updateTime"
                    ></other-message>
                    <div slot="footer">
                        <Button type="error" @click="closeUserDetailModalEvent">关闭</Button>
                    </div>
                </Modal>
            </Col>
        </Row>
    </div>
</template>
<script>
    import otherMessage from '../../components/otherMessage';
    export default {
        components: { otherMessage },
        props: {
            detailResponseData: {
                type: Object
            },
            detailModalState: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                showModal: false
            };
        },
        methods: {
            closeUserDetailModalEvent () {
                this.$emit('closeUserDetailModalEvent');
            },
            detailModalStateChangeEvent (e) {
                this.$emit('detailModalStateChangeEvent', e);
            }
        },
        watch: {
            detailModalState (newData, oldData) {
                this.showModal = newData;
            }
        }
    };
</script>
<style scoped>
    .inSerDetailMargin{
        margin-bottom:0;
        font-weight:700;
    }
    .inSerDetailSpan{
        font-weight: 100;
    }
</style>
