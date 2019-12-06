<template>
  <div>
    <Modal
      v-model="showModal"
      :title="saveModalTitle"
      @on-visible-change="onVisibleChangeEvent"
      :width="1300"
      :mask-closable="false"
      :styles="{ top: '50px' }"
    >
      <modal-content-loading
        :spinShow="saveModalSpinShow"
      ></modal-content-loading>
      <Form
        :label-width="100"
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :show-message="false"
      >
        <Row>
          <Col span="6">
            <FormItem label="申请单号：" class="formItemMargin">
              <div class="exhibitionInputBackground">
                {{ formValidate.code }}
              </div>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="申请日期：" prop="date" class="formItemMargin">
              <DatePicker
                v-model="formValidate.date"
                type="date"
                placeholder="请选择申请日期"
                class="widthPercentage"
                @on-change="getDateEvent"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem
              label="生产车间："
              prop="workshopId"
              class="formItemMargin"
            >
              <Select
                label-in-value
                v-model="formValidate.workshopId"
                placeholder="请选择生产车间"
                @on-change="getWorkshopEvent"
              >
                <Option
                  v-for="item in saveModalWorkshopList"
                  :value="item.deptId"
                  :key="item.deptId"
                  >{{ item.deptName }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="班次：" class="formItemMargin" prop="shiftId">
              <Select
                v-model="formValidate.shiftId"
                placeholder="请选择班次"
                @on-change="getShiftEvent"
              >
                <Option
                  v-for="item in formValidate.shiftList"
                  :value="item.shiftId"
                  :key="item.shiftId"
                  >{{ item.shiftName }}</Option
                >
              </Select>
            </FormItem>
          </Col>
          <!-- <Col span="12">
                        <FormItem label="打包工：" prop="packerIds" class="formItemMargin">
                            <Select v-model="formValidate.packerIds" placeholder="请选择打包工" @on-change="getPackerNamesEvent" multiple filterable :max-tag-count="3">
                                <Option v-for="item in formValidate.userList" :value="item.id" :key="item.id">{{ `${item.name}(${item.code})` }}</Option>
                            </Select>
                        </FormItem>
                    </Col> -->
          <Col>
            <FormItem label="备注：" class="formItemMargin">
              <Input
                v-model="formValidate.remarks"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 1 }"
                placeholder="请输入..."
                :maxlength="remarksLength"
              />
            </FormItem>
          </Col>
        </Row>
        <Row v-if="saveModalShowOther">
          <Col span="6">
            <FormItem label="入库状态：" class="formItemMargin">
              <div class="exhibitionInputBackground">
                {{ formValidate.inStockStateName }}
              </div>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="入库时间：" class="formItemMargin">
              <div class="read-only-item">{{ formValidate.inStockTime }}</div>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="是否被引用：" class="formItemMargin">
              <div class="exhibitionInputBackground">
                {{ formValidate.isQuote ? "是" : "否" }}
              </div>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem
              label="单据状态："
              class="formItemMargin"
              :label-width="140"
            >
              <div class="exhibitionInputBackground">
                {{ formValidate.auditStateName }}
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <Tabs v-model="activeTabPane">
              <TabPane label="基本信息" name="0">
                <Table
                  :height="500"
                  border
                  size="small"
                  :columns="tableHeader"
                  :data="tableData"
                ></Table>
                <div class="flex-right">
                  <p class="line-height-30">合计：</p>
                  <div class="flex-left">
                    <p class="total-packer-item line-height-30">
                      {{ formValidate.totalNumber }}
                    </p>
                    <p class="total-empty-item line-height-30"></p>
                    <p class="total-qty-item line-height-30">
                      {{ formValidate.totalQty }}
                    </p>
                    <p class="total-remark-item line-height-30"></p>
                  </div>
                </div>
              </TabPane>
              <TabPane label="其他信息" name="1" v-if="saveModalShowOther">
                <operation-log :operationData="operationData"></operation-log>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Form>
      <div slot="footer" class="modal-footer-box">
        <Button
          :disabled="isDisableConfirm"
          type="success"
          :loading="saveModalButtonLoading"
          @click="saveModalConfirmEvent"
        >
          保存</Button
        >
        <Button
          type="info"
          class="margin-left-10"
          @click="saveAndSubmitEvent"
          :loading="saveAndSubmitButtonLoading"
          >保存并提交</Button
        >
        <Button class="cancelButton" @click="saveModalCancelEvent">取消</Button>
      </div>
    </Modal>
    <select-product-modal
      :selectMaterialModalState="selectMaterialModalState"
      :showMaterialCategory="showMaterialCategory"
      :selectMaterialPageTotal="selectMaterialPageTotal"
      :spinShow="selectProductModalSpinShow"
      :selectMaterielModalTableData="selectMaterielModalTableData"
      @on-visible-change="selectMaterialModalStateChangeEvent"
      @select-material-modal-search-event="selectMaterialModalSearchBtnEvent"
      @on-change-page="getSelectMaterialModalPageCodeEvent"
      @confirm-event="selectMaterialConfirmEvent"
    ></select-product-modal>
    <select-batch-code-modal
      :spinShow="selectBatchModalSpinShow"
      :selectBatchModalState="selectBatchModalState"
      :selectBatchModalTableData="selectBatchModalTableData"
      :selectBatchPageTotal="selectBatchPageTotal"
      @on-visible-change="selectBatchModalStateChangeEvent"
      @on-change-page="getSelectBatchModalPageCodeEvent"
      @select-batch-modal-search-event="selectBatchModalSearchBtnEvent"
      @select-batch-modal-confirm-event="selectBatchModalConfirmEvent"
    >
    </select-batch-code-modal>
    <add-batch-code-modal
      :addBatchModalState="addBatchModalState"
      :addBatchModalProductCodeItem="addBatchModalProductCodeItem"
      :addBatchCodeModalConfirmBtnLoading="addBatchCodeModalConfirmBtnLoading"
      @on-visible-change="addBatchCodeModalVisibleChangeEvent"
      @add-batch-code-modal-confirm-event="addBatchCodeModalConfirmEvent"
    >
    </add-batch-code-modal>
    <!-- SPA搜索弹框 -->
    <Modal
      v-model="isSpaShow"
      title="选择SPA单号"
      @on-ok="spaOk"
      @on-cancel="spaCancel"
    >
      <Row>
        <Col span="24">
          <Table
            :height="600"
            border
            :columns="spaJobCodeHeader"
            :data="screenSpaJobCodeList"
          ></Table>
        </Col>
      </Row>
      <Row>
        <Col class="pageStyle">
          <Page
            show-total
            :page-size ='5'
            :total="spaJobPageTotal"
            @on-change="spaJobPageSizeChange"
            size="small"
            :current="spaJobPageIndex"
          ></Page>
        </Col>
      </Row>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import modalFooter from '../../components/modal-footer';
