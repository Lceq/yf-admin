<template>
  <div style="position: relative">
      <div class="img-bar">
          <img :style="'width:' + width + 'px;height:' + height + 'px;'" class="" src="../../../../images/tv-three.jpg"  alt="正凯" />
          <div class="process-bar">
              <p v-for="(item, index) of environmentAreaList" :class="'bar' + (index + 1)" >
                  <Icon v-show="value" :color="(item.humNormal && item.temNormal) ? '#2DCC70' : 'rgb(237, 64, 20)'" type="ios-radio-button-on" /><br>{{ item.code }}<br><span :style="'color:' + (item.temNormal ? '#2DCC70' : 'rgb(237, 64, 20)')">{{ item.actualTemperature }}℃</span> <br> <span :style="'color:' + (item.humNormal ? '#2DCC70' : 'rgb(237, 64, 20)')">{{ item.actualHumidity }}%</span></p>
              <!--<p class="bar2"><Icon v-show="value" color="#2DCC70" type="ios-radio-button-on" /><br>TH02 <br>30℃ <br> 62%</p>-->
              <!--<p class="bar3"><Icon v-show="value" color="2DCC70" type="ios-radio-button-on" /><br>TH03 <br>30℃ <br> 62%</p>-->
              <!--<p class="bar4"><Icon v-show="value" color="2DCC70" type="ios-radio-button-on" /><br>TH04 <br>30℃ <br> 62%</p>-->
              <!--<p class="bar5"><Icon v-show="value" color="2DCC70" type="ios-radio-button-on" /><br>TH05 <br>30℃ <br> 62%</p>-->
              <!--<p class="bar6"><Icon v-show="value" color="2DCC70" type="ios-radio-button-on" /><br>TH06 <br>31℃ <br> 64%</p>-->
              <!--<p class="bar7"><Icon v-show="value" color="2DCC70" type="ios-radio-button-on" /><br>TH07 <br>31℃ <br> 64%</p>-->
              <!--<p class="bar8"><Icon v-show="value" color="2DCC70" type="ios-radio-button-on" /><br>TH08 <br>31℃ <br> 64%</p>-->
              <!--<p class="bar9"><Icon v-show="value" color="2DCC70" type="ios-radio-button-on" /><br>TH09 <br>31℃ <br> 64%</p>-->
              <!--<p class="bar10"><Icon v-show="value" color="2DCC70" type="ios-radio-button-on" /><br>TH10 <br>32℃ <br> 58%</p>-->
              <!--<p class="bar11"><Icon v-show="value" color="2DCC70" type="ios-radio-button-on" /><br>TH11 <br>32℃ <br> 58%</p>-->
              <!--<p class="bar12"><Icon v-show="value" color="2DCC70" type="ios-radio-button-on" /><br>TH12 <br>32℃ <br> 58%</p>-->
              <!--<p class="bar13"><Icon v-show="value" color="2DCC70" type="ios-radio-button-on" /><br>TH13 <br>32℃ <br> 58%</p>-->
              <!--<p class="bar14"><Icon v-show="value" color="2DCC70" type="ios-radio-button-on" /><br>TH14 <br>31℃ <br> 65%</p>-->
              <!--<p class="bar15"><Icon v-show="value" color="2DCC70" type="ios-radio-button-on" /><br>TH15 <br>31℃ <br> 65%</p>-->
              <!--<p class="bar16"><Icon v-show="value" color="2DCC70" type="ios-radio-button-on" /><br>TH16 <br>31℃ <br> 65%</p>-->
          </div>
      </div>
  </div>
</template>
<script>
export default {
    name: 'tv-envir',
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
            value: false,
            environmentAreaList: []
        };
    },
    methods: {
        getEnvironment () {
            this.$call('large.screen.environmentArea', {workshopId: this.workshopId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.environmentAreaList = content.res;
                }
            });
        }
    },
    watch: {
        workshopId (newData, oldData) {
            this.getEnvironment();
            setInterval(() => {
                this.getEnvironment();
            }, 30000);
        }
    },
    mounted () {
        setInterval(() => {
            this.value = !this.value;
        }, 1000);
    }
};
</script>

<style scoped>
.img-bar{
    position: absolute;
    left: 0;
    top: 0;
}
.process-bar{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    color: #2DCC70;
}
.bar1{
    position: relative;
    left: 74px;
    top: 83px;
}
.bar2{
    position: absolute;
    left: 74px;
    top: 248px;
}
.bar3{
    position: absolute;
    left: 146px;
    top: 81px;
}
.bar4{
    position: absolute;
    left: 122px;
    top: 247px;
}
.bar5{
    position: absolute;
    left: 194px;
    top: 253px;
}
.bar6{
    position: absolute;
    left: 218px;
    top: 123px;
}
.bar7{
    position: absolute;
    left: 218px;
    top: 192px;
}
.bar8{
    position: absolute;
    left: 290px;
    top: 81px;
}
.bar9{
    position: absolute;
    left: 290px;
    top: 247px;
}
.bar10{
    position: absolute;
    left: 363px;
    top: 80px;
}
.bar11{
    position: absolute;
    left: 363px;
    top: 247px;
}
.bar12{
    position: absolute;
    left: 435px;
    top: 80px
}
.bar13{
    position: absolute;
    left: 435px;
    top: 247px;
}
.bar14{
    position: absolute;
    left: 531px;
    top: 194px;
}
.bar15{
    position: absolute;
    left: 506px;
    top: 248px;
}
.bar16{
    position: absolute;
    left: 507px;
    top: 136px;
}
</style>
