<template>
  <left-menu
    :stateList="menuArr"
    :curTabStateId="activeMenuAuditSate"
    @on-select="getClickMenuEvent"
  >
    <div slot="content">
      <global-loading v-show="globalLoadingShow"></global-loading>
      <Row type="flex" justify="space-between" align="middle">
        <Col>
          <Row type="flex">
            <!--<Button icon="ios-create" v-show="pushSwitch" type="primary" @click="pushEvent" class="queryBarMarginRight margin-bottom-10">提交</Button>-->
            <Button
              icon="ios-undo"
              v-show="activeMenuAuditSate === 2"
              type="warning"
              @click="cancelEvent"
              class="queryBarMarginRight margin-bottom-10"
              >撤销提交</Button
            >
            <Button
              icon="md-done-all"
              v-show="activeMenuAuditSate === 2"
              type="primary"
              @click="auditEvent"
              class="queryBarMarginRight margin-bottom-10"
              >审核</Button
            >
            <Button
              icon="md-refresh"
              v-show="activeMenuAuditSate === 3"
              type="warning"
              @click="unAuditEvent"
              class="queryBarMarginRight margin-bottom-10"
              >撤销审核</Button
            >
            <Button
              icon="md-close"
              v-show="activeMenuAuditSate === 3"
              type="error"
              @click="closeEvent"
              class="queryBarMarginRight margin-bottom-10"
              >关闭单据</Button
            >
            <Button
              icon="ios-undo-outline"
              v-show="activeMenuAuditSate === 4"
              type="warning"
              @click="unCloseEvent"
              class="queryBarMarginRight margin-bottom-10"
              >撤销关闭</Button
            >
            <Button
              icon="ios-trash"
              v-show="activeMenuAuditSate === 1"
              type="error"
              @click="deleteEvent"
              class="queryBarMarginRight margin-bottom-10"
              >删除</Button
            >
          </Row>
        </Col>
        <Col>
          <Row type="flex" justify="end">
            <Col>
              <Row type="flex" justify="end">
                <Col class="margin-bottom-10 padding-left-4">
                  <DatePicker
                    type="date"
                    placeholder="请选择计划开工时间"
                    class="query-bar-input-width"
                    v-model="queryBarDateFrom"
                  ></DatePicker>
                </Col>
                <Col class="margin-bottom-10 padding-left-4">
                  <DatePicker
                    type="date"
                    placeholder="请选择计划完工时间"
                    class="query-bar-input-width"
                    v-model="queryBarDateTo"
                  ></DatePicker>
                </Col>
                <Col class="margin-bottom-10 padding-left-4">
                  <Select
                    clearable
                    v-model="queryBarWorkshopValue"
                    class="query-bar-input-width"
                    placeholder="请选择生产车间"
                  >
                    <Option
                      v-for="item in queryBarWorkshopList"
                      :value="item.deptId"
                      :key="item.deptId"
                      >{{ item.deptName }}</Option
                    >
                  </Select>
                </Col>
                <Col class="margin-bottom-10 padding-left-4">
                  <Select
                    clearable
                    v-model="queryBarProcessTypeValue"
                    class="query-bar-input-width"
                    placeholder="请选择所属工段"
                    @on-change="getProcessTypeEvent"
                  >
                    <Option
                      v-for="item in queryBarProcessTypList"
                      :value="item.id"
                      :key="item.id"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </Col>
<<<<<<< HEAD
                <Col class="margin-bottom-10 padding-left-4">
                  <Select
                    clearable
                    v-model="queryBarProcessValue"
                    class="query-bar-input-width"
                    placeholder="请选择生产工序"
                  >
                    <Option
                      v-for="item in queryBarProcessList"
                      :style="item.style"
                      :value="item.id"
                      :key="item.deptId"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </Col>
              </Row>
              <Row type="flex" justify="end" v-show="showMore">
                <Col class="margin-bottom-10 padding-left-4">
                  <Input
                    type="text"
                    v-model="queryBarOrderCodeValue"
                    class="query-bar-input-width"
                    placeholder="请输入生产单号"
                  />
                </Col>
                <Col class="margin-bottom-10 padding-left-4">
                  <Input
                    type="text"
                    v-model="queryBarNoticeValue"
                    class="query-bar-input-width"
                    placeholder="请输入通知单号"
                  />
                </Col>
                <Col class="margin-bottom-10 padding-left-4">
                  <Input
                    type="text"
                    v-model="queryBarMaterielValue"
                    class="query-bar-input-width"
                    placeholder="请输入产品编码或名称"
                  />
                </Col>
                <Col class="margin-bottom-10 padding-left-4">
                  <Input
                    type="text"
                    v-model="queryBarBatchCodeValue"
                    class="query-bar-input-width queryBarMarginRight"
                    placeholder="请输入批号"
                  />
                </Col>
                <Col class="flexAlignCenter margin-bottom-10">
                  <!--<p class="labelWidth">引用状态:</p>-->
                  <Select
                    clearable
                    v-model="queryBarStartState"
                    placeholder="请选择开台状态"
                    class="query-bar-input-width"
                  >
                    <Option
                      v-for="item in startStateList"
                      :value="item.id"
                      :key="item.id"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </Col>
              </Row>
            </Col>
            <Col class="searchButtonStyle margin-bottom-10">
              <a class="moreStyle" @click="showScreenChange">···</a>
              <Button
                icon="ios-search"
                type="primary"
                @click="searchButtonClickEvent"
                class="queryButtonStyle"
                >搜索</Button
              >
            </Col>
          </Row>
        </Col>
      </Row>
      <Row class="table-bar margin-bottom-10">
        <Col>
          <Table
            @on-selection-change="selectionChangeEvent"
            :loading="tableLoading"
            size="small"
            :height="tableHeight"
            border
            ref="selection"
            :columns="tableHeader"
            :data="tableData"
          ></Table>
        </Col>
      </Row>
      <Row class="pageHeight">
        <Col class="pageStyle">
          <Page
            show-sizer
            :page-size="pageSize"
            show-total
            :total="pageTotal"
            show-elevator
            :page-size-opts="pageOpts"
            @on-change="getPageIndex"
            @on-page-size-change="getPageSizeEvent"
          ></Page>
        </Col>
      </Row>
      <Row>
        <tips-modal
          :v-model="deleteModalStatus"
          :tipMsg="deleteMsg"
          :loading="deleteButtonLoading"
          @cancel="deleteCancel"
          @confirm="deleteConfirm"
        >
        </tips-modal>
      </Row>
      <Row>
        <Col>
          <process-modification-modal
            :spinShow="spinShow"
            :modificationModalBtnLoading="modificationModalBtnLoading"
            :specSheetDetail="specSheetDetail"
            :modificationModalState="modificationModalState"
            @modificationModalConfirmEvent="modificationModalConfirmEvent"
            @modificationModalCancelEvent="modificationModalCancelEvent"
            @modificationModalStateChangeEvent="
              modificationModalStateChangeEvent
            "
          ></process-modification-modal>
        </Col>
      </Row>
    </div>
  </left-menu>
