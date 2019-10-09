<template>
    <div>
        <div class="modal-content-loading-active" v-if="spinShow">
            <div class="demo-spin-article">
                <Spin size="large" fix style="z-index: 999;"></Spin>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            spinShow: false
        }
    };
</script>
