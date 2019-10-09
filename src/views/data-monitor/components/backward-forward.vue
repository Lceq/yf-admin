<template>
    <div>
        <div class="backward-forward-bar">
            <div class="backward-forward">
                <a class="backward-forward-item backward-item-active" @click="backwardEvent"><</a>
                <a class="backward-forward-item forward-item-active" @click="forwardEvent">></a>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'backward-forward',
        methods: {
            forwardEvent () {
                this.$emit('on-forward');
            },
            backwardEvent () {
                this.$emit('on-backward');
            }
        }
    };
</script>
<style scoped lang="less">
    .backward-forward-bar {
        position: absolute;
        bottom: 10px;
        right: 10px;
        .backward-forward {
            /*border: 1px solid #fff;*/
            /*background: dodgerblue;*/
            .backward-forward-item:first-child {
                border-right: 1px solid #fff;
            }
            .backward-forward-item {
                width: 4.2vw;
                height: 1.4vw;
                display: inline-block;
                font: bold 1.25vw/1.1vw '';
                background: dodgerblue;
                color: #fff;
                text-align: center;
                border: 1px solid #fff;
                border-radius: 4px 0 4px 4px;
            }
            .backward-item-active:hover {
                box-shadow: 0 0 6px 2px;
                -webkit-transition: all .3s;
                -moz-transition: all .3s;
                -ms-transition: all .3s;
                -o-transition: all .3s;
                transition: all .3s;
            }
            .forward-item-active:hover {
                box-shadow: 0 0 6px 2px;
                -webkit-transition: all .3s;
                -moz-transition: all .3s;
                -ms-transition: all .3s;
                -o-transition: all .3s;
                transition: all .3s;
            }
        }
    }
</style>
