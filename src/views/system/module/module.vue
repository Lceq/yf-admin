<template>
<div>
    <Card>
        <Row>
            <Col span="4" style="padding-right: 20px;">
                <Card dis-hover>
                    <Tree :data="moduleTreeData" @on-select-change="handleTree"></Tree>
                </Card>
            </Col>
            <Col span="20">
                <Button icon="md-add" class="marginBottom" @click="addNewModule" type="primary">新增</Button>
                <Table :height="tableModuleHeight" size="small" border ref="selection" :columns="moduleColumns" :data="moduleData"></Table>
            </Col>
        </Row>
    </Card>
    <modal
        :isShow="moduleShow"
        :loading="moduleLoading"
        :title="moduleTitle"
        :WarnMsg="moduleWarmMessage"
        @submit="moduleSubmit('moduleFormValidate')"
        @cancel="moduleCancel"
    >
        <div slot="content">
            <Form :label-width="90" class="formStyle" ref="moduleFormValidate" :model="moduleFormValidate" :rules="moduleFormValidateRules" :show-message="false">
                <FormItem label="模块编码：" class="formItemMargin" prop="code">
                    <Input v-model="moduleFormValidate.code" placeholder="请输入模块编码"></Input>
                </FormItem>
                <FormItem label="模块名称：" class="formItemMargin" prop="name">
                    <Input v-model="moduleFormValidate.name" placeholder="请输入模块名称"></Input>
                </FormItem>
                <FormItem label="上级模块：" class="formItemMargin" prop="parentModel">
                    <Cascader v-model="moduleFormValidate.parentName" :data="moduleCascader" change-on-select></Cascader>
                </FormItem>
                <FormItem label="Url地址：" class="formItemMargin" prop="navUrl">
                    <Input v-model="moduleFormValidate.navUrl" placeholder="请输入Url地址"></Input>
                </FormItem>
                <FormItem label="图标样式：" class="formItemMargin" prop="iconUrl">
                    <Icon v-if="moduleFormValidate.iconUrl.indexOf('sh-iconfont') === -1" class="iconStyle" :type="moduleFormValidate.iconUrl" />
                    <Icon v-if="moduleFormValidate.iconUrl.indexOf('sh-iconfont') !== -1" :custom="moduleFormValidate.iconUrl"></Icon>
                    <Button @click="iconSelect" type="success">选择</Button>
                </FormItem>
                <FormItem class="formItemMargin" prop="sortNum" label="排序：">
                    <InputNumber :min="1" v-model="moduleFormValidate.sortNum" size="large"></InputNumber>
                </FormItem>
                <FormItem class="formItemMargin" prop="state" label="是否显示：">
                    <Checkbox v-model="moduleFormValidate.state">显示</Checkbox>
                </FormItem>
                <FormItem class="formItemMargin" prop="remark" label="备注：">
                    <Input v-model="moduleFormValidate.remark" type="textarea" :rows="2" placeholder="..."></Input>
                </FormItem>
            </Form>
        </div>
    </modal>
    <Modal
        v-model="iconListShow"
        :title="'图标'"
        :iconName="iconSelectName"
        :closable="true"
        :mask-closable="false"
    >
        <div>
            <Tabs v-model="curIconName" :animated="false">
                <TabPane :label="iconData.label" :name="iconData.name" :key="index" v-for="(iconData, index) of iconAllData">
                    <div class="iconHeight">
                        <div class="iconOutStyle">
                            <div class="iconStyleClass" v-for="(icon, index) of iconData.icons" :key="index" @click="selectIconName(icon)">
                                <Icon v-if="iconData.name === 'name1'" :custom="'sh-iconfont' + ' ' + icon"></Icon>
                                <Icon v-if="iconData.name !== 'name1'" :type="icon" size="24"></Icon>
                            </div>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
            <other-message
                    :createTime="createTime"
                    :createName="createName"
                    :updateName="updateName"
                    :updateTime="updateTime"
            ></other-message>
        </div>
        <!--<a class="IconPosition"><Icon class="IconColse" @click="iconListCancel" type="ios-close" /></a>-->
        <div slot="footer" class="modalFooterStyle">
            <span class="editFormErrorStyle modleMsg">{{ iconSelectMsg }}
                 <Icon class="modleIcon" v-if="iconSelectName.indexOf('sh-iconfont') === -1" size="16" :type="iconSelectName" />
                <Icon class="modleIcon" v-if="iconSelectName.indexOf('sh-iconfont') !== -1" :custom="iconSelectName" size="16"></Icon>
            </span>
            <div>
                <Button type="success" :loading="iconListLoading" @click="iconListSubmit">确认</Button>
                <Button class="cancelButton" @click="iconListCancel">取消</Button>
            </div>
        </div>
    </Modal>
    <delete-warning
            :v-model="moduleWarnShow"
            :tipMsg="moduleWarnMessage"
            :loading="moduleWarnLoading"
            @cancel="moduleWarnCancel"
            @confirm="moduleWarnConfirm"
    ></delete-warning>
