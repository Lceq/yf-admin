<template>
    <div>
        <iframe :style="'width:' + width + 'px;height:' + height + 'px;'" src="http://192.168.64.100/visu_zh.html#show_view=总貌&hidemenu" scrolling="auto"></iframe>
        <!--<iframe :style="'width:' + width + 'px;height:' + height + 'px;'" src="http://www.jingdong.com" scrolling="auto"></iframe>-->
    </div>
</template>

<script>
export default {
    name: 'tv-scada',
    props: {
        width: {
            type: Number
        },
        height: {
            type: Number
        }
    }
};
</script>

<style scoped>

</style>