=======
            </Row>
            <tips-modal
                    :v-model="deleteModalStatus"
                    :tipMsg="deleteMsg"
                    :loading="deleteButtonLoading"
                    @cancel="deleteCancel"
                    @confirm="deleteConfirm"
            >
            </tips-modal>
            <process-modification-modal
                    :spinShow="spinShow"
                    :modificationModalBtnLoading="modificationModalBtnLoading"
                    :specSheetDetail="specSheetDetail"
                    :modificationModalState="modificationModalState"
                    @modificationModalConfirmEvent="modificationModalConfirmEvent"
                    @modificationModalCancelEvent="modificationModalCancelEvent"
                    @modificationModalStateChangeEvent="modificationModalStateChangeEvent"
            ></process-modification-modal>
        </div>
    </left-menu>
>>>>>>> 1cf4c31a24c82e8d99f3fbd49dffb5beb9ff76cc
</template>
<script>
let _this = this;
import tipsModal from '../../public/deleteWarning';
import { noticeTips, clearSpace, compClientHeight, setPage, toDay, formatDate, translateState, emptyTips } from '../../../libs/common';
import leftMenu from '../../layout/layout';
import processModificationModal from './process-modification';
export default {
  name: 'notice-List',
  components: {
    tipsModal, leftMenu, processModificationModal
  },
  data () {
    return {
      queryBarStartState: null,
      startStateList: [
        {
          id: '0',
          name: '未开台'
        },
<<<<<<< HEAD
        {
          id: '1',
          name: '部分开台'
        },
        {
          id: '2',
          name: '全部开台'
        }
      ],
      globalLoadingShow: false,
      modificationModalBtnLoading: false,
      spinShow: false,
      specSheetDetail: {},
      modificationModalState: false,
      checkArr: [],
      activeMenuAuditSate: 1,
      menuArr: [],
      tableLoading: false,
      tableHeight: '',
      pageSize: setPage.pageSize,
      pageOpts: setPage.pageOpts,
      pageTotal: 0,
      pageIndex: 1,
      queryBarDateFrom: '',
      queryBarDateTo: '',
      deleteModalStatus: false,
      deleteMsg: '',
      deleteButtonLoading: false,
      queryBarNoticeValue: '',
      queryBarMaterielValue: '',
      queryBarOrderCodeValue: '',
      queryBarBatchCodeValue: '',
      queryBarBillStateValue: '1',
      queryBarWorkshopValue: null,
      queryBarWorkshopList: [],
      queryBarProcessValue: '',
      queryBarProcessList: [],
      queryBarProcessTypList: [],
      queryBarProcessTypeValue: null,
      showMore: false,
      tableHeader: [
        {
          type: 'selection',
          width: 60,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '操作',
          sortable: true,
          minWidth: 110,
          align: 'center',
          fixed: 'left',
          render: (h, params) => {
            return h('Button', {
              props: {
                disabled: params.row.auditState === 3 ? false : true,
                type: params.row.isDesigned ? 'primary' : 'success'
              },
              domProps: {
                innerHTML: '工艺翻改'
              },
              on: {
                'click': () => {
                  _this.processModificationEvent(params.row.id, params.row.isDesigned);
                }
              }
            })
          }
        },
        {
          title: '生产通知单编号',
          key: 'code',
          sortable: true,
          align: 'left',
          fixed: 'left',
          minWidth: 130,
          render: (h, params) => {
            if (parseInt(params.row.auditState) === 1) {
              return h('div', [
                h('a', {
                  domProps: {
                    innerHTML: params.row.code
                  },
                  on: {
                    click: () => {
                      _this.$router.push({
                        path: 'notice-detail',
                        query: {
                          id: params.row.id,
                          activated: true
                        }
                      });
                    }
                  }
                }),
                h('Icon', {
                  props: {
                    type: 'md-create',
                    size: 16
                  },
                  style: {
                    marginLeft: '8px',
                    cursor: 'pointer'
                  },
                  on: {
                    click: () => {
                      _this.editClick(params.row.id);
                    }
                  }
                })
              ]);
            } else {
              return h('div', [
                h('a', {
                  domProps: {
                    innerHTML: params.row.code
                  },
                  on: {
                    click: () => {
                      _this.$router.push({
                        path: 'notice-detail',
                        query: {
                          id: params.row.id,
                          activated: true
                        }
                      });
                    }
                  }
                })
              ]);
=======
        data () {
            return {
                queryBarStartState: null,
                startStateList: [
                    {id: '0', name: '未开台'},
                    {id: '1', name: '部分开台'},
                    {id: '2', name: '全部开台'}
                ],
                globalLoadingShow: false,
                modificationModalBtnLoading: false,
                spinShow: false,
                specSheetDetail: {},
                modificationModalState: false,
                checkArr: [],
                activeMenuAuditSate: 1,
                menuArr: [],
                tableLoading: false,
                tableHeight: '',
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                pageTotal: 0,
                pageIndex: 1,
                queryBarDateFrom: '',
                queryBarDateTo: '',
                deleteModalStatus: false,
                deleteMsg: '',
                deleteButtonLoading: false,
                queryBarNoticeValue: '',
                queryBarMaterielValue: '',
                queryBarOrderCodeValue: '',
                queryBarBatchCodeValue: '',
                queryBarBillStateValue: '1',
                queryBarWorkshopValue: null,
                queryBarWorkshopList: [],
                queryBarProcessValue: '',
                queryBarProcessList: [],
                queryBarProcessTypList: [],
                queryBarProcessTypeValue: null,
                showMore: false,
                tableHeader: [
                    {type: 'selection', width: 60, fixed: 'left', align: 'center'},
                    {
                        title: '操作',
                        sortable: true,
                        minWidth: 110,
                        align: 'center',
                        fixed: 'left',
                        render: (h, params)=> {
                            return h('Button', {
                                props: {
                                    disabled: params.row.auditState === 3 ? false : true,
                                    type: params.row.isDesigned ? 'primary' : 'success'
                                },
                                domProps: {
                                    innerHTML: '工艺翻改'
                                },
                                on: {
                                    'click': () =>{
                                        _this.processModificationEvent(params.row.id, params.row.isDesigned);
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '生产通知单编号',
                        key: 'code',
                        sortable: true,
                        align: 'left',
                        fixed: 'left',
                        minWidth: 130,
                        render: (h, params) => {
                            if (parseInt(params.row.auditState) === 1) {
                                return h('div', [
                                    h('a', {
                                        domProps: {
                                            innerHTML: params.row.code
                                        },
                                        on: {
                                            click: () => {
                                                _this.$router.push({
                                                    path: 'notice-detail',
                                                    query: {
                                                        id: params.row.id,
                                                        activated: true
                                                    }
                                                });
                                            }
                                        }
                                    }),
                                    h('Icon', {
                                        props: {
                                            type: 'md-create',
                                            size: 16
                                        },
                                        style: {
                                            marginLeft: '8px',
                                            cursor: 'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                _this.editClick(params.row.id);
                                            }
                                        }
                                    })
                                ]);
                            } else {
                                return h('div', [
                                    h('a', {
                                        domProps: {
                                            innerHTML: params.row.code
                                        },
                                        on: {
                                            click: () => {
                                                _this.$router.push({
                                                    path: 'notice-detail',
                                                    query: {
                                                        id: params.row.id,
                                                        activated: true
                                                    }
                                                });
                                            }
                                        }
                                    })
                                ]);
                            };
                        }
                    },
                    {
                        title: '开台状态',
                        sortable: true,
                        minWidth: 110,
                        align: 'center',
                        fixed: 'left',
                        key: 'startState',
                        render: (h, params) => {
                            let startStateName = '';
                            if (params.row.startState === 0) {
                                startStateName = '未开台';
                            } else if (params.row.startState === 1) {
                                startStateName = '部分开台';
                            } else if (params.row.startState === 2) {
                                startStateName = '全部开台';
                            };
                            return h('div', {
                                domProps: {
                                    innerHTML: startStateName
                                }
                            })
                        }
                    },
                    {
                        title: '了机状态',
                        sortable: true,
                        minWidth: 110,
                        align: 'center',
                        fixed: 'left',
                        key: 'finishState',
                        render: (h, params) => {
                            let finishStateName = '';
                            if (params.row.finishState === 0) {
                                finishStateName = '未了机';
                            } else if (params.row.finishState === 1) {
                                finishStateName = '部分了机';
                            } else if (params.row.finishState === 2) {
                                finishStateName = '全部了机';
                            };
                            return h('div', {
                                domProps: {
                                    innerHTML: finishStateName
                                }
                            })
                        }
                    },
                    {
                        title: '生产订单号',
                        key: 'prdOrderCode',
                        minWidth: 130,
                        sortable: true,
                        align: 'left',
                        render: (h, params) => {
                            return h('Poptip', {
                                props: {
                                    trigger: 'hover',
                                    placement: 'bottom'
                                }
                            }, [
                                h('span', {
                                    style: {
                                        color: '#ff9900',
                                        width: '100px',
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }
                                }, params.row.prdOrderCodes),
                                h('div', {
                                    slot: 'content',
                                    style: {
                                        textAlign: 'left'
                                    }
                                }, [
                                    params.row.prdOrderCodes.split(',').map(item => {
                                        return h('p', {
                                        }, item);
                                    })
                                ])
                            ]);
                        }
                    },
                    {title: '计划开工时间', key: 'planStartDate', minWidth: 110, sortable: true, align: 'left'},
                    {title: '计划完工时间', key: 'planFinishDate', minWidth: 110, sortable: true, align: 'left'},
                    {
                        title: '产品',
                        key: 'productCode',
                        minWidth: 200,
                        sortable: true,
                        align: 'left',
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.productName ? `${params.row.productName}(${params.row.productCode})` : ''
                                }
                            });
                        }
                    },
                    {title: '批号', sortable: true, minWidth: 110, align: 'left', key: 'batchCode'},
                    {
                        title: '计量单位',
                        key: 'unitName',
                        minWidth: 110,
                        sortable: true,
                        align: 'left',
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.unitName ? `${params.row.unitName}(${params.row.unitCode})` : ''
                                }
                            })
                        }
                    },
                    {title: '生产数量', key: 'productionQty', minWidth: 110, sortable: true, align: 'right'},
                    {title: '排产机台数量', key: 'machineNumber', minWidth: 110, sortable: true, align: 'right'},
                    {title: '生产工序', key: 'processName', minWidth: 130, sortable: true, align: 'center'},
                    {title: '所属工段', key: 'processTypeName', minWidth: 120, sortable: true, align: 'left'},
                    {title: '生产车间', key: 'workshopName', minWidth: 110, sortable: true, align: 'left'},
                    {title: '创建人', key: 'createName', minWidth: 110, sortable: true, align: 'center'},
                    {title: '创建日期', key: 'createTime', minWidth: 150, sortable: true, align: 'left'}
                ],
                tableData: [],
                pageHeights: null,
                toCreated: false
>>>>>>> 1cf4c31a24c82e8d99f3fbd49dffb5beb9ff76cc
            };
          }
        },
<<<<<<< HEAD
        {
          title: '开台状态',
          sortable: true,
          minWidth: 110,
          align: 'center',
          fixed: 'left',
          key: 'startState',
          render: (h, params) => {
            let startStateName = '';
            if (params.row.startState === 0) {
              startStateName = '未开台';
            } else if (params.row.startState === 1) {
              startStateName = '部分开台';
            } else if (params.row.startState === 2) {
              startStateName = '全部开台';
            };
            return h('div', {
              domProps: {
                innerHTML: startStateName
              }
            })
          }
        },
        {
          title: '了机状态',
          sortable: true,
          minWidth: 110,
          align: 'center',
          fixed: 'left',
          key: 'finishState',
          render: (h, params) => {
            let finishStateName = '';
            if (params.row.finishState === 0) {
              finishStateName = '未了机';
            } else if (params.row.finishState === 1) {
              finishStateName = '部分了机';
            } else if (params.row.finishState === 2) {
              finishStateName = '全部了机';
            };
            return h('div', {
              domProps: {
                innerHTML: finishStateName
              }
            })
          }
        },
        {
          title: '生产订单号',
          key: 'prdOrderCode',
          minWidth: 130,
          sortable: true,
          align: 'left',
          render: (h, params) => {
            return h('Poptip', {
              props: {
                trigger: 'hover',
                placement: 'bottom'
              }
            }, [
              h('span', {
                style: {
                  color: '#ff9900',
                  width: '100px',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }
              }, params.row.prdOrderCodes),
              h('div', {
                slot: 'content',
                style: {
                  textAlign: 'left'
                }
              }, [
                params.row.prdOrderCodes.split(',').map(item => {
                  return h('p', {
                  }, item);
=======
        methods: {
            // 关闭
            closeEvent () {
                let isStartState = false;
                // 了机状态为全部了机,才能进行关闭
                this.checkArr.forEach((item)=>{
                    if (item.finishState !== 2) isStartState = true;
                });
                if (this.checkArr.length !== 0) {
                    if (!isStartState) {
                        this.closeHttp();
                    } else {
                        emptyTips(this, '全部了机,才能进行关闭!');
                    }
                } else {
                    noticeTips(this, 'unCheckTips');
                }
            },
            closeHttp () {
                this.$api.notice.prdNoticeCloseRequest(this.getAllIdMethods(this.checkArr)).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuHttp();
                        this.getListHttp();
                        noticeTips(this, 'closeTips');
                        this.checkArr = [];
                    }
                });
            },
            unCloseEvent () {
                if (this.checkArr.length && this.checkArr.length !== 0) {
                    this.$api.notice.prdNoticeUncloseRequest(this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            this.getMenuHttp();
                            this.getListHttp();
                            noticeTips(this, 'unCloseTips');
                            this.checkArr = [];
                        }
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                }
            },
            // 获取工艺类型
            getProcessTypeEvent (e) {
                this.getProcessHttp(e);
            },
            processModificationEvent (id, isDesigned) {
                this.modificationModalState = true;
                this.spinShow = true;
                this.$api.notice.prdNoticeSpecDetailByNoticeIdRequest({id: id}).then(res => {
                    if (res.data.status === 200) {
                        this.spinShow = false;
                        res.data.res.tubeColorIds = JSON.parse(res.data.res.tubeColorIds);
                        // 未设计时，上机工艺默认等于设计工艺
                        if (!isDesigned) {
                            res.data.res.noticeSpecParamList.forEach(item => {
                                item.actualVal = item.val;
                            });
                        }
                        this.specSheetDetail = res.data.res;
                    }
                })
            },
            modificationModalStateChangeEvent (e) {
                this.modificationModalState = e;
                if (e === false) this.modificationModalBtnLoading = false;
            },
            modificationModalConfirmEvent (params) {
                this.saveModificationHttp(JSON.parse(JSON.stringify(params)));
            },
            saveModificationHttp (params) {
                params.noticeSpecParamList.forEach((item) =>{
                    item.dataType === 1 && item.actualVal ? item.actualVal = (parseInt(item.actualVal * 1000)) / 1000 : false;
                    delete item.id;
                });
                params.tubeColorIds = JSON.stringify(params.tubeColorIds);
                params.tubeColorNames = JSON.stringify(params.tubeColorNames);
                this.modificationModalBtnLoading = true;
                this.$api.notice.prdNoticeSpecSaveRequest(params).then(res => {
                    if (res.data.status === 200) {
                        this.modificationModalState = false;
                        this.modificationModalBtnLoading = false;
                        noticeTips(this, 'saveTips');
                        this.getMenuHttp();
                        this.getListHttp();
                    } else {
                        this.modificationModalBtnLoading = false;
                    }
                })
            },
            modificationModalCancelEvent () {
                this.modificationModalState = false;
            },
            // 反审核的方法
            unAuditEvent (e) {
                let isStartState = false;
                // 已开台和是上机物料不能反审核
                this.checkArr.forEach((item)=>{ if (item.startState !== 0 || item.isFeedingSetted === true) isStartState = true; });
                if (this.checkArr.length !== 0) {
                    // 未开台的才能撤销审核
                    if (!isStartState) {
                        this.unAuditHttp();
                    } else {
                        this.$Modal.warning({
                            title: '提示',
                            content: '已开台或上机物料已设定,不能进行撤销审核!'
                        });
                    }
                } else {
                    noticeTips(this, 'unCheckTips');
                }
            },
            // 反审核
            unAuditHttp () {
                this.$api.notice.prdNoticeUnapproveRequest(this.getAllIdMethods(this.checkArr)).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuHttp();
                        this.getListHttp();
                        noticeTips(this, 'unAuditTips');
                        this.checkArr = [];
                    }
                });
            },
            // 审核的事件
            auditEvent () {
                if (this.checkArr.length !== 0) {
                    this.auditHttp();
                } else {
                    noticeTips(this, 'unCheckTips');
                }
            },
            // 撤销事件
            cancelEvent () {
                if (this.checkArr.length !== 0) {
                    this.$api.notice.cancelHttp(this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            this.getMenuHttp();
                            this.getListHttp();
                            noticeTips(this, 'cancelTips');
                            this.checkArr = [];
                        }
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                }
            },
            // 提交事件
            pushEvent () {
                if (this.checkArr.length !== 0) {
                    // 提交的请求
                    this.submitHttp();
                } else {
                    noticeTips(this, 'unCheckTips');
                }
            },
            // 获取勾选的对象
            selectionChangeEvent (currentRow) {
                this.checkArr = currentRow;
            },
            // 菜单的点击事件
            getClickMenuEvent (obj) {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.activeMenuAuditSate = obj.id;
                this.queryBarBillStateValue = obj.id + '';
                this.queryBarNoticeValue = '';
                this.queryBarOrderCodeValue = '';
                this.queryBarBatchCodeValue = '';
                this.queryBarProcessValue = '';
                this.queryBarStartState = null;
                this.queryBarMaterielValue = '';
                this.queryBarDateFrom = '';
                this.queryBarDateTo = '';
                this.getListHttp();
                this.getMenuHttp();
            },
            // 获取左侧菜单
            getMenuHttp () {
                return this.$api.notice.prdNoticeStateCountRequest({
                    workshopId: this.queryBarWorkshopValue
                }).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item) => {
                            if (item.id === 0) {
                                item.name = '待创建';
                            } else if (item.id === 1) {
                                item.name = '待提交';
                            }
                        });
                        this.menuArr = res.data.res;
                    }
                });
            },
            // 获取每页条数
            getPageSizeEvent (e) {
                this.pageSize = e;
                this.getListHttp();
            },
            // 搜索按钮的事件
            searchButtonClickEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListHttp();
                this.getMenuHttp();
            },
            // 搜索的请求
            getListHttp () {
                this.queryBarMaterielValue = clearSpace(this.queryBarMaterielValue);
                this.queryBarNoticeValue = clearSpace(this.queryBarNoticeValue);
                this.queryBarOrderCodeValue = clearSpace(this.queryBarOrderCodeValue);
                this.queryBarBatchCodeValue = clearSpace(this.queryBarBatchCodeValue);
                this.queryBarBillStateValue = this.queryBarBillStateValue || '';
                this.queryBarProcessValue = this.queryBarProcessValue || '';
                this.queryBarStartState = this.queryBarStartState || '';
                this.queryBarDateFrom ? this.queryBarDateFrom = formatDate(this.queryBarDateFrom).split(' ')[0] : this.queryBarDateFrom = '';
                this.queryBarDateTo ? this.queryBarDateTo = formatDate(this.queryBarDateTo).split(' ')[0] : this.queryBarDateTo = '';
                this.$api.notice.prdNoticeListRequest({
                    // 'dateFrom': this.queryBarDateFrom,
                    // 'dateTo': this.queryBarDateTo,
                    'planStartDateFrom': this.queryBarDateFrom,
                    'planStartDateTo': this.queryBarDateTo,
                    'code': this.queryBarNoticeValue,
                    'product': this.queryBarMaterielValue,
                    'prdOrderCode': this.queryBarOrderCodeValue,
                    'batchCode': this.queryBarBatchCodeValue,
                    'workshopId': this.queryBarWorkshopValue,
                    'processId': this.queryBarProcessValue,
                    'startState': this.queryBarStartState,
                    'pageIndex': this.pageIndex,
                    'pageSize': this.pageSize,
                    'processTypeId': this.queryBarProcessTypeValue,
                    'auditState': this.queryBarBillStateValue
                }).then(res => {
                    if (res.data.status === 200) {
                        this.checkArr = [];
                        this.tableData = translateState(res.data.res);
                        this.pageTotal = res.data.count;
                        this.pageTotal = res.data.count;
                        this.globalLoadingShow = false;
                    }
                });
            },
            // 获取页码事件
            getPageIndex (e) {
                this.pageIndex = e;
                this.getListHttp();
            },
            // 删除的方法
            deleteEvent () {
                if (this.checkArr.length !== 0) {
                    this.deleteModalStatus = true;
                    this.deleteMsg = '确认删除？';
                } else {
                    noticeTips(this, 'unCheckTips');
                }
            },
            // 获取id
            getAllIdMethods (array) {
                return array.map(item => item.id);
            },
            // 删除的确认按钮
            deleteConfirm () {
                this.deleteButtonLoading = true;
                this.$api.notice.prdNoticeDeleteRequest(this.getAllIdMethods(this.checkArr)).then((res) => {
                    if (res.data.status === 200) {
                        this.deleteButtonLoading = false;
                        this.deleteModalStatus = false;
                        this.getListHttp();
                        this.getMenuHttp();
                        this.checkArr = [];
                        noticeTips(this, 'deleteTips');
                    } else {
                        this.deleteButtonLoading = false;
                    }
                });
            },
            // 删除的取消按钮
            deleteCancel () {
                this.deleteModalStatus = false;
                this.deleteButtonLoading = false;
            },
            // 编辑的点击事件
            editClick (id) {
                this.$router.push({
                    path: 'editNotice',
                    query: {
                        id: id,
                        activated: true
                    }
                });
            },
            // 提交的请求
            submitHttp () {
                this.$api.notice.prdNoticeSubmitRequest(this.getAllIdMethods(this.checkArr)).then(res => {
                    if (res.data.status === 200) {
                        this.getListHttp();
                        this.getMenuHttp();
                        noticeTips(this, 'submitTips');
                        this.checkArr = [];
                    }
                });
            },
            // 审核的请求
            auditHttp () {
                this.$api.notice.prdNoticeApproveRequest(this.getAllIdMethods(this.checkArr)).then(res => {
                    if (res.data.status === 200) {
                        this.getListHttp();
                        this.getMenuHttp();
                        noticeTips(this, 'auditTips');
                        this.checkArr = [];
                    }
                });
            },
            // 显示更多的事件
            showScreenChange () {
                let tableDom = document.getElementsByClassName('table-bar')[0];
                if (this.showMore) {
                    this.showMore = false;
                    // 先减去一行的高度
                    this.tableHeight = this.tableHeight - 52;
                    setTimeout(() => {
                        this.tableHeight = compClientHeight(tableDom.offsetTop + 130 + this.pageHeights + 30);
                    }, 0);
                } else if (this.showMore === false) {
                    this.showMore = true;
                    this.tableHeight = this.tableHeight - 52;
                    setTimeout(() => {
                        this.tableHeight = compClientHeight(tableDom.offsetTop + 130 + this.pageHeights + 30);
                    }, 0);
                }
            },
            getWorkshopHttp () {
                return this.$api.common.userWorkshopRequest().then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.queryBarWorkshopValue = responseData.defaultDeptId;
                        this.queryBarWorkshopList = responseData.userData;
                    }
                });
            },
            // 获取工序
            getProcessHttp (processTypeId = '') {
                return this.$api.process.processListRequest({processTypeId: processTypeId, auditState: 3, state: 1}).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item)=>{
                            if (parseInt(item.parentId) !== 0) {
                                item.style = 'margin-left:10px;';
                                item.renderStyle = '10px';
                            }
                        });
                        this.queryBarProcessList = res.data.res;
                    }
                });
            },
            getProcessTypeHttp () {
                return this.$api.dictionary.dictListRequest({ parentCode: 'process_type' }).then(res => {
                    if (res.data.status === 200) {
                        this.queryBarProcessTypList = res.data.res;
                    }
>>>>>>> 1cf4c31a24c82e8d99f3fbd49dffb5beb9ff76cc
                })
              ])
            ]);
          }
        },
        {
          title: '计划开工时间',
          key: 'planStartDate',
          minWidth: 110,
          sortable: true,
          align: 'left'
        }, {
          title: '计划完工时间',
          key: 'planFinishDate',
          minWidth: 110,
          sortable: true,
          align: 'left'
        },
        {
          title: '产品',
          key: 'productCode',
          minWidth: 200,
          sortable: true,
          align: 'left',
          render: (h, params) => {
            return h('div', {
              domProps: {
                innerHTML: params.row.productName ? `${params.row.productName}(${params.row.productCode})` : ''
              }
            });
          }
        },
        {
          title: '批号',
          sortable: true,
          minWidth: 110,
          align: 'left',
          key: 'batchCode'
        },
        {
          title: '计量单位',
          key: 'unitName',
          minWidth: 110,
          sortable: true,
          align: 'left',
          render: (h, params) => {
            return h('div', {
              domProps: {
                innerHTML: params.row.unitName ? `${params.row.unitName}(${params.row.unitCode})` : ''
              }
            })
          }
        },
        {
          title: '生产数量',
          key: 'productionQty',
          minWidth: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '排产机台数量',
          key: 'machineNumber',
          minWidth: 110,
          sortable: true,
          align: 'right'
        },

        {
          title: '生产工序',
          key: 'processName',
          minWidth: 130,
          sortable: true,
          align: 'center'
        },
        {
          title: '所属工段',
          key: 'processTypeName',
          minWidth: 120,
          sortable: true,
          align: 'left'
        },
        {
          title: '生产车间',
          key: 'workshopName',
          minWidth: 110,
          sortable: true,
          align: 'left'
        },
