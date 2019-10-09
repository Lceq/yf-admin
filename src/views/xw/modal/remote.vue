<template>
    <div>
        <Row>
            <Col span="12" style="padding-right:10px">
                <Select
                        v-model="model13"
                        filterable
                        remote
                        :remote-method="remoteMethod1"
                        :loading="loading1">
                    <Option v-for="(option, index) in options1" :value="option.value" :key="index">{{option.value}}</Option>
                </Select>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                model13: 'Arkansas (C0004)',
                loading1: false,
                options1: [],
                model14: [],
                loading2: false,
                options2: [],
                list: [
                    {
                        code: 'C0001',
                        name: 'Alabama'
                    },
                    {
                        code: 'C0002',
                        name: 'Alaska'
                    },
                    {
                        code: 'C0003',
                        name: 'Arizona'
                    },
                    {
                        code: 'C0004',
                        name: 'Arkansas'
                    }
                ]
                // list: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New hampshire', 'New jersey', 'New mexico', 'New york', 'North carolina', 'North dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode island', 'South carolina', 'South dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West virginia', 'Wisconsin', 'Wyoming']
            };
        },
        methods: {
            remoteMethod1 (query) {
                if (query !== '') {
                    this.loading1 = true;
                    setTimeout(() => {
                        this.loading1 = false;
                        const list = this.list.map(item => {
                            return {
                                value: item.name + ' (' + item.code + ')',
                                label: item.code
                            };
                        });
                        this.options1 = list.filter(item => item.value.toLowerCase().indexOf(query.toLowerCase()) > -1);
                    }, 200);
                } else {
                    this.options1 = [];
                }
            }
        }
    };
</script>
