<template>
    <div>
        <Card>
            <Row>
                <Col class="marginBottom" id="selectedHeight">
                    <Row class="flexBetween">
                        <Col class="leftFlex">
                            <Button type="success" @click="newAddClick">新增</Button>
                        </Col>
                        <Col>
                            <Input class="formWidth" v-model="urlName" placeholder="请输入条件搜索"></Input>
                            <Button @click="searchResult" class="verticalMiddle" type="primary">搜索</Button>
                        </Col>
                    </Row>
                </Col>
                <Col class="marginBottom">
                    <Table @on-selection-change="selectService" :columns="serviceColumns" :height="tableHeight" :data="serviceData" border size="small"></Table>
                </Col>
                <Col>
                    <Page class="textRight" :total="serviceTotal" show-elevator :page-size-opts="servicePageOpts" show-total :page-size="servicePageSize" @on-change="changePageIndexService" show-sizer @on-page-size-change="changePageSizeService"></Page>
                </Col>
            </Row>
        </Card>
        <modal
            :isShow="serviceShow"
            :title="serviceTitle"
            @cancel="serviceCancel"
            @submit="serviceSubmit('serviceValidate')"
        >
            <div slot="content">
                <Form :label-width="80" ref="serviceValidate" :model="serviceValidate" :rules="serviceValidateRules" :show-message="false">
                    <Row>
                        <Col>
                            <FormItem label="配置名称：" class="formItemMargin" prop="name">
                                <Input v-model="serviceValidate.name" placeholder="请输入配置名称"></Input>
                            </FormItem>
                            <FormItem label="url地址：" class="formItemMargin" prop="url">
                                <Input v-model="serviceValidate.url" placeholder="请输入url地址"></Input>
                            </FormItem>
                            <FormItem label="类别：" class="formItemMargin" prop="category">
                                <Input v-model="serviceValidate.category" placeholder="请输入类别"></Input>
                            </FormItem>
                            <FormItem label="服务地址：" class="formItemMargin" prop="serviceHost">
                                <Select v-model="serviceHostId" placeholder="请选择url地址...">
                                    <Option v-for="item in serviceHostList" :value="item.id" :key="item.id">{{ item.host }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="备注：" class="formItemMargin" prop="remark">
                                <Input :row="2" type="textarea" v-model="serviceValidate.remark" placeholder="请输入备注"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        </modal>
    </div>
</template>

<script>
import modal from '../../public/modal';
import {page} from '../../../libs/tools';
import clip from '@/libs/clipboard';
import xwValidate from '@/libs/xwValidate';
export default {
    components: {
        modal
    },
    data () {
        return {
            serviceColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '名称',
                    key: 'name',
                    align: 'center',
                    render: (h, params) => {
                        return h('a', {
                            attrs: {
                                id: 'name' + params.index
                            },
                            on: {
                                'click': () => {
                                    clip(params.row.name, event);
                                    // document.execCommand('name' + params.index);
                                }
                            }
                        }, params.row.name);
                    }
                },
                {
                    title: 'url地址',
                    key: 'url',
                    align: 'center',
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    this.edit = true;
                                    this.curServiceId = params.row.id;
                                    this.getServiceDetail();
                                }
                            }
                        }, params.row.url);
                    }
                },
                {
                    title: '类别',
                    key: 'category',
                    align: 'left'
                },
                {
                    title: 'host',
                    key: 'serviceHost',
                    align: 'right'
                },
                {
                    title: '备注',
                    key: 'remark',
                    align: 'left'
                }
            ],
            serviceData: [],
            serviceHostList: [],
            serviceHostId: '',
            edit: false,
            curServiceId: '',
            tableHeight: '',
            serviceShow: false,
            serviceTitle: '服务设置',
            serviceValidate: {
                url: '',
                name: ''
            },
            serviceValidateRules: {
                url: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ]
            },
            selectServiceIds: [],
            isDelete: true,
            urlName: '',
            serviceTotal: 0,
            servicePageIndex: 1,
            servicePageOpts: page().pageOpts,
            servicePageSize: page().pageSize
        };
    },
    methods: {
        getServiceDetail () {
            const _this = this;
            this.$api.service.getServiceDetail({id: this.curServiceId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.serviceValidate.name = content.res.name;
                    _this.serviceValidate.url = content.res.url;
                    _this.serviceValidate.category = content.res.category;
                    _this.serviceHostId = content.res.serviceHostId;
                    _this.serviceValidate.remark = content.res.remark;
                    this.serviceShow = true;
                }
            });
        },
        // getServiceList () {
        //     const _this = this;
        //     this.$api.service.getServiceList().then(res => {
        //         let content = res.data;
        //         if (content.status === 200) {
        //             _this.serviceData = content.res;
        //             _this.selectServiceIds = [];
        //             this.isDelete = true;
        //         }
        //     });
        // },
        getServiceHostList () {
            this.$api.service.getServiceHostList().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.serviceHostList = content.res;
                    this.serviceHostId = content.res[0].id;
                    this.getServiceList();
                }
            });
        },
        newAddClick () {
            this.edit = false;
            this.serviceValidate.name = '';
            this.serviceValidate.url = '';
            this.serviceValidate.category = '';
            this.serviceValidate.remark = '';
            this.serviceShow = true;
        },
        serviceCancel () {
            this.serviceShow = false;
        },
        serviceSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.edit ? this.curServiceId : null,
                        name: this.serviceValidate.name,
                        url: this.serviceValidate.url,
                        category: this.serviceValidate.category,
                        serviceHostId: this.serviceHostId,
                        remark: this.serviceValidate.remark
                    };
                    this.$api.service.getServiceSave(params).then(res => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.getServiceHostList();
                            this.$Message.success('保存成功！');
                        }
                    });
                    this.serviceShow = false;
                } else {
                    xwValidate.message();
                }
            });
        },
        selectService (val) {
            if (val.length) this.isDelete = false;
            else this.isDelete = true;
            this.selectServiceIds = val.map(x => x.id);
        },
        deleteClick () {
            this.$api.service.getServiceDelete(this.selectServiceIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getServiceHostList();
                    this.$Message.success('删除成功！');
                }
            });
        },
        getServiceList () {
            let params = {
                pageIndex: this.servicePageIndex,
                pageSize: this.servicePageSize,
                urlName: this.urlName
            };
            this.$call('service.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.serviceTotal = content.count;
                    this.serviceData = content.res;
                    this.selectServiceIds = [];
                    this.isDelete = true;
                }
            });
        },
        changePageIndexService (val) {
            this.servicePageIndex = val;
            this.getServiceList();
        },
        changePageSizeService (val) {
            this.servicePageIndex = val;
            this.getServiceList();
        },
        searchResult () {
            this.getServiceList();
        }
    },
    mounted () {
        this.getServiceHostList();
        // this.getServiceHost();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 210;
        });
        window.onresize = () => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 210;
            }
        };
    }
};
</script>

<style scoped>

</style>
