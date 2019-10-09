<template>
    <div>
        <Card>
            <Row>
                <Col class="monitor" :style="monitorHeight">
                    <iframe class="iframe" src="http://47.96.92.252/visu_zh.html#show_view=沈吉_总貌&hidemenu" scrolling="no"></iframe>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
import publicJs from '../../../libs/common';
export default {
    name: 'monitoring',
    data () {
        return {
            monitorHeight: {}
        };
    },
    created () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        let hei = document.documentElement.clientHeight - 180 + 'px';
        // debugger
        this.monitorHeight = {height: hei};
    },
    mounted () {
        this.$store.dispatch({
            type: 'hideLoading'
        });
        window.onresize = () => {
            let hei = publicJs.compClientHeight(200) + 'px';
            this.monitorHeight = {height: hei};
            // this.tableHeight = publicJs.compClientHeight(200);
        };
    }
};
</script>

<style scoped>
.monitor{
    width: 100%;
    vertical-align: top;
    /*height: 750px;*/
}
.iframe{
    vertical-align: top;
    width: 100%;
    /*height: 100%;*/
    height: inherit;
}
</style>
