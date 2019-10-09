<template>
    <div>
       <div style="width: 100%;">
           <div>
               <Tabs value="name1">
                   <TabPane v-for="(item, index) of iconData" :key="index" :label="item.label" style="margin-top: -10px" :name="item.name">
                       <div style="height:250px;overflow:auto">
                           <div v-for = "(i, index) of item.data" :key="index" @click = "changeValue(i)" data-v-394040b0 = "" class="iconStyle icons-item">
                               <Icon :type="i" style = "font-size: 32px;" />
                           </div>
                       </div>
                   </TabPane>
               </Tabs>
           </div>
       </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            iconData: [
                {
                    name: 'name1',
                    label: '基础图标',
                    data: ['ios-home', 'md-home', 'md-hand', 'md-settings', 'ios-stats', 'ios-list-box', 'ios-document', 'ios-construct', 'ios-card', 'ios-calculator', 'ios-paper', 'ios-book', 'md-school', 'md-person', 'md-apps', 'md-attach', 'md-ribbon', 'md-people', 'md-cog', 'md-body', 'md-construct', 'search', 'ios-toggle', 'ios-analytics', 'ios-pie', 'search', 'flag', 'umbrella', 'gear-b', 'settings', 'pie-graph', 'pricetag', 'pricetags', 'aperture', 'ios-pricetag', 'ios-pricetags', 'android-cloud-done', 'android-cloud-circle', 'ios-bookmarks', 'ios-book', 'wrench', 'hammer']
                },
                {
                    name: 'name2',
                    label: '人员',
                    data: ['person', 'person-add', 'person-stalker', 'android-contact', 'android-contacts', 'ribbon-a', 'ribbon-b', 'university', 'earth']
                },
                {
                    name: 'name3',
                    label: '设备',
                    data: ['ios-printer', 'ios-game-controller-a', 'ios-game-controller-b', 'ios-americanfootball', 'ios-folder', 'ios-paper', 'ios-list', 'printer', 'outlet', 'document-text', 'clipboard', 'paintbucket', 'ios-navigate', 'ios-briefcase', 'ios-medkit', 'ios-medical']
                },
                {
                    name: 'name4',
                    label: '其它',
                    data: ['ios-locked', 'ios-unlocked', 'ios-monitor', 'ios-baseball', 'ios-basketball', 'ios-tennisball', 'android-call', 'android-apps', 'android-settings', 'android-options', 'android-funnel', 'android-cloud-outline', 'android-cloud', 'android-download', 'android-upload', 'android-favorite', 'android-star-half', 'android-star', 'android-calendar', 'android-alarm-clock', 'android-time', 'android-stopwatch', 'android-watch', 'android-locate', 'android-navigate', 'android-pin', 'android-compass', 'android-map', 'android-car', 'android-bus', 'android-subway', 'android-train', 'android-boat', 'android-plane', 'android-restaurant', 'android-bar', 'android-cart', 'android-camera', 'android-image', 'android-film', 'android-color-palette', 'android-create', 'android-mail', 'android-drafts', 'android-send', 'android-archive', 'android-delete', 'android-bookmark', 'android-document', 'android-clipboard', 'android-list', 'android-folder-open', 'android-folder', 'android-print', 'android-globe', 'android-playstore', 'android-lock', 'android-unlock', 'android-microphone', 'android-notifications', 'android-notifications-off', 'android-alert', 'trash-b', 'funnel']
                }
            ]
        };
    },
    methods: {
        changeValue (value) {
            // console.log(value);
            this.$emit('value', value);
        }
    },
    computed: {
        classStyle: function (i) {
            return 'ivu-icon ivu-icon-' + i;
        }
    }
};
</script>

<style scoped>
    .iconStyle{
        width: 12.5%;
        display: inline-block;
        padding: 5px 0;
        border: 1px solid #ccc;
        border-left: none;
        border-top: none;
        text-align: center;
    }
    .iconStyle:nth-child(8n + 1){
        border-left: 1px solid #ccc;
    }
    .iconStyle:nth-child(-n + 8){
        border-top: 1px solid #ccc;
    }
    .iconStyle:first-child{
        border-left: 1px solid #ccc;
    }
    a{
        color: #495060;
    }
    a:hover, a:active{
        color: #b3d4fc;
    }
</style>
