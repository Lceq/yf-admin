<template>
    <div class="home-main">
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row :gutter="20">
            <Col :xs="24" :sm="24" :md="12" :lg="12" :xl="6" :xxl="6" class="columnHeight-120">
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :sm="24" :md="24" :lg="24">
                        <Card :padding="0" class="informationColumnBackground">
                            <Row type="flex" justify="space-around" align="middle" class="user-infor">
                                <Col >
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <Avatar class="heardPhoto"  icon="ios-person" size="large" />
                                    </Row>
                                </Col>
                                <Col :sm="14" :md="14" :lg="14">
                                    <Row>
                                        <Col>
                                            <b class="login-person-name">{{ loginName }}</b>
                                            <p class="login-title">{{ loginTitle }}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col><p class="notwrap login-head">上次登录时间&nbsp;:</p></Col>
                                        <Col class="loginTimeStyle login-time-style">&nbsp;{{lastLoginTime}}</Col>
                                    </Row>
                                    <Row>
                                        <Col class="float-left"><p class="notwrap">上次登录地点&nbsp;: </p></Col>
                                        <Col class="loginTimeStyle float-left">&nbsp;上海</Col>
                                    </Row>
                                </Col>
                            </Row>

                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col>
                <Row>
                    <Col :sm="24" :md="24" :lg="24" :xl="18" :xxl="18">
                        <Carousel :autoplay-speed="5000" :autoplay="openMachineAutoPlay" v-model="value1" dots="none" arrow="always" class="backgroundWhite" @mouseover.native="getOpenMachineMouseOver" @mouseleave.native="getOpenMachineMouseLeave">
                            <CarouselItem v-for="(items,index) in this.processArray" :key="index">
                                <Row type="flex" justify="center" align="middle" class="columnHeight-120 lastChildProcess">
                                    <Col :md="5" :lg="5" v-for="(item,indexs) in items.carouselItem" class="openProcessColumnStyle" :key="indexs">
                                        <i-circle :percent="item.percentage" :stroke-color="item.circleColor" style="width:80px;height: 80px;">
                                            <span class="demo-Circle-inner fontSize-24">
                                                {{ item.percentage }}%
                                            </span>
                                        </i-circle>
                                        <p class="toDayOpen">
                                            <span>{{item.processName }}今日开台</span>
                                            <span><b :style="{ fontWeight:200,marginRight:'4px',fontSize:'32px',color:item.circleColor }">{{item.openCount}}</b>台</span>
                                        </p>
                                    </Col>
                                </Row>
                            </CarouselItem>
                        </Carousel>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="24" :xl="14" :xxl="14">
                <Card :padding="0">
                    <p slot="title" class="card-title">
                        <span class="module-title-text">快捷入口</span>
                        <a @click="addShortCutEvent" size="small" class="float-right add-shortcut">+添加</a>
                    </p>
                    <Row class="shortcutBoxHeight"  :gutter="10">
                        <Col v-for="(shortCutItem, index) in shortCutList" :key="index" :sm="24" :md='12' :lg="6" class="margin-top-10">
                            <div class="shortcutBox">
                                <router-link class="shortcutStyle" :to="'/'+ shortCutItem.moduleNavUrl">
                                    <Icon :type="shortCutItem.moduleIconUrl" :style="{'color': shortCutItem.iconFontColor}" :custom="shortCutItem.moduleIconUrl" size="34" class="shortcutIconStyle"></Icon>
                                    <span>{{shortCutItem.moduleName}}</span>
                                </router-link>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col :md="24" :lg="24" :xl="10" :xxl="10">
                <Card :padding="0">
                    <p slot="title" class="card-title">
                        <span class="module-title-text">在线产品</span>
                        <router-link to="/inlineDetail" class="float-right add-shortcut">产品详情</router-link>
                    </p>
                    <Row type="flex" justify="space-between" align="middle" class="inlineBoxPadding">
                        <Col :xs="24" :sm="24" :md="24" :lg="24">
                            <Carousel :autoplay-speed="5000" :autoplay="inLineAutoPlay" arrow="always" dots="none" @mouseover.native="getInLineMouseOver" @mouseleave.native="getInLineMouseLeave">
                                <CarouselItem v-for="(items,indexs) in this.openMachineData" :key="indexs" style="height: 162px;overflow-y: auto;">
                                    <Row v-for="(item,index) in items.carouselItem" :key="index" type="flex" justify="center">
                                        <Col class="inlineProdText">
                                            <Icon :style="{color:item.iconUrl}" type="md-arrow-dropup-circle" />
                                            <span>{{item.machineName}}:</span>
                                            <span>{{item.productName}}</span>
                                            <span>{{item.planOutputText}}</span>
                                            <span>{{item.planOutput}}</span>
                                        </Col>
                                        <Col class="inlineProdText">
                                            <Icon :style="{color:item.iconUrl}" type="md-arrow-dropup-circle" />
                                            <span>{{item.machineName}}:</span>
                                            <span>{{item.productName}}</span>
                                            <span>{{item.planOutputText}}</span>
                                            <span>{{item.planOutput}}</span>
                                        </Col>
                                    </Row>
                                </CarouselItem>
                            </Carousel>
                        </Col>
                    </Row>
                </Card>

            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="24" :xl="14" :xxl="14">
                <Card class="orderBoxBorderTop" :padding="10">
                    <p slot="title" class="card-title">
                        <span class="module-title-text">待审核生产订单</span>
                    </p>
                    <div class="to-do-list-con">
                        <to-do-list-item :orderTableData="orderTableData"></to-do-list-item>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="24" :xl="10" :xxl="10">
                <Card class="specBoxBorderTop" :padding="10">
                    <p slot="title" class="card-title">
                        <span class="module-title-text">待审核品种工艺单</span>
                    </p>
                    <div class="to-do-list-con">
                        <spec-to-do-list :processSheetData="processSheetData"></spec-to-do-list>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="24" :xl="14" :xxl="14">
                <Card class="reportBoxBorderTop" :padding="10">
                    <p slot="title" class="card-title">
                        <span class="module-title-text">待审核生产报工单</span>
                    </p>
                    <div class="to-do-list-con">
                        <report-to-do-list :reportSheetData="reportSheetData"></report-to-do-list>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="24" :xl="10" :xxl="10">
                <Card class="noticeBoxBorderTop" :padding="10">
                    <p slot="title" class="card-title">
                        <span class="module-title-text">待审核生产通知单</span>
                    </p>
                    <div class="to-do-list-con">
                        <notice-to-do-list :noticeSheetData="noticeSheetData"></notice-to-do-list>
                    </div>
                </Card>
            </Col>
        </Row>
        <add-short-cut-modal
                :allModuleList="allModuleList"
                :addShortCutModalState="addShortCutModalState"
                :selectShortCutList="selectShortCutList"
                :addShortCutModalContentLoading="addShortCutModalContentLoading"
                @visible-change="addShortCutModalStateChange"
                @cancel-event="addShortCutModalCancelEvent"
                @confirm-event="addShortCutModalConfirmEvent"
        ></add-short-cut-modal>
    </div>
