<template>
    <div>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <div class="main-box">
            <div class="content-left" :style="{height: tableHeight + 100 + 'px'}">
                <Menu active-name="0"
                      :theme="processManagementTheme"
                      width="auto"
                      @on-select="dictionaryMenuSelect"
                >
                    <MenuItem v-for="(items,index) in menuDataList" :name="index+''" :key="index">{{items.name}}</MenuItem>
                </Menu>
            </div>
            <div class="content-right">
                <Card>
                    <Row>
                        <Col span="24"><p class="rightContentTitleFont">{{ dictionaryMenuName !== '' ? dictionaryMenuName : dictionaryMenuName = '岗位分类' }}</p></Col>
                    </Row>
                    <Row className="parentFlexBetween marginBottom"  align="middle">
                        <Col class="leftFlex">
                            <Button v-show="this.rightItems.add" :disabled="isSystem"  icon="md-add" type="primary" class="queryBarMarginRight" @click="addDirEvent">新增</Button>
                            <Button v-show="this.rightItems.delete" :disabled="isSystem" icon="ios-trash" type="error" @click="deleteDirEvent">删除</Button>
                        </Col>
                        <Col v-show="tubeTypeList.length">
                            <Select @on-change="changeClassType" class="formWidth" v-model="classTypeId" clearable>
                                <Option v-for="(item, index) in tubeTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <Table size="small" :height="tableHeight" :loading="loadingStatus" border ref="selection" :columns="tableColumns" :data="tableData" @on-selection-change="checkTableRow"></Table>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
        <tips-modal
                :v-model="deleteTipsModalState"
                :tip-msg="deleteTipsModalMsg"
                :loading="deleteButtonLoading"
                @cancel="deleteTipsModalCancelEvent"
                @confirm="deleteTipsModalConfirmEvent"
        >
        </tips-modal>
        <save-modal
                :is-disable-confirm="isSystem"
                :modal-state="modalState"
                :save-modal-title="saveModalTitle"
                :add-dir-code-ipt="addDirCodeIpt"
                :add-dir-name-ipt="addDirNameIpt"
                :sort-data="sortData"
                :save-data="saveData"
                :class-id="classId"
                :short-name="shortName"
                :remarks="remarks"
                :tube-type-list="tubeTypeList"
                :button-loading="buttonLoading"
                :show-other="showOther"
                @on-visible-change="modalStateChange"
                @on-cancel="cancelEvent"
                @on-confirm="confirmEvent"
        >
        </save-modal>
    </div>
</template>