<<<<<<< HEAD
        {
          title: '创建人',
          key: 'createName',
          minWidth: 110,
          sortable: true,
          align: 'center'
        },
        {
          title: '创建日期',
          key: 'createTime',
          minWidth: 150,
          sortable: true,
          align: 'left'
        }
      ],
      tableData: [],
      pageHeights: null,
      toCreated: false
    };
  },
  methods: {
    // 关闭
    closeEvent () {
      let isStartState = false;
      // 了机状态为全部了机,才能进行关闭
      this.checkArr.forEach((item) => {
        if (item.finishState !== 2) { isStartState = true };
      });
      if (this.checkArr.length !== 0) {
        if (!isStartState) {
          this.closeHttp();
        } else {
          emptyTips(this, '全部了机,才能进行关闭!');
        };
      } else {
        noticeTips(this, 'unCheckTips');
      };
    },
    closeHttp () {
      this.$call('prd.notice.close', this.getAllIdMethods(this.checkArr)).then(res => {
        if (res.data.status === 200) {
          this.getMenuHttp();
          this.getListHttp();
          noticeTips(this, 'closeTips');
          this.checkArr = [];
        };
      });
    },
    unCloseEvent () {
      if (this.checkArr.length && this.checkArr.length !== 0) {
        this.$call('prd.notice.unclose', this.getAllIdMethods(this.checkArr)).then(res => {
          if (res.data.status === 200) {
            this.getMenuHttp();
            this.getListHttp();
            noticeTips(this, 'unCloseTips');
            this.checkArr = [];
          };
        });
      } else {
        noticeTips(this, 'unCheckTips');
      };
    },
    // 获取工艺类型
    getProcessTypeEvent (e) {
      this.getProcessHttp(e);
    },
    processModificationEvent (id, isDesigned) {
      this.modificationModalState = true;
      this.spinShow = true;
      this.$call('prd.notice.spec.detailByNoticeId', { id: id }).then(res => {
        if (res.data.status === 200) {
          this.spinShow = false;
          res.data.res.tubeColorIds = JSON.parse(res.data.res.tubeColorIds);
          // 未设计时，上机工艺默认等于设计工艺
          if (!isDesigned) {
            res.data.res.noticeSpecParamList.forEach(item => {
              item.actualVal = item.val;
            });
          };
          this.specSheetDetail = res.data.res;
        };
      })
    },
    modificationModalStateChangeEvent (e) {
      this.modificationModalState = e;
      if (e === false) { this.modificationModalBtnLoading = false; };
    },
    modificationModalConfirmEvent (params) {
      this.saveModificationHttp(JSON.parse(JSON.stringify(params)));
    },
    saveModificationHttp (params) {
      params.noticeSpecParamList.forEach((item) => {
        item.dataType === 1 && item.actualVal ? item.actualVal = (parseInt(item.actualVal * 1000)) / 1000 : false;
        delete item.id;
      });
      params.tubeColorIds = JSON.stringify(params.tubeColorIds);
      params.tubeColorNames = JSON.stringify(params.tubeColorNames);
      this.modificationModalBtnLoading = true;
      this.$call('prd.notice.spec.save', params).then(res => {
        if (res.data.status === 200) {
          this.modificationModalState = false;
          this.modificationModalBtnLoading = false;
          noticeTips(this, 'saveTips');
          this.getMenuHttp();
          this.getListHttp();
        } else {
          this.modificationModalBtnLoading = false;
        };
      })
    },
    modificationModalCancelEvent () {
      this.modificationModalState = false;
    },
    // 反审核的方法
    unAuditEvent (e) {
      let isStartState = false;
      // 已开台和是上机物料不能反审核
      this.checkArr.forEach((item) => { if (item.startState !== 0 || item.isFeedingSetted === true) isStartState = true; });
      if (this.checkArr.length !== 0) {
        // 未开台的才能撤销审核
        if (!isStartState) {
          this.unAuditHttp();
        } else {
          this.$Modal.warning({
            title: '提示',
            content: '已开台或上机物料已设定,不能进行撤销审核!'
          });
        };
      } else {
        noticeTips(this, 'unCheckTips');
      };
    },
    // 反审核
    unAuditHttp () {
      this.$call('prd.notice.unapprove', this.getAllIdMethods(this.checkArr)).then(res => {
        if (res.data.status === 200) {
          this.getMenuHttp();
          this.getListHttp();
          noticeTips(this, 'unAuditTips');
          this.checkArr = [];
        };
      });
    },
    // 审核的事件
    auditEvent () {
      if (this.checkArr.length !== 0) {
        this.auditHttp();
      } else {
        noticeTips(this, 'unCheckTips');
      };
    },
    // 撤销事件
    cancelEvent () {
      if (this.checkArr.length !== 0) {
        this.$api.notice.cancelHttp(this.getAllIdMethods(this.checkArr)).then(res => {
          if (res.data.status === 200) {
            this.getMenuHttp();
            this.getListHttp();
            noticeTips(this, 'cancelTips');
            this.checkArr = [];
          };
        });
      } else {
        noticeTips(this, 'unCheckTips');
      };
    },
    // 提交事件
    pushEvent () {
      if (this.checkArr.length !== 0) {
        // 提交的请求
        this.submitHttp();
      } else {
        noticeTips(this, 'unCheckTips');
      };
    },
    // 获取勾选的对象
    selectionChangeEvent (currentRow) {
      this.checkArr = currentRow;
    },
    // 菜单的点击事件
    getClickMenuEvent (obj) {
      this.pageIndex = 1;
      this.pageTotal = 1;
      this.activeMenuAuditSate = obj.id;
      this.queryBarBillStateValue = obj.id + '';
      this.queryBarNoticeValue = '';
      this.queryBarOrderCodeValue = '';
      this.queryBarBatchCodeValue = '';
      this.queryBarProcessValue = '';
      this.queryBarStartState = null;
      this.queryBarMaterielValue = '';
      this.queryBarDateFrom = '';
      this.queryBarDateTo = '';
      this.getListHttp();
      this.getMenuHttp();
    },
    // 获取左侧菜单
    getMenuHttp () {
      return this.$call('prd.notice.stateCount', {
        workshopId: this.queryBarWorkshopValue
      }).then(res => {
        if (res.data.status === 200) {
          res.data.res.forEach((item) => {
            if (item.id === 0) {
              item.name = '待创建';
            } else if (item.id === 1) {
              item.name = '待提交';
            };
          });
          this.menuArr = res.data.res;
        };
      });
    },
    // 获取每页条数
    getPageSizeEvent (e) {
      this.pageSize = e;
      this.getListHttp();
    },
    // 搜索按钮的事件
    searchButtonClickEvent () {
      this.pageIndex = 1;
      this.pageTotal = 1;
      this.getListHttp();
      this.getMenuHttp();
    },
    // 搜索的请求
    getListHttp () {
      this.queryBarMaterielValue = clearSpace(this.queryBarMaterielValue);
      this.queryBarNoticeValue = clearSpace(this.queryBarNoticeValue);
      this.queryBarOrderCodeValue = clearSpace(this.queryBarOrderCodeValue);
      this.queryBarBatchCodeValue = clearSpace(this.queryBarBatchCodeValue);
      this.queryBarBillStateValue = this.queryBarBillStateValue || '';
      this.queryBarProcessValue = this.queryBarProcessValue || '';
      this.queryBarStartState = this.queryBarStartState || '';
      this.queryBarDateFrom ? this.queryBarDateFrom = formatDate(this.queryBarDateFrom).split(' ')[0] : this.queryBarDateFrom = '';
      this.queryBarDateTo ? this.queryBarDateTo = formatDate(this.queryBarDateTo).split(' ')[0] : this.queryBarDateTo = '';
      this.$call('prd.notice.list', {
        // 'dateFrom': this.queryBarDateFrom,
        // 'dateTo': this.queryBarDateTo,
        'planStartDateFrom': this.queryBarDateFrom,
        'planStartDateTo': this.queryBarDateTo,
        'code': this.queryBarNoticeValue,
        'product': this.queryBarMaterielValue,
        'prdOrderCode': this.queryBarOrderCodeValue,
        'batchCode': this.queryBarBatchCodeValue,
        'workshopId': this.queryBarWorkshopValue,
        'processId': this.queryBarProcessValue,
        'startState': this.queryBarStartState,
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize,
        'processTypeId': this.queryBarProcessTypeValue,
        'auditState': this.queryBarBillStateValue
      }).then(res => {
        if (res.data.status === 200) {
          this.checkArr = [];
          this.tableData = translateState(res.data.res);
          this.pageTotal = res.data.count;
          this.pageTotal = res.data.count;
          this.globalLoadingShow = false;
        };
      });
    },
    // 获取页码事件
    getPageIndex (e) {
      this.pageIndex = e;
      this.getListHttp();
    },
    // 删除的方法
    deleteEvent () {
      if (this.checkArr.length !== 0) {
        this.deleteModalStatus = true;
        this.deleteMsg = '确认删除？';
      } else {
        noticeTips(this, 'unCheckTips');
      };
    },
    // 获取id
    getAllIdMethods (array) {
      return array.map(item => item.id);
    },
    // 删除的确认按钮
    deleteConfirm () {
      this.deleteButtonLoading = true;
      this.$call('prd.notice.delete', this.getAllIdMethods(this.checkArr)).then((res) => {
        if (res.data.status === 200) {
          this.deleteButtonLoading = false;
          this.deleteModalStatus = false;
          this.getListHttp();
          this.getMenuHttp();
          this.checkArr = [];
          noticeTips(this, 'deleteTips');
        } else {
          this.deleteButtonLoading = false;
        };
      });
    },
    // 删除的取消按钮
    deleteCancel () {
      this.deleteModalStatus = false;
      this.deleteButtonLoading = false;
    },
    // 编辑的点击事件
    editClick (id) {
      this.$router.push({
        path: 'editNotice',
        query: {
          id: id,
          activated: true
=======
        activated () {
            _this = this;
            if (!this.toCreated && this.$route.query.activated === true) {
                Object.assign(this.$data, this.$options.data());
                this.getDependentDataHttp();
            }
            this.$nextTick(()=>{ this.calculationTableHeight(); });
            this.$route.query.activated = false;
            this.toCreated = false;
>>>>>>> 1cf4c31a24c82e8d99f3fbd49dffb5beb9ff76cc
        }
      });
    },
    // 提交的请求
    submitHttp () {
      this.$call('prd.notice.submit', this.getAllIdMethods(this.checkArr)
      ).then(res => {
        if (res.data.status === 200) {
          this.getListHttp();
          this.getMenuHttp();
          noticeTips(this, 'submitTips');
          this.checkArr = [];
        };
      });
    },
    // 审核的请求
    auditHttp () {
      this.$call('prd.notice.approve', this.getAllIdMethods(this.checkArr)).then(res => {
        if (res.data.status === 200) {
          this.getListHttp();
          this.getMenuHttp();
          noticeTips(this, 'auditTips');
          this.checkArr = [];
        };
      });
    },
    // 显示更多的事件
    showScreenChange () {
      let tableDom = document.getElementsByClassName('table-bar')[0];
      if (this.showMore) {
        this.showMore = false;
        // 先减去一行的高度
        this.tableHeight = this.tableHeight - 52;
        setTimeout(() => {
          this.tableHeight = compClientHeight(tableDom.offsetTop + 130 + this.pageHeights + 30);
        }, 0);
      } else if (this.showMore === false) {
        this.showMore = true;
        this.tableHeight = this.tableHeight - 52;
        setTimeout(() => {
          this.tableHeight = compClientHeight(tableDom.offsetTop + 130 + this.pageHeights + 30);
        }, 0);
      };
    },
    getWorkshopHttp () {
      return this.$call('user.data.workshops2').then(res => {
        if (res.data.status === 200) {
          let responseData = res.data.res;
          this.queryBarWorkshopValue = responseData.defaultDeptId;
          this.queryBarWorkshopList = responseData.userData;
        }
      });
    },
    // 获取工序
    getProcessHttp (processTypeId = '') {
      return this.$call('process.list', { processTypeId: processTypeId, auditState: 3, state: 1 }).then(res => {
        if (res.data.status === 200) {
          res.data.res.forEach((item) => {
            if (parseInt(item.parentId) !== 0) {
              item.style = 'margin-left:10px;';
              item.renderStyle = '10px';
            }
          })
          this.queryBarProcessList = res.data.res;
        };
      });
    },
    getProcessTypeHttp () {
      return this.$call('dict.list', { parentCode: 'process_type' }).then(res => {
        if (res.data.status === 200) {
          this.queryBarProcessTypList = res.data.res;
        };
      })
    },
    calculationTableHeight () {
      let tableDom = document.getElementsByClassName('table-bar')[0];
      let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
      this.pageHeights = pageHeightDom.offsetHeight + 10;
      this.tableHeight = compClientHeight(tableDom.offsetTop + 130 + this.pageHeights + 30);
      window.onresize = () => {
        this.pageHeights = pageHeightDom.offsetHeight + 10;
        this.tableHeight = compClientHeight(tableDom.offsetTop + 130 + this.pageHeights + 30);
      };
    },
    getDependentDataHttp () {
      this.globalLoadingShow = true;
      (async () => {
        await this.getProcessHttp();
        await this.getWorkshopHttp();
        await this.getProcessTypeHttp();
        await this.getMenuHttp();
        await this.getListHttp();
      })();
    }
  },
  created () {
    this.toCreated = true;
    this.getDependentDataHttp();
  },
  mounted () {
    _this = this;
    this.calculationTableHeight();
  },
  activated () {
    _this = this;
    if (!this.toCreated && this.$route.query.activated === true) {
      Object.assign(this.$data, this.$options.data());
      this.getDependentDataHttp();
    };
    this.$nextTick(() => { this.calculationTableHeight(); });
    this.$route.query.activated = false;
    this.toCreated = false;
  }
};
</script>

<style scoped>
<<<<<<< HEAD
.query-bar-label-width {
  width: 96px;
  text-align: right;
  margin-right: 4px;
}
.query-bar-input-width {
  width: 150px;
}
=======
    .query-bar-input-width{
        width:150px;
    }
>>>>>>> 1cf4c31a24c82e8d99f3fbd49dffb5beb9ff76cc
</style>
