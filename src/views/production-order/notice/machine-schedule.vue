<template>
    <div>
        <div style="display: flex;">
            <div @click="showTipsEvent(item, index)" v-if="productData && productData.length !== 0" v-for="(item, index) in productData" :key="index" :style="setColor(item, index)"></div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            productData: {
                type: Array
            }
        },
        computed: {
            setColor () {
                return (item, index) => {
                    return {
                        'background': item.colorStyle,
                        'color': '#fff',
                        'lineHeight': '30px',
                        'width': '40px',
                        'height': '30px',
                        'box-sizing': 'border-box',
                        'border-left': index % 2 === 1 ? '1px solid #fff' : ''
                    };
                };
            }
        },
        methods: {
            showTipsEvent (e, index) {
                this.$emit('on-click', e);
            }
        }
    };
</script>

