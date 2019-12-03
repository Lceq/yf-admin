<template>
  <div>
    <Carousel
      v-model="active"
      :autoplay="false"
      :radius-dot="false"
      arrow="never"
      dots="none"
    >
      <CarouselItem>
        <xw-table
          :title="title"
          :fontSize="fontSize"
          :numbers="numbers"
          :list="list"
          :turn="turn"
          @getTurn="getTurn"
          :top="top"
          :show="showTips"
        ></xw-table>
        <div v-show="!showTips" style="line-height: 300px;text-align:center;">
          暂无数据
        </div>
      </CarouselItem>
      <CarouselItem>
        <xw-table
          :title="titleTwo"
          :fontSize="fontSize"
          :numbers="numbers"
          :list="listTwo"
          :turn="turnTwo"
          @getTurn="getTurnTwo"
          :top="topTwo"
          :show="showTipsTwo"
        ></xw-table>
        <div
          v-show="!showTipsTwo"
          style="line-height: 300px;text-align:center;"
        >
          暂无数据
        </div>
      </CarouselItem>
      <CarouselItem>
        <xw-table
          :title="titleThree"
          :fontSize="fontSize"
          :numbers="numbers"
          :list="listThree"
          :turn="turnThree"
          @getTurn="getTurnThree"
          :top="topThree"
          :show="showTipsThree"
        ></xw-table>
        <div
          v-show="!showTipsThree"
          style="line-height: 300px;text-align:center;"
        >
          暂无数据
        </div>
      </CarouselItem>
    </Carousel>
  </div>
</template>
<script>
import xwTable from './xw-table';
export default {
  components: {
    xwTable
  },
  props: {
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    workshopId: {
      type: Number
    }
  },
  data () {
    return {
      active: 0,
      fontSize: 0,
      numbers: 9,
      list: [],
      title: [
        {
          title: '人员编号',
          key: 'userCode',
          span: 5,
          align: 'center'
        },
        {
          title: '人员姓名',
          key: 'userName',
          span: 5,
          align: 'left'
        },
        {
          title: '班组',
          span: 5,
          key: 'groupName',
          align: 'left'
        },
        {
          title: '是否缺勤',
          key: 'isAbsenteeism',
          span: 4,
          align: 'left',
          render: (h, params) => {
            return h('span', {}, params.row.isAbsenteeism === true ? '是' : '否');
          }
        },
        {
          title: '日期',
          key: 'date',
          span: 5,
          align: 'left'
        }
      ],
      top: 0,
      turn: false,
      stoptime: 8000,
      titleTwo: [
        {
          title: '工序',
          key: 'processName',
          span: 4,
          align: 'center'
        },
        {
          title: '机台号',
          key: 'machineName',
          span: 4,
          align: 'left'
        },
        {
          title: '故障原因',
          key: 'faultDescription',
          span: 4,
          align: 'center'
        },
        {
          title: '呼叫时间',
          key: 'callTime',
          span: 4,
          align: 'center'
        },
        {
          title: '接单时间',
          span: 4,
          key: 'receivingTime',
          align: 'left'
        },
        {
          title: '接单人',
          span: 4,
          key: 'receivingUserName',
          align: 'left'
        }
      ],
      listTwo: [],
      topTwo: 0,
      turnTwo: false,
      topThree: 0,
      turnThree: false,
      titleThree: [
        {
          title: '工序',
          key: 'processName',
          span: 4,
          align: 'center'
        },
        {
          title: '机台号',
          key: 'machineCode',
          span: 5,
          align: 'left'
        },
        {
          title: '异常电流',
          key: 'iValue',
          span: 5,
          align: 'right'
        },
        {
          title: '异常电压',
          key: 'uValue',
          span: 5,
          align: 'right'
        },
        {
          title: '异常功率因数',
          key: 'power',
          span: 5,
          align: 'right'
        }
      ],
      listThree: [],
      showTips: true,
      showTipsTwo: true,
      showTipsThree: true
    };
  },
  methods: {
    processShowMonitoring () {
      let params = {
        workshopId: this.workshopId
      };
      this.$call('large.screen.userAbnormity', params).then(res => {
        let content = res.data;
        if (content.status === 200) {
          this.list = content.res;
          //   this.list = []
          this.turn = true;
          this.active = 0;
          if (this.list.length === 0) {
            this.showTips = false
          }
        }
      });
    },
    earlyWarning () {
      let params = {
        workshopId: this.workshopId
      };
      this.$call('large.screen.earlyWarning', params).then(res => {
        let content = res.data;
        if (content.status === 200) {
          this.listTwo = content.res;
          //   this.listTwo = []
          if (this.listTwo.length === 0) {
            this.showTipsTwo = false
          }
          this.turnTwo = true;
          this.active = 1;
        }
      });
    },
    electricitiy () {
      let params = {
        workshopId: this.workshopId
      };
      this.$call('large.screen.electricitiy', params).then(res => {
        let content = res.data;
        if (content.status === 200) {
          this.listThree = content.res.map(x => {
            x.iValue = x.iValue ? x.iValue : '-';
            x.uValue = x.uValue ? x.uValue : '-';
            x.power = x.power ? x.power : '-';
            return x;
          });
          //   this.listThree = []
          if (this.listThree.length === 0) {
            this.showTipsThree = false
          }
          this.turnThree = true;
          this.active = 2;
        }
      });
    },
    getTurn (num, length, theight) {
      setTimeout(() => {
        this.getTime1(num, length, theight);
      }, this.stoptime);
    },
    getTime1 (num, length, theight) {
      this.$nextTick(() => {
        if (num >= length) {
          this.topTwo = 0;
          this.turnTwo = false;
          // this.active = 1;
          setTimeout(() => {
            this.earlyWarning();
          }, 1000);
        } else {
          this.top += -theight;
          num += 1;
          setTimeout(() => {
            this.getTime1(num, length, theight);
          }, this.stoptime);
        }
      });
    },
    getTurnTwo (num, length, theight) {
      setTimeout(() => {
        this.getTime2(num, length, theight);
      }, this.stoptime);
    },
    getTime2 (num, length, theight) {
      this.$nextTick(() => {
        if (num >= length) {
          this.topThree = 0;
          // this.active = 2;
          this.turnThree = false;
          setTimeout(() => {
            this.electricitiy();
          }, 1000);
        } else {
          this.topTwo += -theight;
          num += 1;
          setTimeout(() => {
            this.getTime2(num, length, theight);
          }, this.stoptime);
        }
      });
    },
    getTurnThree (num, length, theight) {
      setTimeout(() => {
        this.getTime3(num, length, theight);
      }, this.stoptime);
    },
    getTime3 (num, length, theight) {
      this.$nextTick(() => {
        if (num >= length) {
          this.top = 0;
          // this.active = 0;
          this.turn = false;
          setTimeout(() => {
            this.processShowMonitoring();
          }, 1000);
        } else {
          this.topThree += -theight;
          num += 1;
          setTimeout(() => {
            this.getTime3(num, length, theight);
          }, this.stoptime);
        }
      });
    }
  },
  watch: {
    workshopId (newData, oldData) {
      this.processShowMonitoring();
    }
  }
};
</script>
<style scoped>
</style>
