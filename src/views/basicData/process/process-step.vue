<template>
  <div>
      <div class="w-process" v-for="(item, index) of processCombinateData" :key="index" :class="index ===  (processCombinateData.length - 1) ? 'w-process-before' : (index === 0 ? 'w-process-after': 'w-process-before w-process-after')">
          <div class="w-process-step">
              <span class="w-process-step-index">{{ index + 1}}</span>
              <span>{{ item.processName }}</span>
          </div>
      </div>
  </div>
</template>
<script>
export default {
    name: 'process-step',
    props: {
        processCombinateData: {
            type: Array
        }
    }
};
</script>

<style scoped>
.w-process{
    background-color: #999;
    display: inline-block;
    /*padding: 0px 6px;*/
    height: 24px;
    width: 86px;
    color: #fff;
    line-height: 24px;
    /*padding-right: 20px;*/
    /*border: 1px solid #4a5161;*/
    margin: 5px 8px;
    position: relative;
}
.w-process-step{
    padding: 0px 0px 0px 20px;
}

.w-process-step-index{
    vertical-align: middle;
    display: inline-block;
    /*height: 18px;*/
    /*width: 18px;*/
    /*line-height: 10px;*/
    /*border-radius: 50%;*/
    /*padding: 4px;*/
    margin-right: 10px;
    /*border: 1px solid #fff;*/
}
.w-process-after:after{
    display:block;
    content:'';
    border-width:12px 12px 12px 12px;
    border-style:solid;
    border-color:transparent transparent transparent #999;
    /* 定位 */
    position:absolute;
    left:100%;
    top: 0;
    }
.w-process-before:before{
    display:block;
    content:'';
    border-width:12px 12px 12px 12px;
    border-style:solid;
    border-color:transparent transparent transparent #fff;
    /* 定位 */
    position:absolute;
    left: 0;
    top: 0;
}
</style>
