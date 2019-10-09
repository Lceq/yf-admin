<template>
    <Card :dis-hover="true" class="dispalyModal">
        <div class="dispalyTime">
            <p class="othreNameStyle">
                <span>创建人：</span>
                <span>{{createName}}</span>
            </p>
            <p class="otherColumn">
                <span>创建日期：</span>
                <span>{{createTime}}</span>
            </p>
        </div>
        <div v-if="isReverse" class="dispalyTime">
            <p class="othreNameStyle">
                <span>修改人：</span>
                <span>{{reviseName}}</span>
            </p>
            <p class="otherColumn">
                <span>修改日期：</span>
                <span>{{reviseTime}}</span>
            </p>
        </div>
        <div v-if="isForbid" class="dispalyTime">
            <p class="othreNameStyle">
                <span>禁用人：</span>
                <span>{{forbidName}}</span>
            </p>
            <p class="otherColumn">
                <span>禁用日期：</span>
                <span>{{forbidTime}}</span>
            </p>
        </div>
        <div v-if="isClose" class="dispalyTime">
            <p class="othreNameStyle">
                <span>关闭人：</span>
                <span>{{closeName}}</span>
            </p>
            <p class="otherColumn">
                <span>关闭日期：</span>
                <span>{{closeTime}}</span>
            </p>
        </div>
    </Card>
</template>

<script>
export default {
    props: {
        isClose: {
            type: Boolean,
            default: false
        },
        isReverse: {
            type: Boolean,
            default: true
        },
        createName: {
            type: String
        },
        reviseName: {
            type: String
        },
        forbidName: {
            type: String
        },
        isForbid: {
            type: Boolean
        },
        createTime: {
            type: String
        },
        reviseTime: {
            type: String
        },
        forbidTime: {
            type: String
        },
        closeName: {
            type: String
        },
        closeTime: {
            type: String
        }
    }
};
</script>

<style scoped>
/*.dispalyModal{*/
    /*justify-content: flex-start !important;*/
/*}*/
</style>
