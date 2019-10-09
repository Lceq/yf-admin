<template>
    <div class="xw-table" :style="'font-size:' + fontSize + 'vm;'">
        <Row style="width: 100%; display: -webkit-box">
            <Col v-for="(item, index) of title" :key="index" class="xw-table-title" :style="'text-align:' + item.align" :span="item.span">
                {{ item.title }}
            </Col>
        </Row>
        <div class="tv-table-over" :style="'height:' + theight + 'px;'">
            <div id="table-bar" :style="'top:' + top + 'px;'">
                <Row class="xw-table-bar" v-for="(item, index) of list" :key="index" style="width: 100%; display: -webkit-box">
                    <Col class="xw-table-list" id="table-bar-list" v-for="(title, index) of title" :key="index" :style="'text-align:' + title.align"  :span="title.span">
                        {{ title.key === 'isAbsenteeism' ? '是' : item[title.key] }}
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'xw-table',
    props: {
        top: {
            type: Number
        },
        fontSize: {
            type: Number,
            default: 1
        },
        title: {
            type: Array,
            default: []
        },
        list: {
            type: Array,
            default: []
        },
        numbers: {
            type: Number,
            default: 7
        },
        turn: {
            type: Boolean
        }
    },
    data () {
        return {
            theight: null
            // numbers: 5
            // top: 0
        };
    },
    methods: {
        getTurn () {
            const _this = this;
            this.$nextTick(() => {
                setTimeout(() => {
                    let height = document.getElementById('table-bar').clientHeight;
                    let theight = document.getElementById('table-bar-list').clientHeight;
                    // let theight = document.getElementsByClassName('xw-table-title')[0].clientHeight;
                    let length = Math.ceil(_this.list.length / _this.numbers);
                    _this.theight = (theight * _this.numbers) + 5;
                    let num = 1;
                    // debugger;
                    this.$emit('getTurn', num, length, _this.theight - 5);
                    return false;
                }, 1000);
                // this.getEmitTime(num, length, this.theight);
            });
        }
    },
    watch: {
        turn (newData, oldData) {
            if (newData) {
                this.getTurn();
            };
            // this.top = 0;
        }
    }
};
</script>

<style scoped>
.xw-table{
    font-size: 0.8vw;
}
.xw-table-list{
    border-right: 1px solid #5B657E;
    border-bottom: 1px solid #5B657E;
    padding: 5px 2px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
/*.xw-table-bar .xw-table-title:first-child{*/
    /*border-left: 1px solid #5B657E;*/
/*}*/
.xw-table-title{
    background-color: #5B657E;
    font-weight: bold;
    padding: 5px 2px;
    color: #fff;
    /*font-size: 24px;*/
    /*border: 1px solid #999999;*/
    border-left: none;
    text-align: center;;
}
.tv-table-over{
    overflow: hidden;
    border-bottom: 1px solid #5B657E;
}
#table-bar{
    position: relative;
    border-left: 1px solid #5B657E;
    left: 0;
    top: 0;
    transition: top 1s
}
</style>
