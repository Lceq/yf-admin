<template>
    <div class="user-message">
        <p class="user-message-item">
            <span>{{ title }}人：</span>
            <span>{{ userName }}</span>
        </p>
        <p>
            <span>{{ title }}日期：</span>
            <span>{{ userTime }}</span>
        </p>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String
        },
        userName: {
            type: String
        },
        userTime: {
            type: String
        }
    }
};
</script>

<style scoped>
.user-message{
    color: #b3b2b2;
    display: flex;
    justify-content: flex-start;
}
.user-message-item{
    width: 130px;
    /*display: inline-block;*/
}
</style>