</template>

<script>
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import toDoListItem from './components/toDoListItem.vue';
import specToDoList from './components/specToDoList.vue';
import noticeToDoList from './components/noticeToDoList.vue';
import reportToDoList from './components/reportToDoList.vue';
import openMachineToDoList from './components/openMachineToDoList.vue';
import addShortCutModal from './components/add-shortCut-modal';
import api from '../../ajax/api';
export default {
    name: 'home',
    components: {
        countUp,
        inforCard,
        toDoListItem,
        specToDoList,
        noticeToDoList,
        reportToDoList,
        openMachineToDoList,
        addShortCutModal
    },
    data () {
        return {
            selectShortCutList: [],
            addShortCutModalContentLoading: false,
            allModuleList: [],
            shortCutList: [],
            addShortCutModalState: false,
            globalLoadingShow: false,
            inLineAutoPlay: true,
            openMachineAutoPlay: true,
            loginTitle: '',
            loginName: '',
            lastLoginTime: '',
            allProcessList: [],
            processContain: [],
            value1: 0,
            toDoList: [
                {
                    title: 'PO18080117'
                },
                {
                    title: 'PO18080118'
                },
                {
                    title: 'PO18080119'
                },
                {
                    title: 'PO18080120'
                },
                {
                    title: 'PO18080121'
                }
            ],
            processArray: [],
            openMachineData: [],
            reportSheetData: [],
            noticeSheetData: [],
            processSheetData: [],
            orderTableData: []
        };
    },
    methods: {
        toTree (data) {
            data.forEach((item) => {
                delete item.children;
            });
            var map = {};
            data.forEach((item) => {
                map[item.id] = item;
            });
            var val = [];
            data.forEach((item) => {
                var parent = map[item.parentId];
                if (parent) {
                    item.title = item.name;
                    item.value = item.id;
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    item.title = item.name;
                    item.value = item.id;
                    val.push(item);
                }
            });
            return val;
        },
        // 监听创建快捷modal状态
        addShortCutModalStateChange (e) {
            this.addShortCutModalState = e;
            if (e === false) this.selectShortCutList = [];
        },
        // 获取人员所有的模块列表
        getUserModuleListHttp () {
            this.selectShortCutList = JSON.parse(JSON.stringify(this.shortCutList));
            this.$call('module/shortcut/entry/list').then(res => {
                if (res.data.status === 200) {
                    let responseData = res.data.res;
                    responseData.forEach((allItem) => {
                        this.shortCutList.forEach((selectItem) => {
                            if (selectItem.moduleId === allItem.id) {
                                allItem.checked = true;
                            };
                        });
                    });
                    let data = this.toTree(responseData);
                    data[0].expand = true;
                    this.allModuleList = data;
                    this.addShortCutModalContentLoading = false;
                };
            });
        },
        // 取消事件
        addShortCutModalCancelEvent () {
            this.addShortCutModalState = false;
        },
        // 确认事件
        addShortCutModalConfirmEvent () {
            this.addShortCutModalState = false;
            this.getShortCutList();
        },
        // 添加按钮事件
        addShortCutEvent () {
            this.addShortCutModalState = true;
            this.addShortCutModalContentLoading = true;
            this.getUserModuleListHttp();
        },
        // 开台移入移出事件
        getOpenMachineMouseOver () {
            this.openMachineAutoPlay = false;
        },
        getOpenMachineMouseLeave () {
            this.openMachineAutoPlay = true;
        },
        // 开台移入移出事件
        getInLineMouseOver () {
            this.inLineAutoPlay = false;
        },
        getInLineMouseLeave () {
            this.inLineAutoPlay = true;
        },
        // 计算百分比的方法
        divisionKeepTwoDecPer (openCount, totalCount) {
            if (openCount !== 0 && totalCount !== 0) {
                return Math.round((openCount / totalCount * 10000) / 100.00);
            } else if (openCount === 0) {
                return 0;
            } else if (totalCount === 0) {
                return 0;
            }
        },
        // 获取未审核的订单
        getUnAuditedOrderHttp (resolve, reject) {
            this.$call('prd.order.list', { 'auditState': 2 }).then(res => {
                if (res.data.status === 200) {
                    resolve(res);
                    this.orderTableData = res.data.res;
                }
            }).catch(error => {
                reject(error);
            });
        },
        getSpecListHttp (resolve, reject) {
            return this.$call('spec.sheet.list', { 'auditState': 2 }).then(res => {
                if (res.data.status === 200) {
                    resolve(res);
                    this.processSheetData = res.data.res;
                }
            }).catch(error => {
                reject(error);
            });
        },
        getNoticeHttp (resolve, reject) {
            this.$call('prd.notice.list', { 'auditState': 2 }).then(res => {
                if (res.data.status === 200) {
                    resolve(res);
                    this.noticeSheetData = res.data.res;
                }
            }).catch(error => {
                reject(error);
            });
        },
        // 数组对象的排序
        bubbleArray (array) {
            let temp = 0;
            for (var i = 0; i < array.length - 1; i++) {
                for (var k = 0; k < array.length - 1 - i; k++) {
                    // 根据工序的id进行排序
                    if (array[k].processId > array[k + 1].processId) {
                        temp = array[k];
                        array[k] = array[k + 1];
                        array[k + 1] = temp;
                    }
                }
            }
            return array;
        },
        processCarouselPage () {
            let processArrays = [];
            let colorArray = ['#2d8cf0', '#5cb85c', '#ff9900', '#9a66e4'];
            processArrays = this.processContain;
            let result = new Array();
            let colorNum = 0;
            for (var i = 0; i < processArrays.length; i += 4) {
                colorNum = 0;
                var carouselItem = new Array();
                for (var j = 0; j < 4; j++) {
                    if ((i + j) >= processArrays.length) {
                        continue;
                    };
                    // 添加颜色
                    processArrays[i + j].circleColor = colorArray[colorNum];
                    // 计算百分比
                    processArrays[i + j].percentage = this.divisionKeepTwoDecPer(processArrays[i + j].openCount, processArrays[i + j].machineCount);
                    colorNum++;
                    carouselItem.push(processArrays[i + j]);
                }
                result.push({carouselItem});
            }
            return result;
        },
        inlineCarouselPage (arr) {
            // let circleIcon = ['../../images/blue.png','../../images/green.png','../../images/orange.png','../../images/red.png','../../images/pink.png','../../images/violet.png'];
            let circleIcon = ['#2d8cf0', '#19be6b', '#ff9900', '#ed3f14', '#ea8cca', '#9a66e4'];
            let circleIconNum = 0;
            let result = new Array();
            for (var i = 0; i < arr.length; i += 6) {
                circleIconNum = 0;
                var carouselItem = new Array();
                for (var j = 0; j < 6; j++) {
                    if ((i + j) >= arr.length) {
                        continue;
                    };
                    arr[i + j].planOutputText = '排产:';
                    arr[i + j].iconUrl = circleIcon[circleIconNum];
                    circleIconNum++;
                    carouselItem.push(arr[i + j]);
                };
                result.push({carouselItem});
            }
            return result;
        },
        getProcessTypeHttp () {
            this.$fetch(api.getPostProType()).then(res => {
                if (res.data.status === 200) {
                    this.allProcessList = res.data.res;
                    this.processContain.forEach((processIdObj) => {
                        this.allProcessList.forEach((processItems) => {
                            if (processIdObj.processId === processItems.id) {
                                this.$set(processIdObj, 'processName', processItems.name);
                            };
                        });
                    });
                };
            });
        },
        getLoginMsgHttp (resolve, reject) {
            return this.$fetch(api.getLoginMsg()).then(res => {
                if (res.data.status === 200) {
                    resolve(res);
                    this.loginName = res.data.res.name;
                    this.loginTitle = res.data.res.postName;
                    this.lastLoginTime = res.data.res.loginTime;
                };
            });
        },
        getProcessOpenHttp (resolve, reject) {
            return this.$fetch(api.getProcessOpenMachine()).then(res => {
                if (res.data.status === 200) {
                    resolve(res);
                    this.processContain = res.data.res;
                    this.processArray = this.processCarouselPage(this.processContain);
                };
            });
        },
        getUnAuditReportHttp (resolve, reject) {
            return this.$call('prd.report.list', { 'auditState': 2 }).then((res) => {
                if (res.data.status === 200) {
                    resolve(res);
                    this.reportSheetData = res.data.res;
                };
            });
        },
        getOnlineProHttp (resolve, reject) {
            return this.$fetch(api.getOnlinePro()).then(res => {
                if (res.data.status === 200) {
                    resolve(res);
                    this.openMachineData = res.data.res;
                    this.openMachineData = this.inlineCarouselPage(this.openMachineData);
                };
            });
        },
        getShortCutList (resolve, reject) {
            return this.$call('shortcut.entry.user.list').then(res => {
                if (res.data.status === 200) {
                    this.shortCutList = res.data.res;
                    this.shortCutList.forEach((item, index) => {
                        switch (index) {
                            case 0: item.iconFontColor = '#2D8CF0';
                                break;
                            case 1: item.iconFontColor = '#19BE6B';
                                break;
                            case 2: item.iconFontColor = '#FF9900';
                                break;
                            case 3: item.iconFontColor = '#ED3F14';
                                break;
                            case 4: item.iconFontColor = '#E46CBB';
                                break;
                            case 5: item.iconFontColor = '#9A66E4';
                                break;
                            case 6: item.iconFontColor = '#04B2BD';
                                break;
                            case 7: item.iconFontColor = '#71B50F';
                                break;
                        };
                    });
                    if (resolve) resolve(res);
                };
            });
        },
        getDependentDataHttp () {
            this.globalLoadingShow = true;
            let orderList = new Promise((resolve, reject) => this.getUnAuditedOrderHttp(resolve, reject)); // 未审核的订单
            // let onlineProductList = new Promise((resolve, reject) => this.getOnlineProHttp(resolve, reject)); // 在线产品
            let specSheetList = new Promise((resolve, reject) => this.getSpecListHttp(resolve, reject)); // 未审核的工艺单
            let noticeList = new Promise((resolve, reject) => this.getNoticeHttp(resolve, reject)); // 未审核的通知单
            let userMessage = new Promise((resolve, reject) => this.getLoginMsgHttp(resolve, reject)); // 获取登录人信息
            let processMachine = new Promise((resolve, reject) => this.getProcessOpenHttp(resolve, reject)); // 工序下开台的机台
            let shortCutList = new Promise((resolve, reject) => this.getShortCutList(resolve, reject)); // 快捷列表数据
            let unAuditReport = new Promise((resolve, reject) => this.getUnAuditReportHttp(resolve, reject)); // 未审核的报工单列表数据
            Promise.all([userMessage, processMachine, orderList, specSheetList, noticeList, shortCutList, unAuditReport]).then(res => {
                this.globalLoadingShow = false;
            });
        }
    },
    created () {
        this.getDependentDataHttp();
    }
};
</script>
<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
    .add-shortcut{
        color: #2D8CF0;
        font-weight: 100;
    }
</style>
