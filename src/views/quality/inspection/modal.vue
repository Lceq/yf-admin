<template>
    <div>
        <modal
            title="停车通知"
            :isShow="show"
            @cancel="testCancel"
            @submit="testSave"
        >
            <div slot="content">
                <Input v-model="textArea" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写停车原因..." />
            </div>
        </modal>
    </div>
</template>

<script>
import modal from '../../public/modal';
export default {
    components: {
        modal
    },
    props: {
        qualityShow: {
            type: Boolean
        }
    },
    data () {
        return {
            textArea: '',
            show: false
        };
    },
    methods: {
        testSave () {
            this.$emit('onClick', this.textArea);
        },
        testCancel () {
            this.$emit('onCancel');
        }
    },
    watch: {
        qualityShow (newData, oldData) {
            this.show = newData;
            if (newData) {
                this.textArea = '';
            }
        }
    }
};
</script>

<style scoped>

</style>
