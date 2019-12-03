<template>
  <div
    id="tv"
    :style="
      'width: ' + width + 'px; height: ' + height + 'px;display: inline-block;'
    "
  >
    <div class="parentFlexBetween  verticalMiddle">
      <div class="verticalMiddle">
        <img
          style="height:30px;position: relative;"
          class="verticalMiddle"
          src="../../../images/zg.png"
          alt="正凯"
        />
        <Select
          v-model="workshopId"
          class="selectBackground verticalMiddle"
          style="width: 100px; "
          placeholder="请选择车间"
        >
          <Option
            v-for="(item, index) in workshopList"
            :value="item.deptId"
            :key="item.deptId"
            >{{ item.deptName }}</Option
          >
        </Select>
        <Button
          class=""
          type="primary"
          shape="circle"
          size="small"
          @click="expandCharts"
          :icon="!value ? 'ios-expand' : 'ios-exit'"
        ></Button>
      </div>
      <span class="verticalMiddle">{{ month }}月</span>
      <span class="margin-right-20 verticalMiddle">
        <span style="color: #0acddf">当前时间</span>：<span class="color">{{
          time
        }}</span></span
      >
    </div>
    <div
      v-show="showTips"
      ref="series"
      style="width: 100%; height: 100%;display: inline-block;"
    ></div>
    <div
      v-show="!showTips"
      :style="'line-height: ' + height + 'px;text-align: center;'"
    >
      暂无数据
    </div>
  </div>
</template>
<script>
import echarts from 'echarts';
import { curDatetime, curDate } from '../../../libs/tools';
export default {
  name: 'renove',
  data () {
    return {
      month: '',
      // width: 400,
      // height: 400,
      time: curDatetime(),
      // workshopId: '',
      // workshopList: [],
      orderList: [],
      showTips: true //显示
      // value: false

    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    workshopId: {
      type: Number
    },
    workshopList: {
      type: Array
    }
  },
  methods: {
    expandCharts () {
      this.$emit('expandCharts', this.value);
    },
    orderDetail () {
      let date = this.time.split('-')[0] + '-' + this.time.split('-')[1];
      this.$call('large.screen.dayProgressChart', { workshopId: this.workshopId, 'date': date }).then(res => {
        let content = res.data;
        if (content.status === 200) {
          this.orderList = content.res;
          //   this.orderList = []
          //   console.log(this.orderList);
          if (this.orderList.length === 0) {
            this.showTips = false
          }
          this.drawLineEN();
        }
      });
    },
    getData (val) {
      let data = [];
      val.map(x => {
        data.push(x.split('-')[2]);
      });
      return data;
    },
    drawLineEN () {
      let myChart = echarts.init(this.$refs.series);
      // 绘制图表
      let option = {
        // title: {
        //     // text: '未来一周气温变化',
        //     // subtext: '纯属虚构'
        // },
        tooltip: {
          trigger: 'axis'
          // formatter: function (params) {
          //     for (var i = 0; i < option.series[0].data.length; i++) {
          //         debugger
          //         if (option.series[0].data[i].name === params.data.name && option.series[0].data[i].id === params.data.id) {
          //             let obj = '';
          //             for (var j = 0; j < params.data.typeNumList.length; j++) {
          //                 obj = obj + (j > 0 ? '<br/>' : '') + params.data.typeNumList[j].name + ': ' + params.data.typeNumList[j].count;
          //             }
          //             return obj;
          //         }
          //     }
          // }
        },
        color: ['#F2622D', '#2DCC70', '#EFC51B'],
        legend: {
          data: ['日产量', '日折标产量', '日计划量'],
          textStyle: {
            color: '#fff'
          }
        },
        toolbox: {
          show: true
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.getData(this.orderList.map(x => x.date)),
            axisLabel: {
              textStyle: {
                color: '#fff'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: '#fff'
              }
            }
          }
        ],
        series: [
          {
            name: '日产量',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#F2622D'
                }
              }
            },
            data: this.orderList.map(x => x.outputActual)
          },
          {
            name: '日折标产量',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#2DCC70'
                }
              }
            },
            data: this.orderList.map(x => x.outputDiscount)
          },
          {
            name: '日计划量',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: '#EFC51B'
                }
              }
            },
            data: this.orderList.map(x => x.outputGoal)
          }
        ]
      };
      myChart.setOption(option);
    }
  },
  watch: {
    workshopId (newData, oldData) {
      this.orderDetail();
      setInterval(() => {
        this.orderDetail();
      }, 1800000);
    }
  },
  created () {
    this.month = curDate().split('-')[1];
  },
  mounted () {
    // this.width = window.screen.width - 100;
    // this.height = window.screen.height - 130;
    setInterval(() => {
      this.time = curDatetime();
    }, 1000);
    // this.expandCharts();
    // this.getUserWorkshop();
  }
};
</script>

<style scoped>
#tv {
  background-color: #22272d;
  font-size: 12px;
  line-height: 24px;
  color: #fff;
}
.verticalMiddle {
  vertical-align: middle;
}
</style>
