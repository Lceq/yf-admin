<template>
    <Card id="pack-bar">
        <div style="color: #fff; font-size: 34px; padding: 0 0 0 0; ">
            <div class="parentFlexBetween  verticalMiddle">
                <div class="verticalMiddle">
                    <img style="height:56px;position: relative;" class="verticalMiddle" src="../../../images/zg.png"  alt="正凯" />
<!--                    <span style="color: #0acddf">车间：</span>-->
<!--                    <span class="modal-readonly margin-right-20"> {{ workshopName }} </span>-->
                    <Select v-model="workshopId" class="selectBackground verticalMiddle" style="font-size: 18px;width: 100px; " placeholder="请选择车间">
                        <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
<!--                    <Button class=""  :loading="exportLoading" type="primary" @click="exportExcel">导出统计结果</Button>-->
                    <Button class="" type="primary" shape="circle" size="large" @click="expandCharts" :icon="!value ? 'ios-expand' : 'ios-exit'"></Button>
                </div>
                <div> <h3 class="marginBottom verticalMiddle colorTitle" style="text-align: center">{{ title }}</h3></div>
                <span class="margin-right-20 verticalMiddle"> <span style="color: #0acddf">当前时间</span>：<span class="color">{{ time }}</span></span>
            </div>
            <div class="verticalMiddle">
                <!--<div class="leftFlex" style=" font-size: 28px; padding: 10px; font-weight: 600; border-radius: 5px;">-->
                    <!--<p class="margin-right-20">区域：17#</p>-->
                    <!--<p class="margin-right-20">温度：28℃</p>-->
                    <!--<p>湿度：56%</p>-->
                <!--</div>-->
                <div class="flex-left" v-for="(item, index) of region" :key="index">
                    <p class="margin-right-10">区域：{{ item.name }}</p>
                    <p class="margin-right-10" :style="'color:' + ( item.temNormal ? '' : 'rgb(237, 64, 20)')">{{ item.actualTemperature }}℃</p>
                    <p :style="'color:' + ( item.humNormal ? '' : 'rgb(237, 64, 20)')">{{ item.actualHumidity }}%</p>
                </div>
            </div>
        </div>
        <Carousel
            style="width: 100%"
            v-model="value3"
            :autoplay="true"
            :autoplay-speed="speed"
            dots="none"
            :radius-dot="false"
            arrow="never"
        >
            <CarouselItem  style="width: 50%">
                <Table class="order-title" border :columns="orderColumns"></Table>
                <div class="table-bar" :style="'height:' + Height + 'px'">
                    <div id="order-bar" class="order-bar" :style="'top:' + orderTop + 'px'">
                        <Table :show-header="false" border :data="orderList" :columns="orderColumns"></Table>
                    </div>
                </div>
            </CarouselItem>
            <CarouselItem style="width: 50%">
<!--                <div class="marginBottom">-->
<!--&lt;!&ndash;                    <h3 class="marginBottom colorTitle" style="text-align: center">人员产量统计</h3>&ndash;&gt;-->
<!--                </div>-->
                <Table class="order-title" border :columns="userColumns"></Table>
                <div class="table-bar" :style="'height:' + Height + 'px'">
                    <div id="user-bar" class="order-bar" :style="'top:' + userTop + 'px'">
                        <Table :show-header="false" border :data="userList" :columns="userColumns"></Table>
                    </div>
                </div>
            </CarouselItem>
        </Carousel>
        <div style="position: relative; top: -66px;">
            <div id="paId" style="font-size: 54px;padding: 10px;color:#EE8300;">
                <p id="pId" class="pId" :style="'left:' + pLeft + 'px; white-space: nowrap;overflow: hidden;'">{{ noticeContent }}</p>
            </div>
        </div>
    </Card>
