<template>
    <div>
        <Card>
            <Row>
                <Col>
                    <Table border ref="selection" :data="data" :columns="columns"></Table>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            data: [
                {
                    name: '1',
                    ban: false
                },
                {
                    name: '2',
                    ban: false
                },
                {
                    name: '3',
                    ban: false
                },
                {
                    name: '4',
                    ban: false
                }
            ],
            columns: [
                {
                    title: 'ban',
                    width: 60,
                    render: (h, params) => {
                        return h('Checkbox', {
                            props: {
                                value: params.row.ban
                            },
                            on: {
                                'on-change': (val) => {
                                    this.data.map(x => {
                                        x.ban = false;
                                        return x;
                                    });
                                    this.data[params.index].ban = true;
                                }
                            }
                        });
                    }
                },
                {
                    title: 'name',
                    key: 'name'
                }
            ]
        };
    },
    methods: {
    },
    created () {
    }
};
</script>

<style scoped>

</style>