</div>
</template>

<script>
import './iconfont/iconfont.css';
import modal from '../../public/modal';
import deleteWarning from '../../public/deleteWarning';
import publicJs from '../../../libs/common';
import xwValidate from '@/libs/xwValidate';
import otherMessage from '../../components/otherMessage';
export default {
    components: {
        modal,
        deleteWarning,
        otherMessage
    },
    data () {
        return {
            curIconName: 'name1',
            moduleTreeData: [],
            tableModuleHeight: document.documentElement.clientHeight - 200,
            moduleColumns: [
                {
                    title: '编码',
                    width: 80,
                    sortable: true,
                    align: 'left',
                    key: 'code'
                },
                {
                    title: '名称',
                    sortable: true,
                    width: 120,
                    align: 'left',
                    key: 'name'
                },
                {
                    title: '状态',
                    width: 120,
                    sortable: true,
                    align: 'center',
                    key: 'state'
                },
                {
                    title: '图标',
                    sortable: true,
                    key: 'iconUrl',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: params.row.iconUrl.indexOf('sh-iconfont') === -1 ? params.row.iconUrl : '',
                                    size: 20,
                                    custom: params.row.iconUrl.indexOf('sh-iconfont') !== -1 ? params.row.iconUrl : ''
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '排序',
                    key: 'sortNum',
                    sortable: true,
                    align: 'center',
                    width: 120
                    // render: (h, params) => {
                    //     return h('div', [
                    //         h('Input', {
                    //             props: {
                    //                 type: 'text',
                    //                 value: this.moduleData[params.index].sortNum
                    //             },
                    //             style: {
                    //                 width: '50px',
                    //                 textAlign: 'center'
                    //             },
                    //             on: {
                    //                 // 'on-blur': (event) => {
                    //                 //     this.getSaveInputSort(params, event.target.value);
                    //                 // },
                    //                 'on-enter': (event) => {
                    //                     this.getSaveInputSort(params, event.target.value);
                    //                 }
                    //             }
                    //         })
                    //     ]);
                    // }
                },
                {
                    title: '备注',
                    minWidth: 120,
                    key: 'left'
                },
                {
                    title: '操作',
                    key: 'action',
                    minWidth: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        let result = [];
                                        this.moduleCascader = this.moduleTreeData[0].children;
                                        this.getParentCascader(result, params.row.parentId);
                                        this.editModuleId = params.row.id;
                                        this.getDetailModule();
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.deleteModuleId = params.row.id;
                                        this.moduleWarnMessage = '确定要删除吗';
                                        this.moduleWarnShow = true;
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            deleteModuleId: '',
            moduleData: [],
            editModuleData: [],
            curAllDataParentId: 1,
            treeSwitch: true,
            curExpandParentId: '',
            // modal
            moduleShow: false,
            moduleLoading: false,
            moduleTitle: '',
            moduleWarmMessage: '',
            moduleFormValidate: {
                code: '',
                name: '',
                parentName: [],
                navUrl: '',
                iconUrl: '',
                sortNum: 0,
                state: true,
                remark: ''
            },
            moduleFormValidateRules: {
                code: [
                    {required: true, validator: xwValidate.code, trigger: 'blur'}
                ],
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ]
            },
            moduleCascader: [],
            moduleWarnShow: false,
            moduleWarnMessage: '',
            moduleWarnLoading: false,
            // iconList
            iconListShow: false,
            iconListLoading: false,
            iconListTitle: '',
            iconSelectName: '',
            createTime: '',
            createName: '',
            updateTime: '',
            updateName: '',
            iconAllData: [
                {
                    name: 'name1',
                    label: '基础图标',
                    icons: ['sh-icon-pinzhongliaoji', 'sh-icon-pinzhongkaitai', 'sh-icon-banzhiguanli', 'sh-icon-technological-parameter', 'sh-icon-gongxuguanli', 'sh-icon-gangweiguanli', 'sh-icon-bianmaguize', 'sh-icon-baoyangleixing', 'sh-icon-gongyipinzhongdingliang', 'sh-icon-gongyiguanli', 'sh-icon-guzhangleixing', 'sh-icon-gongyiluxian', 'sh-icon-jichuziliao', 'sh-icon-jitaifenpei', 'sh-icon-jiaoseguanli', 'sh-icon-icon-test', 'sh-icon-mokuaiguanli', 'sh-icon-measure', 'sh-icon-gongsi', 'sh-icon-peijianguanli', 'sh-icon-kaoqinguizeshezhi', 'sh-icon-paibanguanli', 'sh-icon-pinzhonggongyidan', 'sh-icon-renshiguanli', 'sh-icon-quanxianxiangguanli', 'sh-icon-shebeijixing', 'sh-icon-shengchanbaogong', 'sh-icon-shebeiguanli', 'sh-icon-shengchanguanli', 'sh-icon-sehaoguanli', 'sh-icon-shengchandingdan', 'sh-icon-shebeidanganguanli', 'sh-icon-shengchantongzhidan', 'sh-icon-wuliaoguanli', 'sh-icon-tongjifenxi', 'sh-icon-wuliaofenlei', 'sh-icon-xitongguanli', 'sh-icon-wuliaoshuxing', 'sh-icon-zidian', 'sh-icon-zuzhijiagou', 'sh-icon-zhibanguanli', 'sh-icon-icon-test-copy', 'sh-icon-shucaijiance', 'sh-icon-jijianhesuan', 'sh-icon-guzhanghujiao', 'sh-icon-weixiugongdan', 'sh-icon-renyuanbaobiao', 'sh-icon-banzubaobiao', 'sh-icon-pinzhongbaobiao', 'sh-icon-jitaibaobiao', 'sh-icon-chengbenfenxi', 'sh-icon-guzhangyujing', 'sh-icon-dandingjiance', 'sh-icon-chanchengpindinge', 'sh-icon-huanjingjiance', 'sh-icon-nenghaojiance', 'sh-icon-nenghaodinge', 'sh-icon-jihuapaicheng', 'sh-icon-cushakuguanli', 'sh-icon-peimiandangan', 'sh-icon-pihaoguanli', 'sh-icon-gongyiyujing', 'sh-icon-shujubeifen', 'sh-icon-wuliaozhuisu', 'sh-icon-pinzhongjijiandinge', 'sh-icon-peimianguanli', 'sh-icon-yujingguanli', 'sh-icon-yuanliaodinge', 'sh-icon-zhiliangguanli', 'sh-icon-zhongliangjianyan', 'sh-icon-tairigongfeilirunbiao', 'sh-icon-paichengshitu', 'sh-icon-paichengfabu', 'sh-icon-paichengyunsuan', 'sh-icon-dandingxiaohaodinge', 'sh-icon-zaichanpindinge', 'sh-icon-niandujianyan', 'sh-icon-ziluojianyan', 'sh-icon-zhichengshuaidinge', 'sh-icon-qiangdujianyan', 'sh-icon-peimianpaibaotu', 'sh-icon-huihuadinge', 'sh-icon-huihuaguanli', 'sh-icon-tiaoganjianyan', 'sh-icon-beijianguanli', 'sh-icon-shujujiance', 'sh-icon-shebeibaoyang', 'sh-icon-zhizaoBOMsheji', 'sh-icon-shengchangongxu']
                },
                {
                    name: 'name2',
                    label: '其它',
                    icons: ['ios-home', 'md-home', 'md-hand', 'md-settings', 'ios-stats', 'ios-list-box', 'ios-document', 'ios-construct', 'ios-card', 'ios-calculator', 'ios-paper', 'ios-book', 'md-school', 'md-person', 'md-apps', 'md-attach', 'md-ribbon', 'md-people', 'md-cog', 'md-body', 'md-construct', 'ios-analytics', 'ios-pie', 'ios-pricetag', 'ios-pricetags', 'ios-bookmarks', 'ios-book']
                }
            ],
            editModuleId: '',
            iconSelectMsg: ''
        };
    },
    methods: {
        // 点击树状结构
        handleTree (val) {
            if (val.length !== 0) {
                this.curAllDataParentId = val[0].id;
                this.curExpandParentId = val[0].parentId;
            }
            this.editModuleData.filter(x => x.parentId === this.curExpandParentId).map(item => {
                item.expand = false;
                return item;
            });
            this.editModuleData.find(x => x.id === this.curAllDataParentId).expand = true;
            this.treeSwitch = false;
            this.getModuleDataList();
            // 获取modal的moduleFormValidate.parentName
            let result = [];
            this.getParentCascader(result, this.curAllDataParentId);
        },
        getParentCascader (result, id) {
            if (id === 1) {
                this.moduleFormValidate.parentName = [];
                return false;
            }
            result.push(id);
            if (this.editModuleData.find(x => x.id === id).parentId !== 1) {
                this.getParentCascader(result, this.editModuleData.find(x => x.id === id).parentId);
            } else {
                return this.moduleFormValidate.parentName = result.reverse();
            }
        },
        // 获取所有模块
        getModuleDataList () {
            this.$fetch('module/list?parentid=' + (this.treeSwitch === true ? '' : this.curAllDataParentId)).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    if (this.treeSwitch) {
                        this.editModuleData = content.res.map(item => {
                            item.expand = item.id === 1;
                            item.title = item.name;
                            item.label = item.name;
                            item.value = item.id;
                            return item;
                        });
                        this.editTreeOrg();
                        this.treeSwitch = false;
                        this.getModuleDataList();
                    } else {
                        this.moduleData = content.res.map(x => {
                            x.state = x.state === 1 ? '显示' : '隐藏';
                            return x;
                        });
                        this.$store.dispatch({
                            type: 'hideLoading'
                        });
                    }
                }
            });
        },
        editTreeOrg () {
            this.editModuleData.find(x => x.id === this.curAllDataParentId).expand = true;
            this.getTrees(this.editModuleData, 0);
        },
        getTrees (list, parentId) {
            let items = {};
            // 获取每个节点的直属子节点，*记住是直属，不是所有子节点
            for (let i = 0; i < list.length; i++) {
                let key = list[i].parentId;
                if (items[key]) {
                    items[key].push(list[i]);
                } else {
                    items[key] = [];
                    items[key].push(list[i]);
                }
            }
            return this.formatTree(items, parentId);
        },
        // 利用递归格式化每个节点/**/
        formatTree (items, parentId) {
            const _this = this;
            let result = [];
            if (!items[parentId]) {
                return result;
            }
            for (let t of items[parentId]) {
                t.children = _this.formatTree(items, t.id);
                result.push(t);
            }
            return this.moduleTreeData = result;
        },
        addNewModule () {
            this.createTime = '';
            this.createName = '';
            this.updateTime = '';
            this.updateName = '';
            this.moduleTitle = '新增模块';
            // console.log(this.moduleFormValidate.parentName);
            this.moduleWarmMessage = '';
            this.moduleFormValidate.id = null;
            this.moduleFormValidate.code = '';
            this.moduleFormValidate.name = '';
            this.moduleFormValidate.navUrl = '';
            this.moduleFormValidate.iconUrl = 'ios-keypad-outline';
            this.moduleFormValidate.sortNum = 0;
            this.moduleFormValidate.state = true;
            this.moduleFormValidate.remark = '';
            this.moduleCascader = this.moduleTreeData[0].children;
            this.moduleShow = true;
        },
        getDetailModule () {
            this.$fetch('module/detail/' + this.editModuleId).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.moduleTitle = '编辑模块';
                    this.moduleWarmMessage = '';
                    this.moduleFormValidate.id = content.res.id;
                    this.moduleFormValidate.code = content.res.code;
                    this.moduleFormValidate.name = content.res.name;
                    this.moduleFormValidate.navUrl = content.res.navUrl;
                    this.moduleFormValidate.iconUrl = content.res.iconUrl;
                    this.moduleFormValidate.sortNum = content.res.sortNum;
                    this.moduleFormValidate.state = content.res.state === 1;
                    this.moduleFormValidate.remark = content.res.remark;
                    this.createTime = content.res.createTime;
                    this.createName = content.res.createName;
                    this.updateTime = content.res.updateTime;
                    this.updateName = content.res.updateName;
                    this.moduleShow = true;
                }
            });
        },
        moduleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.moduleFormValidate.id,
                        name: this.moduleFormValidate.name,
                        code: this.moduleFormValidate.code,
                        state: this.moduleFormValidate.state === true ? 1 : 0,
                        sortNum: this.moduleFormValidate.sortNum,
                        remark: this.moduleFormValidate.remark,
                        iconUrl: this.moduleFormValidate.iconUrl,
                        navUrl: this.moduleFormValidate.navUrl.replace(/(^\s*)|(\s*$)/g, ''),
                        parentId: this.moduleFormValidate.parentName.length === 0 ? 1 : this.moduleFormValidate.parentName.reverse()[0]
                    };
                    this.moduleLoading = true;
                    this.$post('module/save', params).then(res => {
                        let content = res.data;
                        this.moduleLoading = false;
                        if (content.status === 200) {
                            this.$Message.success('保存成功');
                            this.treeSwitch = true;
                            this.getModuleDataList();
                            this.moduleShow = false;
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        // input table下面的数据缓存；
        getSaveInputSort (params, event) {
            const query = {
                id: params.row.id,
                code: params.row.code,
                name: params.row.name,
                parentId: params.row.parentId,
                navUrl: params.row.navUrl,
                iconUrl: params.row.iconUrl,
                sortNum: event,
                remark: params.row.remark,
                state: params.row.state === '显示' ? 1 : 0
            };
            this.$post('module/save', query).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.treeSwitch = true;
                    this.getModuleDataList();
                    this.$Message.success('保存成功');
                }
            });
        },
        selectIconName (icon) {
            this.iconSelectMsg = '已选择';
            this.iconSelectName = icon.indexOf('sh-') === -1 ? icon : 'sh-iconfont' + ' ' + icon;
        },
        moduleCancel () {
            this.moduleLoading = false;
            this.moduleShow = false;
        },
        moduleWarnCancel () {
            this.moduleWarnShow = false;
            this.moduleWarnLoading = false;
        },
        moduleWarnConfirm () {
            this.moduleWarnLoading = true;
            this.$post('module/delete/' + this.deleteModuleId).then((res) => {
                this.moduleWarnLoading = false;
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('移除成功');
                    this.treeSwitch = true;
                    this.getModuleDataList();
                    this.moduleWarnShow = false;
                }
            });
        },
        iconSelect () {
            this.curIconName = 'name1';
            this.iconSelectMsg = '';
            this.iconListShow = true;
        },
        iconListSubmit () {
            this.moduleFormValidate.iconUrl = this.iconSelectName;
            this.iconListShow = false;
        },
        iconListCancel () {
            this.iconSelectName = '';
            this.iconListShow = false;
        }
    },
    created () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.getModuleDataList();
    },
    mounted () {
        window.onresize = () => {
            this.tableModuleHeight = publicJs.compClientHeight(200);
        };
    }
};
</script>

