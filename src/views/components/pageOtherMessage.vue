<template>
    <div>
        <Form :label-width="80">
            <Row v-show="createName">
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="创建人:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{createName}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="创建时间:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{createTime}}</div>
                    </FormItem>
                </Col>
            </Row>
            <Row v-show="updateName">
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="修改人:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{updateName}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="修改时间:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{updateTime}}</div>
                    </FormItem>
                </Col>
            </Row>
            <Row v-show="submitName">
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="提交人:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{submitName}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="提交时间:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{submitTime}}</div>
                    </FormItem>
                </Col>
            </Row>
            <Row v-show="auditName">
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="审核人:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{auditName}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="审核时间:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{auditTime}}</div>
                    </FormItem>
                </Col>
            </Row>
            <Row v-show="enableName">
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="禁用人:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{enableName}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="禁用时间:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{enableTime}}</div>
                    </FormItem>
                </Col>
            </Row>
            <Row v-show="closeName">
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="关闭人:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{closeName}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="关闭时间:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{closeTime}}</div>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>
    export default {
        props: ['createTime', 'createName', 'updateName', 'updateTime', 'auditName', 'auditTime', 'closeName', 'closeTime', 'enableName', 'enableTime', 'submitName', 'submitTime']
    };
</script>
