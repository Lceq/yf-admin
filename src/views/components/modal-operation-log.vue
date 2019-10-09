<template>
    <card class="otherFontStyle" :dis-hover="true">
        <Row type="flex" justify="center" v-for="(item, index) in operationData" :key="index">
            <Col class="otherMessageBarNameWidth">
                <p>
                    <span>{{item.actionName}}人:</span>
                    <span>{{item.userName}}</span>
                </p>
            </Col>
            <Col class="otherMessageBarTimeWidth">
                <p>
                    <span>时间:</span>
                    <span>{{item.createTime}}</span>
                </p>
            </Col>
        </Row>
    </card>
</template>

<script>
    export default {
        props: ['operationData']
    };
</script>