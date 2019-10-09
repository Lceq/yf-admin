<template>
    <div>
        <Card>
            <Row>
                <Col>
                    <div class="flex-container1">
                        <div class="flex-item">flex item 1</div>
                        <div class="flex-item">flex item 2</div>
                        <div class="flex-item">flex item 3</div>
                    </div>
                    <div class="flex-container2">
                        <div class="flex-item">flex item 1</div>
                        <div class="flex-item">flex item 2</div>
                        <div class="flex-item">flex item 3</div>
                    </div>
                    <div class="flex-container3">
                        <div class="flex-item">flex item 1</div>
                        <div class="flex-item">flex item 2</div>
                        <div class="flex-item">flex item 3</div>
                    </div>
                    <div class="flex-container4">
                        <div class="flex-item4">flex item 1</div>
                        <div class="flex-item4">flex item 2</div>
                        <div class="flex-item4">flex item 3</div>
                    </div>
                    <div class="flex-container5">
                        <div class="flex-item">flex item 1</div>
                        <div class="flex-item">flex item 2</div>
                        <div class="flex-item">flex item 3</div>
                    </div>
                    <!--align-content 属性用于修改 flex-wrap 属性的行为。类似于 align-items, 但它不是设置弹性子元素的对齐，而是设置各个行的对齐。-->
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
export default {
    name: 'flex'
};
</script>

<style scoped>
/*body {*/
    /*!*direction: rtl;*!   // rtl = right to left */
/*}*/
.flex-container1 {
    display: -webkit-flex;
    display: flex;
    background-color: lightgrey;
}
.flex-container2 {
    display: -webkit-flex;
    display: flex;
    /*row 左对齐| row-reverse 右对齐 | column 纵向对齐 | column-reverse 反转纵向对齐*/
    -webkit-flex-direction: row-reverse;
    flex-direction: row-reverse;
    background-color: lightgrey;
}
.flex-container3{
    display: -webkit-flex;
    display: flex;
    /*flex-start 向行头紧挨着填充| flex-end 向行尾紧挨着填充 | center 弹性项目居中紧挨着填充。（如果剩余的自由空间是负的，则弹性项目将在两个方向上同时溢出）
    | space-between | space-around*/
    -webkit-justify-content: space-around;
    justify-content: space-around;
    background-color: lightgrey;
}
.flex-container4{
    display: -webkit-flex;
    display: flex;
    /*align-items: flex-start 紧靠住该行的侧轴起始边界 | flex-end 靠住该行的侧轴结束边界 | center 该行的侧轴（纵轴）上居中放置
    | baseline 如弹性盒子元素的行内轴与侧轴为同一条，则该值与'flex-start'等效。其它情况下，该值将参与基线对齐 | stretch 指定侧轴大小的属性值为'auto'*/
    -webkit-align-items: stretch;
    align-items: stretch;
    /*width: 400px;*/
    height: 250px;
    background-color: lightgrey;
}
.flex-container5{
    display: -webkit-flex;
    display: flex;
    /*flex-wrap: nowrap 弹性容器为单行 |wrap 弹性容器为多行 |wrap-reverse 反转 wrap 排列 |initial|inherit;*/
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    /*width: 300px;*/
    /*height: 250px;*/
    background-color: lightgrey;
}
.flex-item4 {
    background-color: cornflowerblue;
    width: 100px;
    /*height: 100px;*/
    margin: 10px;
}
.flex-item {
    background-color: cornflowerblue;
    width: 100px;
    height: 100px;
    margin: 10px;
}
</style>
