<template>
    <div>
        <Spin fix class="spin-bar">
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </div>
</template>
<style>
    .spin-bar{
        position: fixed;
        top: 0;
        z-index: 999;
        background: rgba(252,251,251,1);
        width: 100%;
        height: 100%;
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg); }
        50%  { transform: rotate(180deg); }
        to   { transform: rotate(360deg); }
    }
</style>

