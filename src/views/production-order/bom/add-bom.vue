<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row type="flex" justify="space-between">
            <Col class="flex-between-center">
                <Button icon="md-add" type="primary" class="margin-bottom-10" @click="newAddClick">新增</Button>
                <Button v-show="formValidate.auditState===2" icon="ios-undo" class="queryBarMarginLeft margin-bottom-10" type="warning" @click="cancelClickEvent">撤销提交</Button>
                <Button v-show="formValidate.auditState===2" icon="md-done-all" class="queryBarMarginLeft margin-bottom-10" type="primary" @click="auditClickEvent">审核</Button>
                <Button v-show="formValidate.auditState===3&&formValidate.isQuote===false" type="warning" icon="md-refresh" class="queryBarMarginLeft margin-bottom-10" @click="unAuditClickEvent">撤销审核</Button>
                <Button v-show="formValidate.auditState===3" icon="md-close" class="queryBarMarginLeft margin-bottom-10" type="error" @click="closeClickEvent">关闭单据</Button>
                <Button v-show="formValidate.auditState===4" icon="md-swap" class="queryBarMarginLeft margin-bottom-10" type="warning" @click="openClickEvent">撤销关闭</Button>
            </Col>
        </Row>
        <Form :label-width="90" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
            <div>
                <Row>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="BOM单号:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.code}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="单据日期:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.date}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="生产单号:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.prdOrderCode}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="生产车间:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.workshopName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="产品:" prop="materielCodeIpt" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.productCode ? `${formValidate.productName}(${formValidate.productCode})` : ''}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="规格:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.productModels}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="纱线用途:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.purposeName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="纱线捻向:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.twistDirectionName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="批号:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.batchCode}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="计量单位:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.unitValue}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="订单数量:" prop="specUserIpt" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.productionQty}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="工艺路线:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.specPathName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="交货开始时间:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.deliveryDateFrom}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="交货结束时间:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.deliveryDateTo}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="日供货量:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.dailySupplyQty}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="单据状态:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.auditStateName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="引用状态:" class="formItemMargin">
                            <div class="read-only-item">{{ formValidate.isQuoteName }}</div>
                        </FormItem>
                    </Col>
                </Row>
            </div>
        </Form>
        <Tabs @on-click="getTabEvent" type="card">
            <TabPane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="index+''" :disabled="item.disabled"></TabPane>
        </Tabs>
        <article style="height: 500px;overflow: hidden;position: relative;">
            <div>
                <content-loading
                    :spinShow="true"
                ></content-loading>
            </div>
        </article>
    </card>
</template>
<script>
    import contentLoading from '../../components/modal-content-loading';
    import { noticeTips, formatDate, toDay, setPage, translateState, compClientHeight, emptyTips, translateIsQuote, addNum } from '../../../libs/common';
    export default {
        name: 'add-bom',
        components: {
            contentLoading
        },
        data () {
            return {
                formValidate: {},
                ruleValidate: {},
                globalLoadingShow: false,
                tabList: [
                    {
                        label: '清花',
                        disabled: false
                    },
                    {
                        label: '梳棉',
                        disabled: false
                    },
                    {
                        label: '并条',
                        disabled: false
                    }
                ]
            };
        },
        methods: {
            getTabEvent (e) {
                console.log(e)
                this.tabList.forEach((item, index) => {
                    if (index + '' === e) {
                        // item.disabled = false;
                    } else {
                        // item.disabled = true;
                    };
                });
            },
            newAddClick () {},
            cancelClickEvent () {},
            auditClickEvent () {},
            unAuditClickEvent () {},
            closeClickEvent () {},
            openClickEvent () {},
        },
        created () {
            // this.globalLoadingShow = true;
        }
    };
</script>
<style lang="less">

</style>
