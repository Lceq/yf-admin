<template>
    <Card id="screen" :style="'height:' + cardHeight + 'px'">
       <div class="flex-left">
           <div @click="handleProcess(item)" v-for="item of processList" class="process-bar">
               <p> {{ item.name }} </p>
           </div>
       </div>
    </Card>
</template>

<script>
export default {
    name: 'process-main',
    data () {
        return {
            cardHeight: '',
            processList: []
        };
    },
    methods: {
        getProcess () {
            let params = {
                auditState: 3,
                state: 1
            };
            this.$call('process.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processList = content.res;
                }
            });
        },
        handleProcess (item) {
            if (item.id === 23 || item.id === 24) {
                this.$router.push({
                    path: 'tv-process-xs',
                    query: {
                        id: item.id,
                        name: item.name
                    }
                });
            } else {
                this.$router.push({
                    path: 'tv-process',
                    query: {
                        id: item.id,
                        name: item.name
                    }
                });
            }
        }
    },
    mounted () {
        this.getProcess();
        this.$nextTick(() => {
            this.cardHeight = window.screen.height;
        });
    }
};
</script>

<style scoped>
#screen{
    font-size: 34px;
    line-height: 56px;
    color: #FFF;
    background-color: #22272d;
}
.process-bar{
    border: 1px solid #5B657E;
    padding: 10px 20px;
    margin-right: 10px;
}
</style>