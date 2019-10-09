<template>
    <div>
        <Card>
            <Row>
                <Col class="monitor" :style="monitorHeight">
                    <iframe class="iframe" :src="dynamicPath" scrolling="auto"></iframe>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
    import publicJs from '../../libs/common';
    export default {
        name: 'monitoring',
        data () {
            return {
                monitorHeight: {},
                dynamicPath: ''
            };
        },
        created () {
            this.$store.dispatch({
                type: 'showLoading'
            });
            let hei = document.documentElement.clientHeight - 180 + 'px';
            this.monitorHeight = {height: hei};
        },
        mounted () {
            this.$store.dispatch({
                type: 'hideLoading'
            });
            window.onresize = () => {
                let hei = publicJs.compClientHeight(200) + 'px';
                this.monitorHeight = {height: hei};
            };
        },
        watch: {
            $route (to, from) {
                this.dynamicPath = `${this.$route.params.aId}`;
            }
        },
        beforeRouteEnter (to, from, next) {
            next((_this) => {
                _this.dynamicPath = `${to.params.aId}`;
            });
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
        border:none;
    }
</style>
