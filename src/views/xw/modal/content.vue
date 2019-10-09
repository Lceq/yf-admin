<template>
    <Button @click="openModal">弹出模态框</Button>
</template>
<script>
    import add from './add';
    export default {
        data () {
            return {
                v1: '',
                v2: ''
            };
        },
        components: {
            add
        },
        methods: {
            openModal: function () {
                this.$Modal.confirm({
                    scrollable: true,
                    okText: '保存',
                    render: (h) => {
                        return h(add, {
                            props: {

                            },
                            on: {
                                value1: (value1) => {
                                    this.v1 = value1;
                                },
                                value2: (value2) => {
                                    this.v2 = value2;
                                }
                            }
                        });
                    },
                    onOk: () => {
                        if (this.v1 == '' || this.v2 == '') {
                            this.$Message.error('信息填写不完整!');
                        }
                        const msg = this.$Message.loading({
                            content: '正在保存..',
                            duration: 0
                        });
                        // this.saveLink(msg)
                    }
                });
            }
        }
    };
</script>