<style scoped>
@font-face {
    font-family: 'sh-iconfont';
    src: url('./iconfont/iconfont.eot');
    src: url('./iconfont/iconfont.eot?#iefix') format('embedded-opentype'),
    url('./iconfont/iconfont.woff') format('woff'),
        /*url('../../../images/iconfont/iconfont.css'),*/
    url('./iconfont/iconfont.ttf') format('truetype'),
    url('./iconfont/iconfont.svg#sh-iconfont') format('svg');
}
.sh-iconfont{
    font-family:"sh-iconfont" !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    text-rendering: auto;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    vertical-align: middle;
}
.formStyle{
    padding: 0 40px;
}
.iconStyle{
    font-size: 24px;
    margin-right: 10px;
}
.table{
    width: 100%;
    border-top:1px solid #dddee1;
    border-left:1px solid #dddee1;
}
.tbody{
    width: 100%;
}
.td{
    width: 12.5%;
    height: 60px;
    text-align: center;
    border-right:1px solid #dddee1;
    border-bottom:1px solid #dddee1;
}
.sh-iconfont{
    font-size: 30px;
}
.iconOutStyle{
    width: 100%;
    font-size: 0;
    line-height: 0;
    border-top:1px solid #dddee1;
    border-left:1px solid #dddee1;
}
.iconStyleClass{
    width: 12.5%;
    font-size: 20px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    display: inline-block;
    border-right:1px solid #dddee1;
    border-bottom:1px solid #dddee1;
}
.iconStyleClass:hover{
    background-color: #00c261;
    color: #fff;
}
.modleMsg{
    vertical-align: middle;
    color:#555;
}
.modleIcon{
    vertical-align: middle;
    font-size: 16px;
}
.iconHeight{
    height: 380px;
    overflow: auto;
}
</style>
