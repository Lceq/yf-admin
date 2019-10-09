<template>
    <card v-if="operationList && createName" class="otherFontStyle" :dis-hover="true">
        <Form :label-width="90">
            <Row v-show="createName">
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="创建人：" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{createName}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="时间：" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{createTime}}</div>
                    </FormItem>
                </Col>
            </Row>
            <Row v-show="updateName">
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="修改人：" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{updateName}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="时间：" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{updateTime}}</div>
                    </FormItem>
                </Col>
            </Row>
            <Row v-for="(item, index) in operationList" :key="index">
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem :label="item.actionName + '人：'" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{item.userName}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="时间：" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{item.createTime}}</div>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    </card>
</template>

<script>
export default {
    name: 'xw-operation-log',
    props: ['createName', 'createTime', 'updateName', 'updateTime', 'operationList']
};
</script>

<style scoped>

</style>
