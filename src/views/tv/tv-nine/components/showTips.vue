<template>
  <div
    v-show="showTips"
    ref="series"
    style="width: 100%; height: 100%;display: inline-block;"
  ></div>
</template>
<script> 
export default {
  name: 'showTips',
  data () {
    showTips;
  }
}
</script>