import selectProductModal from '../../production-order/order/select-material';
import { noticeTips, getOperationData, setPage, addNum, setInputLength, formatDate, mathJsDiv, emptyTips } from '../../../libs/common';
import modalContentLoading from '../../components/modal-content-loading';
import operationLog from '../../components/modal-operation-log';
import selectBatchCodeModal from '../../production-order/bom/components/select-batch-modal';
import addBatchCodeModal from '../../production-order/bom/components/add-batch-modal';
export default {
  components: { modalFooter, selectProductModal, modalContentLoading, operationLog, selectBatchCodeModal, addBatchCodeModal },
  props: {
    saveModalTitle: {
      type: String
    },
    saveModalSpinShow: {
      type: Boolean
    },
    saveModalDetailData: {
      type: Object
    },
    saveModalState: {
      type: Boolean,
      default: false
    },
    isDisableConfirm: {
      type: Boolean,
      default: false
    },
    saveModalButtonLoading: {
      type: Boolean,
      default: false
    },
    saveAndSubmitButtonLoading: {
      type: Boolean,
      default: false
    },
    saveModalWorkshopList: {
      type: Array
    },
    saveModalDefaultWorkshop: {
      type: Number
    },
    saveModalShowOther: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const validateDateTimeValue = (rule, value, callback) => { value ? callback() : callback(new Error()); };
    const validateWorkshopValue = (rule, value, callback) => { value ? callback() : callback(new Error()); };
    const validatePackerIds = (rule, value, callback) => { value && value.length !== 0 ? callback() : callback(new Error()); };
    const validateShiftId = (rule, value, callback) => { value ? callback() : callback(new Error()); };
    return {
        defaulrPageSize: 10,
      addBatchCodeModalConfirmBtnLoading: false,
      addBatchModalProductCodeItem: {},
      addBatchModalState: false,
      tableIndex: null,
      selectBatchModalPageIndex: 1,
      selectBatchPageTotal: 0,
      selectBatchModalTableData: [],
      selectBatchModalState: false,
      selectBatchModalSpinShow: false,
      remarksLength: setInputLength.remarks,
      pageIndex: 1,
      selectProductModalName: '',
      operationData: [],
      activeTabPane: '0',
      selectMaterialPageTotal: 0,
      selectMaterielModalTableData: [],
      showMaterialCategory: false,
      selectProductModalSpinShow: false,
      selectMaterialModalState: false,
      remoteProductList: [],
      showModal: false,
      formValidate: {
        code: '',
        date: '',
        workshopId: null,
        workshopName: '',
        totalQty: null,
        remarks: '',
        packerIds: []
      },
      ruleValidate: {
        date: [{ required: true, validator: validateDateTimeValue, trigger: 'change' }],
        workshopId: [{ required: true, validator: validateWorkshopValue, trigger: 'change' }],
        packerIds: [{ required: true, validator: validatePackerIds, trigger: 'change' }],
        shiftId: [{ required: true, validator: validateShiftId, trigger: 'change' }]
      },
      workshopList: [],
      tableHeader: [
        { title: '序号', type: 'index', width: 80, align: 'center' },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          width: 90,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  size: 'small',
                  icon: 'md-add'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.addButtonClick(params.index);
                  }
                }
              }),
              h('Button', {
                props: {
                  size: 'small',
                  icon: 'md-remove'
                },
                style: {},
                on: {
                  click: () => {
                    this.reduceButtonClick(params.index);
                  }
                }
              })
            ]);
          }
        },
        {
          title: '产品',
          key: 'productCode',
          minWidth: 160,
          render: (h, params) => {
            return h('div', {
              style: {
                display: 'flex',
                paddingTop: '2px'
              }
            }, [
              h('Select', {
                props: {
                  value: params.row.productCode,
                  icon: 'ios-search',
                  filterable: true,
                  transfer: true,
                  placeholder: '请输入产品编号或名称'
                },
                on: {
                  'on-change': (e) => {
                    this.saveModalGetSelectProductEvent(e, params);
                  }
                }
              }, params.row.remoteProductList.map((item) => {
                return h('Option', {
                  props: {
                    value: item.code,
                    label: item.label
                  }
                });
              })),
              h('Button', {
                props: {
                  icon: 'ios-search',
                  size: 'small'
                },
                style: {
                  marginLeft: '-2px',
                  zIndex: '99'
                },
                on: {
                  'click': () => {
                    this.searchProductIconEvent(params.index);
                  }
                }
              })
            ]);
          }
        },
        {
          title: 'SPA工单号码',
          key: 'spaJobCode',
          minWidth: 160,
          render: (h, params) => {
            return h('div', {
              style: {
                display: 'flex',
                paddingTop: '2px'
              }
            }, [
              h('Select', {
                props: {
                  value: params.row.productCode,
                  icon: 'ios-search',
                  filterable: true,
                  transfer: true,
                  placeholder: '选择SPA工单号'
                },
                on: {
                  'on-change': (e) => {
                    // this.saveModalGetSelectProductEvent(e, params);

                  }
                }
              }, this.spaJobCodeList.map((item) => {
                return h('Option', {
                  props: {
                    value: item.code,
                    label: item.erpCode
                  }
                });
              })),
              h('Button', {
                props: {
                  icon: 'ios-search',
                  size: 'small'
                },
                style: {
                  marginLeft: '-2px',
                  zIndex: '99'
                },
                on: {
                  'click': () => {
                    // this.searchProductIconEvent(params.index);
                    this.isSpaShow = true
                  }
                }
              })
            ]);
          }
        },
        {
          title: '单位',
          key: 'unitName',
          align: 'left',
          width: 90,
          render: (h, params) => {
            return h('div', {
              domProps: {
                innerHTML: params.row.unitName ? `${params.row.unitName}(${params.row.unitCode})` : ''
              }
            });
          }
        },
        {
          title: '批号',
          key: 'batchCode',
          align: 'left',
          minWidth: 170,
          render: (h, params) => {
            return h('div', {
              style: {
                display: 'flex',
                paddingTop: '2px'
              }
            }, [
              h('Select', {
                props: {
                  value: params.row.batchCode,
                  icon: 'ios-search',
                  filterable: true,
                  transfer: true,
                  placeholder: '请输入批号',
                  disabled: !params.row.productCode
                },
                on: {
                  'on-change': (e) => {
                    if (e) {
                      params.row.batchCode = e;
                      this.tableData[params.index] = params.row;
                    }
                  }
                }
              }, params.row.remoteBatchCodeList.map((item) => {
                return h('Option', {
                  props: {
                    value: item.batchCode,
                    label: item.batchCode
                  }
                });
              })),
              h('Button', {
                props: {
                  icon: 'ios-search',
                  size: 'small',
                  disabled: !params.row.productCode
                },
                style: {
                  marginLeft: '-2px',
                  zIndex: '99'
                },
                on: {
                  'click': () => {
                    this.clickSearchBatchIconButtonEvent(params.row.productCode, params.index);
                  }
                }
              }),
              h('Tooltip', {
                props: {
                  transfer: true,
                  content: '点击新增批号'
                },
                style: {
                  display: 'flex'
                }
              }, [
                h('Button', {
                  props: {
                    icon: 'ios-create',
                    size: 'small',
                    disabled: !params.row.productCode
                  },
                  style: {
                    height: '32px',
                    marginLeft: '4px'
                  },
                  on: {
                    click: () => {
                      this.addBatchIconButtonEvent(params.row, params.index);
                    }
                  }
                })
              ])
            ]);
          }
        },
        {
          title: '申请入库包数',
          key: 'packNumber',
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h('div', [
              h('InputNumber', {
                props: {
                  value: params.row.packNumber,
                  min: 1
                },
                style: { width: '100%' },
                on: {
                  'on-change': (e) => {
                    if (e) {
                      params.row.packNumber = e;
                      this.tableData[params.index] = params.row;
                      if (e && params.row.qty) {
                        this.$set(params.row, 'packetWeight', mathJsDiv(params.row.qty, e));
                      };
                      let totalNumber = 0;
                      this.tableData.forEach((item) => {
                        totalNumber = addNum(totalNumber, item.packNumber);
                      });
                      this.$set(this.formValidate, 'totalNumber', totalNumber);
                      this.tableData[params.index] = params.row;
                    };
                  }
                }
              })
            ]);
          }
        },
        { title: '平均包重', key: 'packetWeight', width: 120 },
        {
          title: '申请入库重量',
          key: 'qty',
          align: 'center',
          width: 120,
          render: (h, params) => {
            return h('div', [
              h('InputNumber', {
                props: {
                  value: params.row.qty,
                  min: 1
                },
                style: { width: '100%' },
                on: {
                  'on-change': (e) => {
                    params.row.qty = e;
                    this.tableData[params.index] = params.row;
                    if (e && params.row.packNumber) {
                      this.$set(params.row, 'packetWeight', mathJsDiv(e, params.row.packNumber));
                    };
                    let totalQty = 0;
                    this.tableData.forEach((item) => {
                      totalQty = addNum(totalQty, item.qty);
                    });
                    this.$set(this.formValidate, 'totalQty', totalQty);
                    this.tableData[params.index] = params.row;
                  }
                }
              })
            ]);
          }
        },
        {
          title: '备注',
          key: 'remarks',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h('Input', {
                props: {
                  value: params.row.remarks
                },
                on: {
                  'on-change': (e) => {
                    params.row.remarks = e.target.value;
                    this.tableData[params.index] = params.row;
                  }
                }
              })
            ]);
          }
        }
      ],
      tableData: [],
      initTableData: {
        productId: null,
        productName: '',
        productModels: '',
        unitId: null,
        unitCode: '',
        unitName: '',
        productCode: '',
        processId: null,
        processCode: '',
        processName: '',
        remoteProductList: [],
        productList: [],
        remoteBatchCodeList: [],
        batchCodeList: [],
        batchCode: '',
        qty: 0,
        remarks: '',
        packNumber: 0,
        totalQty: 0,
        isReused: null,
        componentId: '',
        componentName: '',
        materialRatio: '',
        packetWeight: 0
      },
      spaJobCodeList: [],
      isSpaShow: false,
      spaJobCodeHeader: [
        { title: 'SAP工单号码', key: 'erpCode', width: 160, align: 'center' },
        { title: ' 订单号', key: 'code', width: 160, align: 'center' },
        { title: '产品', key: 'productName', width: 165, align: 'center' },

      ],
      spaJobPageSize: 0,
      spaJobPageTotal: 0,
      spaJobPageIndex: 1,
      auditState: 3,
      screenSpaJobCodeList: []

    };
  },
  methods: {
    spaOk () {
      this.isSpaShow = false
    },
    spaCancel () {
      this.isSpaShow = false
    },
    getSpaJobListData () {
      this.$api.manufacture.prdOrderList().then(res => {
        if (res.data.status === 200) {
          this.spaJobCodeList = res.data.res
          this.spaJobPageTotal = res.data.count
          //  if(this.auditState===3 && this.formValidate.workshopId ===1018){
          this.screenSpaJobCodeList = res.data.res
          //  }
      
          console.log(this.screenSpaJobCodeList, 'this.spaJobCodeList');

        }
      })
    },
    spaJobPageSizeChange (val) {
      // console.log(e);
      this.spaJobPageIndex = val
      console.log(this.spaJobPageIndex, '');


    },
    // 获取班次
    getShiftEvent (e) {
      if (e) {
        this.formValidate.shiftList.forEach(item => {
          if (item.shiftId === e) {
            this.formValidate.shiftName = item.shiftName;
          };
        });
      };
    },
    getPackerNamesEvent (arr) {
      if (arr && arr.length !== 0) {
        this.formValidate.packerNames = [];
        this.formValidate.userList.forEach(item => {
          arr.forEach(selectItem => {
            if (item.id === selectItem) {
              this.formValidate.packerNames.push(item.name);
            };
          });
        });
      } else {
        this.formValidate.packerIds = [];
        this.formValidate.packerNames = [];
      };
    },
    // 获取申请日期
    getDateEvent (e) {
      if (e && this.formValidate.workshopId) {
        console.log(this.formValidate.workshopId, 'this.formValidate.workshopIdthis.formValidate.workshopId');

        this.getScheduleRequest();
      };
    },

    // 获取班次
    getScheduleRequest () {
      this.$call('schedule.list3', {
        belongDate: formatDate(this.formValidate.date).split(' ')[0],
        workshopId: this.formValidate.workshopId
      }).then(res => {
        if (res.data.status === 200) {
          if (res.data.res.length !== 0) {
            this.formValidate.shiftList = res.data.res;
          } else {
            this.formValidate.shiftId = null;
            this.formValidate.shiftName = '';
            this.formValidate.shiftList = [];
          };
        };
      });
    },
    selectBatchModalSearchBtnEvent (e) {
      this.selectBatchModalPageIndex = 1;
      this.selectBatchPageTotal = 1;
      this.getProductToBatchCodeListHttp(this.selectBatchModalProductCode, e.name, this.selectBatchModalPageIndex, setPage.pageSize).then(res => {
        if (res.data.status === 200) {
          this.selectBatchModalTableData = res.data.res;
          this.selectBatchPageTotal = res.data.count;
        };
      });
    },
    // 新增批号modal
    addBatchCodeModalConfirmEvent (batchCode) {
      this.$set(this.tableData[this.tableIndex], 'batchCode', '');
      this.tableData[this.tableIndex].remoteBatchCodeList.push({ batchCode: batchCode });
      setTimeout(() => {
        this.$set(this.tableData[this.tableIndex], 'batchCode', batchCode);
        this.addBatchModalState = false;
      }, 200);
    },
    addBatchCodeModalVisibleChangeEvent (e) {
      this.addBatchModalState = e;
    },
    selectBatchModalStateChangeEvent (e) {
      this.selectBatchModalState = e;
    },
    selectBatchModalConfirmEvent (event) {
      this.selectBatchModalState = false;
      this.$set(this.tableData[this.tableIndex], 'batchCode', '');
      this.$set(this.tableData[this.tableIndex], 'batchCodeList', [{ batchCode: event.batchCode }]);
      setTimeout(() => {
        this.$set(this.tableData[this.tableIndex], 'batchCode', event.batchCode);
      }, 200);
    },
    getSelectBatchModalPageCodeEvent (event) {
      this.selectBatchModalPageIndex = event.pageIndex;
      this.getProductToBatchCodeListHttp(this.selectBatchModalProductCode, event.name, this.selectBatchModalPageIndex).then(res => {
        if (res.data.status === 200) {
          this.selectBatchPageTotal = res.data.count;
          this.selectBatchModalTableData = res.data.res;
        };
      });
    },
    // 新增批号modal
    addBatchIconButtonEvent (rowObj, rowIndex) {
      this.tableIndex = rowIndex;
      this.addBatchModalProductCodeItem = rowObj;
      this.addBatchModalState = true;
    },
    // 批号的搜索按钮事件
    clickSearchBatchIconButtonEvent (productCode, rowIndex) {
      this.tableIndex = rowIndex;
      this.selectBatchModalProductCode = productCode;
      this.selectBatchModalState = true;
      this.selectBatchModalPageIndex = 1;
      this.selectBatchPageTotal = 1;
      this.getProductToBatchCodeListHttp(this.selectBatchModalProductCode).then(res => {
        if (res.data.status === 200) {
          this.selectBatchPageTotal = res.data.count;
          this.selectBatchModalTableData = res.data.res;
        };
      });
    },
    // 获取物料对应的批号
    getProductToBatchCodeListHttp (productCode, batchCode = '', pageIndex = '', pageSize = setPage.pageSize) {
      return this.$call('product.batch.list', {
        productNameCode: productCode,
        batchCode: batchCode,
        auditState: 3,
        pageIndex: pageIndex,
        pageSize: pageSize
      });
    },
    saveAndSubmitEvent () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          if (this.formValidate.shiftName) {
            this.$emit('saveAndSubmitEvent', {
              ...this.formValidate,
              inStockApplyDetailList: this.tableData
            });
          } else {
            emptyTips(this, '申请日期没有排班不能提交!');
          };
        } else {
          noticeTips(this, 'unCompleteTips');
        };
      });
    },
    getWorkshopEvent (e) {
      if (e) {
        this.formValidate.workshopId = e.value;
        this.formValidate.workshopName = e.label;
        if (this.formValidate.date) {
          this.getScheduleRequest();
        };
      };
    },
    // 获取页码事件
    getSelectMaterialModalPageCodeEvent (e) {
      this.pageIndex = e.pageIndex;
      this.getViceProductHttp().then(res => {
        if (res.data.status === 200) {
          res.data.res.forEach((item) => {
            this.$set(item, 'label', `${item.name}(${item.code})`);
          });
          this.selectMaterialPageTotal = res.data.count;
          this.selectMaterielModalTableData = res.data.res;
          this.selectProductModalSpinShow = false;
        };
      });
    },
    selectMaterialModalSearchBtnEvent (e) {
      this.selectProductModalName = e.name;
      this.pageIndex = 1;
      this.selectMaterialPageTotal = 1;
      this.getViceProductHttp().then(res => {
        if (res.data.status === 200) {
          res.data.res.forEach((item) => {
            this.$set(item, 'label', `${item.name}(${item.code})`);
          });
          this.selectMaterialPageTotal = res.data.count;
          this.selectMaterielModalTableData = res.data.res;
          this.selectProductModalSpinShow = false;
        };
      });
    },
    selectMaterialConfirmEvent (item) {
      // 获取物料对应的批号
      this.getProductToBatchCodeListHttp(item.code, '', '', '', '').then(res => {
        if (res.data.status === 200) {
          this.$set(this.tableData[this.tableIndex], 'remoteBatchCodeList', res.data.res);
          this.$set(this.tableData[this.tableIndex], 'batchCode', '');
          this.$set(this.tableData[this.tableIndex], 'batchCodeList', []);
          this.$set(this.tableData[this.tableIndex], 'productId', item.id);
          this.$set(this.tableData[this.tableIndex], 'productName', item.name);
          this.$set(this.tableData[this.tableIndex], 'productModels', item.models);
          this.$set(this.tableData[this.tableIndex], 'processId', item.processId);
          this.$set(this.tableData[this.tableIndex], 'processCode', item.processCode);
          this.$set(this.tableData[this.tableIndex], 'processName', item.processName);
          this.$set(this.tableData[this.tableIndex], 'unitId', item.unitId);
          this.$set(this.tableData[this.tableIndex], 'unitCode', item.unitCode);
          this.$set(this.tableData[this.tableIndex], 'unitName', item.unitName);
          this.$set(this.tableData[this.tableIndex], 'componentId', item.componentId);
          this.$set(this.tableData[this.tableIndex], 'componentName', item.componentName);
          this.$set(this.tableData[this.tableIndex], 'materialRatio', item.materialRatio);
          this.$set(this.tableData[this.tableIndex], 'isReused', item.isReused);
          this.selectMaterialModalState = false;
          let productItem = {};
          this.tableData[this.tableIndex].productList = this.tableData[this.tableIndex].remoteProductList.filter((item) => {
            if (item.code.toLowerCase().indexOf(item.code.toLowerCase()) > -1) {
              productItem = item;
            };
            return productItem;
          });
          this.$set(this.tableData[this.tableIndex], 'productCode', item.code);
        };
      });
    },
    selectMaterialModalStateChangeEvent (e) {
      this.selectMaterialModalState = e;
      if (e === false) this.selectProductModalName = '';
    },
    // 选择产品输入框事件
    searchProductIconEvent (index) {
      this.tableIndex = index;
      this.selectProductModalSpinShow = true;
      this.selectMaterialModalState = true;
      this.getViceProductHttp().then(res => {
        if (res.data.status === 200) {
          res.data.res.forEach((item) => {
            this.$set(item, 'label', `${item.name}(${item.code})`);
          });
          this.selectMaterialPageTotal = res.data.count;
          this.selectMaterielModalTableData = res.data.res;
          this.selectProductModalSpinShow = false;
        };
      });
    },
    saveModalGetSelectProductEvent (e, params) {
      if (e) {
        params.row.productCode = e;
        params.row.batchCode = '';
        params.row.batchCodeList = [];
        params.row.remoteProductList.forEach((item) => {
          if (item.code === e) {
            this.$set(params.row, 'productId', item.id);
            this.$set(params.row, 'productCode', item.code);
            this.$set(params.row, 'productName', item.name);
            this.$set(params.row, 'productModels', item.models);
            this.$set(params.row, 'processId', item.processId);
            this.$set(params.row, 'processCode', item.processCode);
            this.$set(params.row, 'processName', item.processName);
            this.$set(params.row, 'unitId', item.unitId);
            this.$set(params.row, 'unitCode', item.unitCode);
            this.$set(params.row, 'unitName', item.unitName);
            this.$set(params.row, 'componentId', item.componentId);
            this.$set(params.row, 'componentName', item.componentName);
            this.$set(params.row, 'materialRatio', item.materialRatio);
            this.$set(params.row, 'isReused', item.isReused);
          };
        });
        // 获取物料对应的批号
        this.getProductToBatchCodeListHttp(e, '', '', '', '').then(res => {
          if (res.data.status === 200) {
            params.row.remoteBatchCodeList = res.data.res;
            this.tableData[params.index] = params.row;
          };
        });
      }
    },
    saveModalCancelEvent () {
      this.$emit('saveModalCancelEvent');
    },
    saveModalConfirmEvent () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.$emit('saveModalConfirmEvent', {
            ...this.formValidate,
            inStockApplyDetailList: this.tableData
          });
        } else {
          noticeTips(this, 'unCompleteTips');
        };
      });
    },
    onVisibleChangeEvent (e) {
      if (e === false) {
        this.activeTabPane = '0';
      };
      this.$emit('onVisibleChangeEvent', e);
    },
    // 新增和编辑内表格的添加事件
    addButtonClick (index) {
      this.tableData.splice(index + 1, 0, JSON.parse(JSON.stringify(this.initTableData)));
    },
    // 新增和编辑内表格的减少事件
    reduceButtonClick (index) {
      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1);
        let totalNumber = 0;
        let totalQty = 0;
        this.tableData.forEach((item) => {
          totalNumber = addNum(totalNumber, item.packNumber);
          totalQty = addNum(totalQty, item.qty);
        });
        this.$set(this.formValidate, 'totalNumber', totalNumber);
        this.$set(this.formValidate, 'totalQty', totalQty);
      };
    },
    // 副产品 
    getViceProductHttp () {
      return this.$call('product.list.fu', {
        pageSize: setPage.pageSize,
        pageIndex: this.pageIndex,
        name: this.selectProductModalName
      });
    }
  },
  created () {
    this.getSpaJobListData()
    this.getViceProductHttp()
    this.getViceProductHttp().then(res => {
      if (res.data.status === 200) {
        res.data.res.forEach((item) => { this.$set(item, 'label', `${item.name}(${item.code})`); });
        this.initTableData.remoteProductList = res.data.res;
        this.remoteProductList = res.data.res;

      };
    });
  },
  watch: {
    saveModalState (newData, oldData) {
      this.showModal = newData;
    },
    saveModalDetailData (newData, oldData) {
      if (Object.keys(newData).length !== 0) {
        this.formValidate = newData;
        if (this.saveModalShowOther) { this.operationData = getOperationData(newData); };
        newData.inStockApplyDetailList.forEach((allProductItem) => {
          this.$set(allProductItem, 'remoteProductList', JSON.parse(JSON.stringify(this.remoteProductList)));
        });
        this.tableData = newData.inStockApplyDetailList;
      };
    }
  }
};
</script>
<style scoped lang="less">
@width_total: 120px;
.line-height-30 {
  line-height: 30px;
}
.total-packer-item {
  width: @width_total;
  border: solid 1px #dcdee2;
  border-top: none;
  text-align: right;
  border-right: none;
  padding: 0 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.total-empty-item {
  width: @width_total;
  border: solid 1px #dcdee2;
  border-top: none;
  text-align: right;
  border-right: none;
}
.total-qty-item {
  width: @width_total;
  border: solid 1px #dcdee2;
  border-top: none;
  text-align: right;
  border-right: none;
  padding: 0 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.total-remark-item {
  width: 150px;
  border: solid 1px #dcdee2;
  border-top: none;
  text-align: right;
}
.modal-footer-box {
  display: flex;
  justify-content: flex-end;
}
</style>
