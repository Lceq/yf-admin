<template>
    <div>
        <Poptip class="widthPercentage" trigger="hover" placement="bottom" transfer>
            <a class="text-ellipsis">{{ moreOrderData + '' }}</a>
            <div slot="content" class="tooltip-text-color">
                <p v-for="(item, index) in moreOrderData" :key="index">{{item}}</p>
            </div>
        </Poptip>
    </div>
</template>
<script>
    export default {
        props: {
            moreOrderData: {
                type: Array
            }
        }
    };
</script>

<style scoped>
    .text-ellipsis{
        width:100px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #ff9900
    }
</style>
