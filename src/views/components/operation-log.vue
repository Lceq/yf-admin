<template>
    <card class="otherFontStyle" :dis-hover="true">
        <Form :label-width="90">
            <Row v-for="(item, index) in operationData" :key="index">
                <Col :sm="24" :md="12" :lg="12" :xl="7" :xxl="6">
                    <FormItem :label="item.actionName + '人:'" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{item.userName}}</div>
                    </FormItem>
                </Col>
                <Col :sm="24" :md="12" :lg="12" :xl="7" :xxl="6">
                    <FormItem label="时间:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{item.createTime}}</div>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    </card>
</template>

<script>
    export default {
        props: ['operationData']
    };
</script>
