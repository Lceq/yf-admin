<template>
    <div>
        <Row>
            <Col v-for="(item, index) in tableHeader" :key="index" :span="item.span" :style="{textAlign: !item.align?'left': item.align}" class="sh-table-cell sh-table-header">
                <p :style="transformOrigin(item)" class="sh-font-size">{{item.title}}</p>
            </Col>
        </Row>
        <div class="sh-table-content" :style="setTableHeight">
            <Row v-for="(item, index) in tableData" :key="index">
                <Col v-for="(tableHeaderItem, tableHeaderIndex) in tableHeader" :key="tableHeaderIndex" :span="tableHeaderItem.span" :style="setTableCell(tableHeaderItem)" class="sh-table-cell">
                    <p v-if="tableHeaderItem.key==='state'" class="animation-state"></p>
                    <div v-else :style="transformOrigin(tableHeaderItem)" class="sh-font-size">
                        {{item[tableHeaderItem.key]}}
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>
<script>
    let originStr = '';
    export default {
        name: 'sh-table',
        props: {
            tableData: {
                type: Array
            },
            tableHeader: {
                type: Array
            },
            tableHeight: {
                type: Number
            }
        },
        methods: {
            setOrigin (e) {
                switch (e) {
                    case undefined:
                        originStr = '0';
                        break;
                    case 'left':
                        originStr = '0';
                        break;
                    case 'center':
                        originStr = '50%';
                        break;
                    case 'right':
                        originStr = '100%';
                        break;
                    default: originStr = '0%';
                }
                return originStr;
            }
        },
        computed: {
            transformOrigin () {
                return (e) => {
                    return {
                        'lineHeight': '2.08333vw',
                        'width': '100%',
                        '-webkit-transform-origin-x': this.setOrigin(e.align),
                        '-moz-transform-origin-x': this.setOrigin(e.align),
                        '-ms-transform-origin-x': this.setOrigin(e.align),
                        '-o-transform-origin-x': this.setOrigin(e.align)
                    };
                };
            },
            setTableHeight () {
                let heightVal = 0;
                heightVal = this.tableHeight / 19.2;
                return {
                    height: `${heightVal}vw`
                };
            },
            setTableCell () {
                return (tableHeaderItem) => {
                    if (tableHeaderItem.key === 'state') {
                        return {
                            textAlign: tableHeaderItem.align ? tableHeaderItem.align : 'left',
                            borderTop: 'none',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        };
                    } else {
                        return {
                            textAlign: tableHeaderItem.align ? tableHeaderItem.align : 'left',
                            borderTop: 'none'
                        };
                    };
                };
            }
        }
    };
</script>
<style type="text/css" lang="less" scoped>
    @bg_color: #515a6e;
    @border_color: #515970;
    @iv_font_size: 0.729166vw;
    @media screen and (max-width: 2000px) {
        .sh-font-size {
            transform: scale(1);
        }
    }
    @media screen and (max-width: 1500px) {
        .sh-font-size {
            transform: scale(1);
        }
    }
    @media screen and (max-width: 1300px) {
        .sh-font-size {
            transform: scale(.95);
        }
    }
    @media screen and (max-width: 1200px) {
        .sh-font-size {
            transform: scale(.85);
        }
    }
    @media screen and (max-width: 1100px) {
        .sh-font-size {
            transform: scale(.75);
        }
    }
    @media screen and (max-width: 1000px) {
        .sh-font-size {
            transform: scale(0.65);
        }
    }
    @media screen and (max-width: 900px) {
        .sh-font-size {
            transform: scale(0.55);
        }
    }
    @media screen and (max-width: 800px) {
        .sh-font-size {
            transform: scale(0.45);
        }
    }
    @media screen and (max-width: 700px) {
        .sh-font-size {
            transform: scale(0.35);
        }
    }
    @media screen and (max-width: 600px) {
        .sh-font-size {
            transform: scale(0.25);
        }
    }
    .animation-state {
        width: 1.5625vw;
        height: 1.5625vw;
        background: red;
        border-radius: 100%;
        line-height: 2.08333vw;
        animation: machineAnimation 1s infinite linear ;
    }
    .sh-table-header {
        background-color: #5b657e;
    }
    @keyframes machineAnimation {
        0% {
            background: red;
            box-shadow: 0 0 10px red;
        }
        50% {
            background: #fff;
        }
        100% {
            background: red;
            box-shadow: 0 0 10px red;
        }
    }
    .sh-table-content {
        overflow-y: auto;
        border: solid 1px @border_color;
    }
    .sh-table-cell {
        height: 2.08333vw;
        border-bottom: solid 1px @border_color;
        border-right: solid 1px @border_color;
        border-left: none;
        padding: 0 0.416666vw;
        font-size: @iv_font_size;
        word-break: normal;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        .sh-font-size {
            /*line-height: 2.08333vw;
            width: 100%;
            word-break: normal;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;*/
        }
    }
    .sh-table-cell:last-child {
        border-right: none;
    }
</style>