<script>
    import api from '../../ajax/api';
    import tipsModal from '../public/deleteWarning';
    import { noticeTips, compClientHeight } from '../../libs/common';
    import saveModal from './components/dictionary-modal';
    export default {
        computed: {
            rightItems () {
                return this.$store.state.moduleRightItems;
            }
        },
        components: { tipsModal, saveModal },
        data () {
            return {
                classTypeId: '',
                globalLoadingShow: false,
                editId: '',
                sortData: 1,
                classId: null,
                saveData: {},
                shortName: '',
                remarks: '',
                menuDataList: [{id: 1, name: ''}],
                modalState: false,
                showOther: false,
                buttonLoading: false,
                tableHeight: document.documentElement.clientHeight - 230,
                loadingStatus: false,
                saveModalTitle: '',
                activeName: '岗位分类',
                detailCode: '',
                detailName: '',
                detailSort: '',
                detailRemark: '',
                detailModalState: false,
                deleteTipsModalState: false,
                deleteTipsModalMsg: '暂无信息',
                checkTableRowData: [],
                addDirCodeIpt: '',
                addDirNameIpt: '',
                dictionaryMenuName: '',
                selectOptions: [],
                processManagementTheme: 'light',
                tableColumns: [],
                originTableColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: '编码',
                        key: 'code',
                        align: 'left',
                        minWidth: 120,
                        sortable: true,
                        fixed: 'left'
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align: 'left',
                        minWidth: 160,
                        sortable: true,
                        fixed: 'left',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    domProps: {
                                        innerHTML: params.row.name
                                    },
                                    on: {
                                        click: () => {
                                            this.editTable(params.row.id, params.index);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '简称',
                        key: 'shortName',
                        align: 'left',
                        width: 100,
                        sortable: true
                    },
                    {
                        title: '管圈类型',
                        key: 'className',
                        align: 'center',
                        width: 100,
                        sortable: true
                    },
                    {
                        title: '排序',
                        key: 'sortNum',
                        align: 'center',
                        width: 100,
                        sortable: true
                    },
                    {
                        title: '备注',
                        key: 'remark',
                        align: 'left',
                        minWidth: 100,
                        sortable: true
                    }
                ],
                tableData: [],
                tubeTypeList: [],
                parentCode: '',
                deleteButtonLoading: false,
                isSystem: false
            };
        },
        methods: {
            changeClassType () {
                this.getListHttp();
            },
            // 新增的方法
            addDirEvent () {
                this.modalState = true;
                if (this.parentCode !== '') {
                    this.editId = '';
                    this.showOther = false;
                    this.saveModalTitle = '新增';
                }
            },
            // 保存modal的确认事件
            confirmEvent (subEditCollection) {
                this.buttonLoading = true;
                this.addDirCodeIpt = subEditCollection.addDirCodeIpt;
                this.addDirNameIpt = subEditCollection.addDirNameIpt;
                this.sortData = subEditCollection.sortData;
                this.classId = subEditCollection.classId;
                this.shortName = subEditCollection.shortName;
                this.remarks = subEditCollection.remarks;
                this.$post(api.postDircSave(),
                    {
                        'id': this.editId,
                        'parentCode': this.parentCode,
                        'name': this.addDirNameIpt,
                        'code': this.addDirCodeIpt,
                        'sortNum': this.sortData,
                        'classId': this.tubeTypeList.length ? this.classId : '',
                        'className': this.tubeTypeList.length ? this.tubeTypeList.find(x => x.id === this.classId).name : '',
                        'shortName': this.tubeTypeList.length ? this.shortName : '',
                        'remark': this.remarks,
                        'colorValue': subEditCollection.colorValue
                    }
                ).then((res) => {
                    if (res.data.status === 200) {
                        this.modalState = false;
                        this.buttonLoading = false;
                        this.getListHttp();
                        noticeTips(this, 'saveTips');
                    } else if (res.data.status === 415) {
                        this.buttonLoading = false;
                    } else {
                        this.buttonLoading = false;
                    };
                });
            },
            // 保存modal的取消事件
            cancelEvent () {
                this.modalState = false;
            },
            // 保存modal状态的监听事件
            modalStateChange (e) {
                this.modalState = e;
                if (e === false) {
                    this.addDirCodeIpt = '';
                    this.sortData = 1;
                    this.classId = null;
                    this.shortName = '';
                    this.addDirNameIpt = '';
                    this.remarks = '';
                };
            },
            // 删除modal的确认按钮
            deleteTipsModalConfirmEvent () {
                if (this.checkTableRowData.length !== 0) {
                    let ids = [];
                    this.deleteButtonLoading = true;
                    this.checkTableRowData.forEach(item => ids.push(item.id));
                    this.$post(api.postDircDelete(), ids).then((res) => {
                        if (res.data.status === 200) {
                            this.deleteButtonLoading = false;
                            this.deleteTipsModalState = false;
                            this.getListHttp();
                            this.checkTableRowData = [];
                            noticeTips(this, 'deleteTips');
                        } else if (res.data.status === 415) {
                            this.deleteTipsModalState = false;
                            this.deleteButtonLoading = false;
                            this.$Loading.finish();
                        } else {
                            this.deleteButtonLoading = false;
                        };
                    });
                };
            },
            deleteTipsModalCancelEvent () {
                this.deleteButtonLoading = false;
                this.deleteTipsModalState = false;
            },
            // 勾选按钮
            checkTableRow (e) {
                this.checkTableRowData = e;
            },
            // 获取列表数据
            getListHttp () {
                let params = {
                    parentCode: this.parentCode,
                    classId: this.classTypeId
                };
                this.loadingStatus = true;
                this.$call('dict.list', params).then(res => {
                    if (res.data.status === 200) {
                        this.globalLoadingShow = false;
                        this.loadingStatus = false;
                        this.tableData = res.data.res;
                    };
                });
            },
            // 菜单的点击方法
            dictionaryMenuSelect (e) {
                this.dictionaryMenuName = this.menuDataList[e].name;
                this.isSystem = this.menuDataList[e].isSystem; // 是否系统配置, true时不用增删
                this.parentCode = this.menuDataList[e].code;
                if (this.parentCode === 'tube_color') {
                    this.tableColumns = this.originTableColumns;
                    this.$fetch(api.getDircList('tube_type')).then((res) => {
                        if (res.data.status === 200) {
                            this.tubeTypeList = res.data.res;
                            this.classTypeId = '';
                            this.getListHttp();
                        }
                    });
                } else {
                    this.tubeTypeList = [];
                    this.classTypeId = '';
                    this.tableColumns = this.originTableColumns.filter(x => x.key !== 'className' && x.key !== 'shortName');
                    this.getListHttp();
                };
            },
            // 编辑按钮事件
            editTable (id, index) {
                this.editId = id;
                this.$fetch(api.getDircDtail(this.editId)).then((res) => {
                    if (res.data.status === 200) {
                        this.showOther = true;
                        this.saveModalTitle = '编辑';
                        let responseData = res.data.res;
                        this.saveData = responseData;
                        this.modalState = true;
                        this.parentCode = responseData.parentCode;
                        this.addDirCodeIpt = responseData.code;
                        this.addDirNameIpt = responseData.name;
                        this.sortData = responseData.sortNum;
                        this.classId = responseData.classId;
                        this.shortName = responseData.shortName;
                        this.remarks = responseData.remark;
                    };
                });
            },
            // 删除事件
            deleteDirEvent () {
                if (this.checkTableRowData.length !== 0) {
                    this.deleteTipsModalMsg = '确定删除？';
                    this.deleteTipsModalState = true;
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 获取菜单的数据
            getMenuHttp () {
                this.$fetch(api.getdircCateList()).then((res) => {
                    if (res.data.status === 200) {
                        this.menuDataList = res.data.res;
                        this.parentCode = this.menuDataList[0].code;
                        this.isSystem = this.menuDataList[0].isSystem; // 是否系统配置, true时不用增删
                        this.getListHttp();
                    };
                });
            }
        },
        created () {
            this.globalLoadingShow = true;
            this.getMenuHttp();
        },
        mounted () {
            this.tableColumns = this.originTableColumns.filter(x => x.key !== 'className' && x.key !== 'shortName');
            window.onresize = () => {
                this.tableHeight = compClientHeight(230);
            };
        }
    };
</script>
<style scoped>
    .content-left{
        width:160px;
        position: absolute;
        left:10px;
        top:0px;
        bottom:0;
        background: #fff;
        overflow-y: auto;
        margin-top: 2px;
    }
    .content-right{
        position: absolute;
        top:0px;
        right: 10px;
        bottom:0;
        left:186px;
    }
</style>
