<template>
    <div>
        <div v-for="(item, index) in row" :key="index">
            <Row class="expand-row">
                <Col :sm="12" :md="8" :lg="3"  :xl="3"  :xxl="3">
                    <span class="expand-key">产品: </span>
                    <span class="expand-value">{{ item.productName ? `${item.productName}(${item.productCode})` : '' }}</span>
                </Col>
                <Col :sm="12" :md="8" :lg="3"  :xl="3"  :xxl="3">
                    <span class="expand-key">规格: </span>
                    <span class="expand-value">{{ item.productModels }}</span>
                </Col>
                <Col :sm="12" :md="8" :lg="3"  :xl="3"  :xxl="3">
                    <span class="expand-key">加工工序: </span>
                    <span class="expand-value">{{ item.processName }}</span>
                </Col>
                <Col :sm="12" :md="8" :lg="3"  :xl="3"  :xxl="3">
                    <span class="expand-key">单位: </span>
                    <span class="expand-value">{{ item.unitName ? `${item.unitName}(${item.unitCode})` : '' }}</span>
                </Col>
                <Col :sm="12" :md="8" :lg="3"  :xl="3"  :xxl="3">
                    <span class="expand-key">批号: </span>
                    <span class="expand-value">{{ item.batchCode }}</span>
                </Col>
                <Col :sm="12" :md="8" :lg="3"  :xl="3"  :xxl="3">
                    <span class="expand-key">申请入库数量: </span>
                    <span class="expand-value">{{ item.qty }}</span>
                </Col>
                <Col :sm="24" :lg="6">
                    <span class="expand-key">备注: </span>
                    <span class="expand-value">{{ item.remarks }}</span>
                </Col>
            </Row>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            row: Array
        },
        methods: {}
    };
</script>
<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
    .expand-key {
        font-weight: bold;
    }
</style>
