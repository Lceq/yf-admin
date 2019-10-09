<template>
    <div>
        <Row v-for="(item, index) in listData" :key="index" class="flex-left">
            <Col class="flex-left" span="4">
                <!--<p class="item-line-height text-left">{{`${item.productName}(${item.productCode})`}}</p>-->
                <p class="item-line-height text-left">{{item.productName}}</p>
            </Col>
            <Col span="2" class="flex-left packet-bar-width apply-num-bar">
                <p class="min-label-width item-line-height text-left">批号：</p>
                <p class="item-line-height text-left">{{item.batchCode}}</p>
            </Col>
            <Col span="2" class="flex-left packet-bar-width apply-num-bar">
                <p class="min-label-width item-line-height text-left">单位：</p>
                <p class="item-line-height text-left">{{`${item.unitName}(${item.unitCode})`}}</p>
            </Col>
            <Col span="2" class="flex-left packet-bar-width apply-num-bar">
                <p class="max-label-width item-line-height text-left">配棉包数：</p>
                <p class="item-line-height text-left">{{item.packetQty}}</p>
            </Col>
            <Col span="2" class="flex-left packet-bar-width apply-num-bar">
                <p class="max-label-width item-line-height text-left">已领包数：</p>
                <p class="item-line-height text-left">{{item.usedPacketQty}}</p>
            </Col>
            <Col span="2.5" class="flex-left apply-num-bar">
                <span class="max-label-width item-line-height text-left">申领包数：</span>
<!--                <InputNumber :disabled="isDetail?true:false" v-model="item.applyPacketQty" size="small" @on-change="getApplyPacketEvent($event, index)"/>-->
                <InputNumber :disabled="true" v-model="item.applyPacketQty" size="small" @on-change="getApplyPacketEvent($event, index)"/>
            </Col>
            <!--<Col span="2" class="flex-left packet-bar-width apply-num-bar">
                <p class="max-label-width item-line-height text-left">配棉重量：</p>
                <p class="item-line-height text-left">{{item.weightQty}}</p>
            </Col>
            <Col span="2" class="flex-left packet-bar-width apply-num-bar">
                <p class="max-label-width item-line-height text-left">已领重量：</p>
                <p class="item-line-height text-left">{{item.usedWeightQty}}</p>
            </Col>
            <Col span="2" class="flex-left packet-bar-width apply-num-bar">
                <p class="middle-label-width item-line-height text-left margin-left-2">现存量：</p>
                <p class="item-line-height text-left">{{item.stockQty}}</p>
            </Col>
            <Col span="2" class="flex-left packet-bar-width apply-num-bar">
                <p class="middle-label-width item-line-height text-left margin-left-2">可用量：</p>
                <p class="item-line-height text-left">{{item.usableQty}}</p>
            </Col>-->
            <Col span="2.5" class="flex-left apply-num-bar">
                <span class="max-label-width item-line-height ">申领重量：</span>
<!--                <InputNumber :disabled="isDetail?true:false" v-model="item.applyWeightQty" size="small" @on-change="getApplyWeightEvent($event, index)"/>-->
                <InputNumber :disabled="true" v-model="item.applyWeightQty" size="small" @on-change="getApplyWeightEvent($event, index)"/>
            </Col>
        </Row>
    </div>
</template>
<script>
    import moreOrder from '../archives/more-order';
    export default {
        components: { moreOrder },
        props: {
            listData: {
                type: Array
            },
            isDetail: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            getApplyPacketEvent (e, index) {
                this.$emit('packet-change', e, index);
            },
            getApplyWeightEvent (e, index) {
                this.$emit('weight-change', e, index);
            },
        },
        watch: {
            listData (newVal, oldVal) {

            }
        }
    };
</script>
<style scoped>
    .middle-label-width {
        font-weight: bold;
        width: 52px;
    }
    .text-ellipsis{
        width:100px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #ff9900
    }
    .max-label-width {
        font-weight: bold;
        width: 64px;
    }
    .min-label-width {
        font-weight: bold;
        width: 36px;
    }
    .packet-bar-width {
        width: 100px;
    }
    .material-bar-width {
        width: 250px;
    }
    .material-value-width {
        width: 200px;
    }
    .item-line-height {
        line-height: 24px;
    }
    .text-left {
        text-align: left;
    }
    .label-width {
        width: 60px;
    }
    .pack-number-width {
        width: 100px;
    }
    .apply-num-bar {
        margin: 2px 0 2px 4px;
    }
    .margin-left-2 {
        margin-left: 4px;
    }
</style>
