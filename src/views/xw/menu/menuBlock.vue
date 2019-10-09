<template>
  <div>
     <Card>
         <Row>
             <Col>
                 <p>This Is MenuBlock Page</p>
                 <transition-group>
                     <router-view key="default"></router-view>
                     <router-view key="menu" name="menu"></router-view>
                     <router-view key="menuFloat" name="menuFloat"></router-view>
                 </transition-group>
             </Col>
         </Row>
     </Card>
  </div>
</template>

<script>
export default {
    name: 'menuBlock'
};
</script>

<style scoped>

</style>
