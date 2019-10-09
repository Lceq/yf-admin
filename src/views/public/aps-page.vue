<template>
    <div>
        <Card>
            <Row>
                <Col class="monitor" :style="monitorHeight">
                    <scheduler></scheduler>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
    import scheduler from './scheduler';
    import publicJs from '../../libs/common';
    export default {
        name: 'monitoring',
        data () {
            return {
                monitorHeight: {}
            };
        },
        components: {
            scheduler
        },
        created () {
            this.$store.dispatch({
                type: 'showLoading'
            });
            let hei = document.documentElement.clientHeight - 155 + 'px';
            // debugger
            this.monitorHeight = {height: hei};
        },
        mounted () {
            this.$store.dispatch({
                type: 'hideLoading'
            });
            window.onresize = () => {
                let hei = publicJs.compClientHeight(155) + 'px';
                this.monitorHeight = {height: hei};
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