</template>
<script>
import {curDate, curDatetime} from '../../../libs/tools';
import excel from '../../../libs/excel.js';
export default {
    name: 'xw-pack-analysis',
    data () {
        return {
            region: [],
            paWidth: '',
            pLeft: 100000,
            value: false,
            speed: 25000,
            value3: 0,
            orderTop: 0,
            userTop: 0,
            orderList: [],
            userList: [],
            orderColumns: [
                // {
                //     title: '订单号',
                //     key: 'prdOrderCode',
                //     minWidth: 110,
                //     sortable: true,
                //     align: 'left'
                // },
                {
                    title: '产品/批号',
                    key: 'productName',
                    minWidth: 150,
                    align: 'left',
                    render: (h, params) => {
                        return h('div', {}, [
                            h('p', {}, params.row.productName),
                            h('p', {}, params.row.batchCode)
                        ]);
                    }
                },
                // {
                //     title: '批号',
                //     key: 'batchCode',
                //     minWidth: 110,
                //     align: 'left'
                // },
                {
                    title: '纸管',
                    key: 'paperTubeName',
                    minWidth: 60,
                    align: 'left',
                    // renderHeader: (h, params) => {
                    //     return h('div', {}, [
                    //         h('p', {}, '纸管'),
                    //         h('p', {}, '腰绳'),
                    //         h('p', {}, '缝口')
                    //     ]);
                    // },
                    // render: (h, params) => {
                    //     return h('div', {}, [
                    //         h('p', {}, params.row.paperTubeName),
                    //         h('p', {}, params.row.waistRopeName),
                    //         h('p', {}, params.row.packingModeName)
                    //     ]);
                    // }
                },
                {
                    title: '腰绳',
                    key: 'waistRopeName',
                    minWidth: 60,
                    align: 'left'
                },
                {
                    title: '缝口颜色',
                    key: 'bagMouthName',
                    minWidth: 80,
                    align: 'left'
                },
                {
                    title: '包装规格',
                    key: 'packingBag',
                    minWidth: 110,
                    align: 'left'
                },
                {
                    title: '订单量(Kg)',
                    key: 'productionQty',
                    minWidth: 60,
                    align: 'right',
                    renderHeader: (h, params) => {
                        return h('div', {}, [
                            h('p', {}, '订单量'),
                            h('p', {}, 'Kg')
                        ]);
                    }
                },
                {
                    title: '完成数量(Kg)',
                    key: 'completionQty',
                    minWidth: 60,
                    align: 'right',
                    renderHeader: (h, params) => {
                        return h('div', {}, [
                            h('p', {}, '完成量'),
                            h('p', {}, 'Kg')
                        ]);
                    }
                },
                {
                    title: '未完成数量(Kg)',
                    key: 'onCompletionQty',
                    minWidth: 90,
                    align: 'right',
                    renderHeader: (h, params) => {
                        return h('div', {}, [
                            h('p', {}, '未完成量'),
                            h('p', {}, 'Kg')
                        ]);
                    }
                },
                {
                    title: '当班数量(Kg)',
                    key: 'totalQty',
                    minWidth: 60,
                    align: 'right',
                    renderHeader: (h, params) => {
                        return h('div', {}, [
                            h('p', {}, '当班量'),
                            h('p', {}, 'Kg')
                        ]);
                    }
                }
            ],
            userColumns: [
                {
                    title: '工号',
                    key: 'userCode',
                    minWidth: 110,
                    align: 'left'
                },
                {
                    title: '人员',
                    key: 'userName',
                    minWidth: 110,
                    align: 'left'
                },
                // {
                //     title: '班组',
                //     key: 'groupName',
                //     minWidth: 100,
                //     align: 'left'
                // },
                {
                    title: '当班产量(Kg)',
                    key: 'date',
                    minWidth: 110,
                    align: 'right',
                    renderHeader: (h, params) => {
                        return h('div', {}, [
                            h('p', {}, '当班产量'),
                            h('p', {}, 'Kg')
                        ]);
                    }
                },
                {
                    title: '本周产量(Kg)',
                    key: 'week',
                    minWidth: 100,
                    align: 'right',
                    renderHeader: (h, params) => {
                        return h('div', {}, [
                            h('p', {}, '本周产量'),
                            h('p', {}, 'Kg')
                        ]);
                    }
                },
                {
                    title: '本月产量(Kg)',
                    key: 'month',
                    minWidth: 110,
                    align: 'right',
                    renderHeader: (h, params) => {
                        return h('div', {}, [
                            h('p', {}, '本月产量'),
                            h('p', {}, 'Kg')
                        ]);
                    }
                },
                {
                    title: '当班计件',
                    key: 'piece',
                    minWidth: 100,
                    align: 'right'
                },
                {
                    title: '当班考核',
                    key: 'kaohe',
                    minWidth: 110,
                    align: 'right'
                }
            ],
            noticeContent: '',
            Height: null,
            workshopName: '',
            workshopId: '',
            workshopList: [],
            time: curDatetime(),
            exportLoading: false,
            title: '订单完成情况统计'
        };
    },
    methods: {
        exportExcel () {
            if (this.value3 === 0) {
                if (this.orderColumns.length) {
                    this.exportLoading = true;
                    const params = {
                        title: this.orderColumns.map(x => x.title),
                        key: this.orderColumns.map(x => x.key),
                        data: this.orderList,
                        autoWidth: true,
                        filename: '订单完成统计'
                    };
                    excel.export_array_to_excel(params);
                    this.exportLoading = false;
                } else {
                    this.$Message.info('表格数据不能为空！');
                }
            }
            if (this.value3 === 1) {
                if (this.userColumns.length) {
                    this.exportLoading = true;
                    const params = {
                        title: this.userColumns.map(x => x.title),
                        key: this.userColumns.map(x => x.key),
                        data: this.userList,
                        autoWidth: true,
                        filename: '人员产量统计'
                    };
                    excel.export_array_to_excel(params);
                    this.exportLoading = false;
                } else {
                    this.$Message.info('表格数据不能为空！');
                }
            }
        },
        expandCharts () {
            const main = document.getElementById('pack-bar');
            if (this.value) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (main.requestFullscreen) {
                    main.requestFullscreen();
                } else if (main.mozRequestFullScreen) {
                    main.mozRequestFullScreen();
                } else if (main.webkitRequestFullScreen) {
                    main.webkitRequestFullScreen();
                } else if (main.msRequestFullscreen) {
                    main.msRequestFullscreen();
                }
            }
            this.value = !this.value;
        },
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopName = res.workshopList.find(x => x.deptId === res.curWorkshopId).deptName;
                this.workshopList = res.workshopList;
                this.getPackCompoment(1);
                this.getUserList();
                this.listByProcessCode();
                setInterval(() => {
                    this.listByProcessCode();
                }, 30000);
            });
        },
        getPackCompoment (val) {
            let params = {
                workshopId: this.workshopId
            };
            this.$call('pack.report.list3', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    setTimeout(() => {
                        this.orderList = content.res.map(x => {
                            x.paperTubeName = x.prdOrderPackingEntity.paperTubeName;
                            x.waistRopeName = x.prdOrderPackingEntity.waistRopeName;
                            x.bagMouthName = x.prdOrderPackingEntity.bagMouthName;
                            x.packingModeName = x.prdOrderPackingEntity.packingModeName;
                            x.packingBag = x.prdOrderPackingEntity.packingBag;
                            return x;
                        });
                    }, 0);
                    if (val) {
                        this.getNoticeContent();
                        this.getOrderHorse();
                    }
                }
            });
        },
        getNoticeContent () {
            const _this = this;
            this.$call('notice.contents').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.noticeContent = content.res;
                    // debugger
                    _this.getPTake();
                }
            });
        },
        getPTake () {
            const width = document.getElementById('pId').clientWidth;
            this.pLeft = width;
            setInterval(() => {
                this.pLeft += -3;
                if (this.pLeft < -width) {
                    this.pLeft = width;
                }
            }, 50);
        },
        getUserList () {
            let params = {
                workshopId: this.workshopId,
                date: curDate()
            };
            this.$call('pack.report.statistical', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    setTimeout(() => {
                        this.userList = content.res;
                    });
                }
            });
        },
        getOrderHorse () {
            this.$nextTick(() => {
                this.orderTop = 0;
                setTimeout(() => {
                    let orderHeight = document.getElementById('order-bar').offsetHeight;
                    this.Height = window.screen.height - 380;
                    let H = this.Height - orderHeight;
                    const timer = setInterval(() => {
                        if (this.orderTop > H) {
                            this.orderTop += H / 1500;
                            // console.log(this.value3);
                        } else {
                            clearTimeout(timer);
                        }
                    }, 10);
                    if (H < 0) {
                        setTimeout(() => {
                            timer();
                        }, 4000);
                    }
                }, 3000);
            });
        },
        getUserHorse () {
            this.userTop = 0;
            setTimeout(() => {
                let orderHeight = document.getElementById('user-bar').offsetHeight;
                this.Height = window.screen.height - 380;
                let H = this.Height - orderHeight;
                const timer = setInterval(() => {
                    if (this.userTop > H) {
                        this.userTop += H / 1100;
                    } else {
                        clearTimeout(timer);
                    }
                }, 10);
                if (H < 0) {
                    setTimeout(() => {
                        timer();
                    }, 4000);
                }
            }, 3000);
        },
        listByProcessCode () {
            this.$call('environment.area.listByProcessCode', {workshopId: this.workshopId, processCode: 'BZ'}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.region = content.res;
                }
            });
        }
        // getFullScreen () {
        //     this.$nextTick(() => {
        //         const main = document.getElementById('pack-bar');
        //         if (main.requestFullscreen) {
        //             main.requestFullscreen();
        //         } else if (main.mozRequestFullScreen) {
        //             main.mozRequestFullScreen();
        //         } else if (main.webkitRequestFullScreen) {
        //             main.webkitRequestFullScreen();
        //         } else if (main.msRequestFullscreen) {
        //             main.msRequestFullscreen();
        //         }
        //     });
        // }
    },
    created () {
    },
    mounted () {
        this.$nextTick(() => {
            setInterval(() => {
                this.time = curDatetime();
            }, 1000);
            this.getUserWorkshop();
        });
    },
    watch: {
        value3 (newData, oldData) {
            if (newData === 1) {
                this.speed = 15000;
                // this.title = '订单完成情况统计';
                this.title = '人员产量统计';
                this.getUserHorse();
                this.orderList = [];
                this.getPackCompoment();
            }
            if (newData === 0) {
                this.speed = 25000;
                this.title = '订单完成情况统计';
                this.userList = [];
                this.getUserList();
                this.getOrderHorse();
            }
        }
    }
};
</script>

<style scoped>
@font-face {
    font-family: 'sh-font-time';
    src: url("../../../styles/fonts/DIGITAL-Dreamfat.ttf");
}
/*.font-size{*/
/*    font-size: 14px;*/
/*}*/
.color {
    color: #bcbcbc;
    font-family: 'sh-font-time';
    position: relative;
    top: -2px;
    font-size: 30px;
    /*line-height: 32px*/
}
#pack-bar{
    background-color: #22272d;
}
.order-title{
    position: relative;
    z-index: 100;
}
.table-bar{
    position: relative;
    top: -75px;
    left: 0;
    z-index: 101;
    /*height: 400px;*/
    overflow: hidden;
}
/*.color{*/
    /*color: rgb(254, 153, 0)*/
/*}*/
.order-bar{
    position: relative;
    left: 0;
}
.margin-right-20{
    margin-right: 20px;
}
.colorTitle{
    font-size: 36px;
    color: #0cffe9;
}
#pId{
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
}
.pId{
    position: absolute;
    right:auto;
}
.verticalMiddle{
    vertical-align: middle;
    line-height: 56px;
}
</style>
