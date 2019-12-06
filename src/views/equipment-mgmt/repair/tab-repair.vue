<template>
  <div>
    <layout
      @on-select="selectMenu"
      :tabTitle="'维修状态'"
      :curTabStateId="curCompletionState"
      :stateList="orderStateList"
    >
      <div slot="content">
        <div class="flexBetween" id="selectedHeight">
          <div class="leftFlex">
            <Button
              v-if="curCompletionState === 0 "
              class="marginBottom marginButtonLeft"
              type="error"
              @click="cancelFaultCall"
              >取消呼叫</Button
            >
            <Button
              icon="md-close"
              v-if="curCompletionState === 2 "
              class="marginBottom"
              type="error"
              @click="handleClose"
              >关闭</Button
            >
            <Button
              icon="md-swap"
              v-if="curCompletionState === 2 "
              class="marginBottom marginButtonLeft"
              type="warning"
              @click="handleUnClose"
              >撤销关闭</Button
            >
          </div>
          <div>
            <Select
              class="formWidth marginBottom"
              v-model="repairMachineWorkshopId"
              placeholder="请选择车间"
            >
              <Option
                v-for="item in workshopList"
                :value="item.deptId"
                :key="item.deptId"
                >{{ item.deptName }}</Option
              >
            </Select>
            <Select
              clearable
              class="formWidth marginBottom"
              v-model="repairMachineProcessId"
              placeholder="请选择工序"
            >
              <Option
                v-for="item in processList"
                :style="item.style"
                :value="item.id"
                :key="item.id"
                >{{ item.name }}</Option
              >
            </Select>
            <Input
              clearable
              v-model="code"
              placeholder="请输入保修单号"
              class="formWidth marginBottom"
            />
            <Input
              clearable
              v-model="repairMachineName"
              placeholder="请输入设备名称"
              class="formWidth marginBottom"
            />
            <Button
              class="marginBottom"
              type="primary"
              icon="ios-search"
              @click="searchMachine"
              >搜索</Button
            >
          </div>
        </div>
        <Table
          :loading="repairMachineLoading"
          :height="tableHeight"
          @on-selection-change="selectRepairData"
          class="marginBottom"
          size="small"
          ref="selection"
          border
          :columns="repairMachineColumns"
          :data="repairMachineData"
        ></Table>
        <Page
          class="textRight"
          :total="repairMachineTotal"
          show-elevator
          :page-size-opts="RepairMachinePageOpts"
          show-total
          :page-size="RepairMachinePageSize"
          @on-change="changePageIndexRepairMachine"
          show-sizer
          @on-page-size-change="changePageSizeRepairMachine"
        ></Page>
      </div>
    </layout>
    <modal
      :isShow="RepairMachineModalShow"
      :loading="RepairMachineModalLoading"
      :width="800"
      @cancel="RepairMachineModalCancel"
      @submit="RepairMachineModalSubmit"
      :isSubmit="isShowSaveCancel"
      :isCancel="isShowSaveCancel"
      :title="'维修清单'"
    >
      <div slot="content">
        <div class="marginBottom padding">
          <div class=" ">
            <Row>
              <Col span="8">
                <p class="">
                  <span class="spanTitle">维修单号：</span
                  ><span class="spanContent">{{
                    repairMachineDetail.code
                  }}</span>
                </p>
              </Col>
              <Col span="8">
                <p class="">
                  <span class="spanTitle">所属车间：</span
                  ><span class="spanContent">{{
                    repairMachineDetail.workshopName
                  }}</span>
                </p>
              </Col>
              <Col span="8">
                <p class="">
                  <span class="spanTitle">所属工序：</span
                  ><span class="spanContent">{{
                    repairMachineDetail.processName
                  }}</span>
                </p>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <p class="">
                  <span class="spanTitle">机台编号：</span
                  ><span class="spanContent">{{
                    repairMachineDetail.machineCode
                  }}</span>
                </p>
              </Col>
              <Col span="8">
                <p class="">
                  <span class="spanTitle">机台名称：</span
                  ><span class="spanContent">{{
                    repairMachineDetail.machineName
                  }}</span>
                </p>
              </Col>
              <Col span="8">
                <p class="">
                  <span class="spanTitle">维修状态：</span
                  ><span class="spanContent">{{
                    repairMachineDetail.completionState
                  }}</span>
                </p>
              </Col>
            </Row>
            <!--<Row>-->
            <!--<Col span="8">-->
            <!--<p class=""><span class="spanTitle">维修状态：</span><span class="spanContent">{{ repairMachineDetail.completionState }}</span></p>-->
            <!--</Col>-->
            <!--&lt;!&ndash;<Col span="8">&ndash;&gt;-->
            <!--&lt;!&ndash;<p><span class="spanTitle">单据状态：</span><span class="spanContent">{{ repairMachineDetail.state }}</span></p>&ndash;&gt;-->
            <!--&lt;!&ndash;</Col>&ndash;&gt;-->
            <!--</Row>-->
          </div>
        </div>
        <div class="">
          <p class="modal-title">§ 呼叫信息</p>
          <div class="padding">
            <div class="">
              <Row>
                <Col span="8">
                  <p>
                    <span class="spanTitle">&nbsp;&nbsp;&nbsp;报修人：</span
                    ><span class="spanContent">{{
                      repairMachineDetail.createName
                    }}</span>
                  </p>
                </Col>
                <Col span="8">
                  <p>
                    <span class="spanTitle">报修时间：</span
                    ><span class="spanContent">{{
                      repairMachineDetail.createTime
                    }}</span>
                  </p>
                </Col>
                <Col span="8">
                  <p>
                    <span class="spanTitle">呼叫类型：</span
                    ><span class="spanContent">{{
                      callClass === null
                        ? ""
                        : callClass === 0
                        ? "手动"
                        : "自动"
                    }}</span>
                  </p>
                </Col>
              </Row>
            </div>
            <div class="marginBottom">
              <Row>
                <Col>
                  <p>
                    <span class="spanTitle">故障描述：</span
                    ><span class="spanContent">{{
                      repairMachineDetail.faultDescription
                    }}</span>
                  </p>
                </Col>
              </Row>
            </div>
            <!-- 维修人信息 -->
            <div class="">
              <Row justify="start" type="flex">
                <Col span="3">
                  <span class="spanTitle">实际维修人员:</span>
                </Col>
                <Col span="19">
                  <Select
                    
                    v-model="actualRepairmanIds"
                    multiple
                    :max-tag-count="6"
                  >
                    <Option
                      v-for="item in userList"
                      :value="item.id"
                      :key="item.id"
                      >{{ item.name }}</Option
                    >
                  </Select>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div>
          <p class="modal-title">§ 维修信息</p>
          <div class="padding">
            <Form :show-message="false">
              <Row class="marginBottom">
                <Col span="8">
                  <p>
                    <span class="spanTitle">&nbsp;&nbsp;&nbsp;维修人：</span
                    ><span class="spanBlock spanContent">{{
                      repairmanName
                    }}</span>
                  </p>
                </Col>
                <Col span="8">
                  <p>
                    <span class="spanTitle">接单时间：</span
                    ><span class="spanBlock spanContent">{{
                      repairmanTime
                    }}</span>
                  </p>
                </Col>
                <Col span="8">
                  <p>
                    <span class="spanTitle">停机维修：</span
                    ><span>
                      <Select clearable class="formWidth" v-model="isShutdown">
                        <Option
                          v-for="(item, index) of isStopMachine"
                          :key="index"
                          :value="item.id"
                          >{{ item.name }}</Option
                        >
                      </Select>
                    </span>
                  </p>
                </Col>
              </Row>
              <Row class="marginBottom">
                <Col span="8">
                  <p>
                    <span class="spanTitle">故障类别：</span
                    ><span class="spanBlock spanContent">{{
                      faultTypeName
                    }}</span>
                  </p>
                  <!--<p><span class="spanTitle">故障类别：</span><span>-->
                  <!--{{ faultTypeName }}-->
                  <!--</span></p>-->
                </Col>
                <Col span="8">
                  <p>
                    <span class="spanTitle">故障小类：</span
                    ><span class="spanBlock spanContent">{{
                      faultSubclassName
                    }}</span>
                  </p>

                  <!--<p><span class="spanTitle">故障小类：</span><span>-->
                  <!--{{ faultSubclassName }}-->
                  <!--</span></p>-->
                </Col>
                <Col span="8">
                  <p>
                    <span class="spanTitle">故障信息：</span
                    ><span class="spanBlock spanContent">{{ faultName }}</span>
                  </p>
                  <!--<p><span class="spanTitle">故障信息：</span><span>-->
                  <!--{{ faultName }}-->
                  <!--</span></p>-->
                </Col>
              </Row>
              <Row class="marginBottom">
                <Col span="8">
                  <p>
                    <span class="spanTitle">开始时间：</span
                    ><span>
                      <DatePicker
                        :clearable="false"
                        format="yyyy-MM-dd HH:mm:ss"
                        :value="beginTime"
                        class="formWidth"
                        type="datetime"
                        placeholder="..."
                      ></DatePicker>
                    </span>
                  </p>
                </Col>
                <Col span="8">
                  <p>
                    <span class="spanTitle">结束时间：</span
                    ><span>
                      <DatePicker
                        :disabled="isEndTime"
                        :readonly="isEndTime"
                        :value="endTime"
                        class="formWidth"
                        type="datetime"
                        placeholder="..."
                      ></DatePicker>
                    </span>
                  </p>
                </Col>
                <Col span="8">
                  <p>
                    <span class="spanTitle">故障原因：</span
                    ><span>
                      <Select
                        clearable
                        class="formWidth"
                        v-model="faultCauseId"
                      >
                        <Option
                          v-for="(item, index) of faultCauseList"
                          :key="index"
                          :value="item.id"
                          >{{ item.name }}</Option
                        >
                      </Select>
                    </span>
                  </p>
                </Col>
              </Row>
              <Row class="marginBottom">
                <Col span="8">
                  <p>
                    <span class="spanTitle">更换配件：</span
                    ><span>
                      <Select class="formWidth" v-model="isReplace">
                        <Option
                          v-for="(item, index) of isStopMachine"
                          :key="index"
                          :value="item.id"
                          >{{ item.name }}</Option
                        >
                      </Select>
                    </span>
                  </p>
                </Col>
                <Col span="16">
                  <p class="spanTitle">
                    <span>维修描述：</span
                    ><span>
                      <Input
                        style="width: 395px;"
                        v-model="repairDescription"
                        type="textarea"
                        :rows="1"
                        placeholder="..."
                      />
                    </span>
                  </p>
                  <!--<FormItem class="formItemMargin"  label="维修描述：">-->
                  <!--<Input style="width: 637px;" v-model="repairDescription" type="textarea" :rows="2" placeholder="..." />-->
                  <!--</FormItem>-->
                </Col>
              </Row>
              <!--<Row class="marginBottom">-->
              <!--<Col>-->
              <!--<p class="spanTitle"><span class="spanDescription spanTitle">维修描述：</span><span>-->
              <!--<Input style="width: 637px;" v-model="repairDescription" type="textarea" :rows="2" placeholder="..." />-->
              <!--</span></p>-->
              <!--&lt;!&ndash;<FormItem class="formItemMargin"  label="维修描述：">&ndash;&gt;-->
              <!--&lt;!&ndash;<Input style="width: 637px;" v-model="repairDescription" type="textarea" :rows="2" placeholder="..." />&ndash;&gt;-->
              <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
              <!--</Col>-->
              <!--</Row>-->
            </Form>
          </div>
        </div>
        <other-message
          :createName="createName"
          :closeName="closeName"
          :createTime="createTime"
          :closeTime="closeTime"
          :updateName="reverseName"
          :updateTime="reverseTime"
        >
        </other-message>
        <!--</div>-->
      </div>
    </modal>
    <delete-warning
      :v-model="deleteWarnShow"
      :tipMsg="deleteWarnMsg"
      :loading="deleteWarnLoading"
      @cancel="deleteWarnCancel"
      @confirm="deleteWarnConfirm"
    ></delete-warning>
    <Row>
      <Col>
        <see-parts
          :spinShow="spinShow"
          :seePartsModalState="seePartsModalState"
          :seePartsTableData="seePartsTableData"
          :seePartsLoading="seePartsLoading"
          @seePartsCancelEvent="seePartsCancelEvent"
          @visibleChangeEvent="visibleChangeEvent"
        >
        </see-parts>
      </Col>
    </Row>
  </div>
</template>
<script>
import AboutTime from '../../public/AboutTime';
import deleteWarning from '../../public/deleteWarning';
import publicJs from '../../../libs/common';
import layout from '../../layout';
import { completionState } from '../../../libs/utilState';
import modal from '../../public/modal';
import otherMessage from '../../components/otherMessage';
import seeParts from '../upkeep/components/see-parts';
export default {
  name: 'tab-repair',
  components: {
    layout,
    AboutTime,
    otherMessage,
    modal,
    deleteWarning,
    seeParts
  },
  computed: {
    rightItems () {
      return this.$store.state.moduleRightItems;
    }
  },
  data () {
    return {
      callClass: 0,
      faultName: '',
      faultSubclassName: '',
      faultTypeName: '',
      spinShow: false,
      seePartsModalState: false,
      seePartsTableData: [],
      seePartsLoading: false,
      modal1: true,
      // 条件搜索
      repairMachineWorkshopId: '',
      workshopList: [],
      repairMachineProcessId: '',
      processList: [],
      code: '',
      orderStateTypeId: 0,
      orderStateList: completionState,
      repairMachineName: '',
      // tab数据
      tableHeight: '',
      repairMachineData: [],
      repairMachineLoading: false,
      repairMachineColumns: [],
      isShowMessage: false,
      repairMachineColumnsBasic: [
        {
          type: 'selection',
          fixed: 'left',
          width: 60,
          align: 'center'
        },
        {
          title: '操作',
          key: 'operation',
          align: 'center',
          fixed: 'left',
          width: 80,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  size: 'small'
                },
                style: {
                  // display: ((this.curCompletionState === 0) && this.rightItems.receipt) ? 'inline-block' : 'none',
                  display: (this.curCompletionState === 0) ? 'inline-block' : 'none',
                  marginRight: '4px'
                },
                on: {
                  'click': () => {
                    this.isShowMessage = true;
                    this.curRepairMachineId = params.row.id;
                    this.repairmanTime = this.repairTime;
                    this.isEndTime = true;
                    this.endTime = '';
                    this.isShowSaveCancel = true;
                    this.clearData();
                  }
                }
              }, '接单'),
              h('Button', {
                props: {
                  size: 'small'
                },
                style: {
                  marginRight: '4px',
                  // display: ((this.curCompletionState === 1) && this.rightItems.completed) ? 'inline-block' : 'none'
                  display: ((this.curCompletionState === 1)) ? 'inline-block' : 'none'
                },
                on: {
                  'click': () => {
                    this.isEndTime = false;
                    this.endTime = this.repairTime;
                    this.curRepairMachineId = params.row.id;
                    this.isShowSaveCancel = true;
                    this.clearData();
                    this.getuserListData()
                  }
                }
              }, '维修完成'),
              h('Button', {
                props: {
                  size: 'small',
                  disabled: params.row.isReplace !== 1
                },
                style: {
                  // display: ((this.curCompletionState === 1) && this.rightItems.application) ? 'inline-block' : 'none',
                  marginRight: '4px',
                  display: ((this.curCompletionState === 1)) ? 'inline-block' : 'none',
                },
                on: {
                  'click': () => {
                    // this.curRepairMachineId = params.row.id;
                    this.$router.push({
                      path: 'addPartsReplace',
                      query: {
                        activated: true,
                        isUpkRep: 2,
                        id: params.row.id
                      }
                    });
                  }
                }
              }, '配件申请'),
              h('Button', {
                props: {
                  size: 'small',
                  disabled: params.row.isReplace !== 1
                },
                style: {
                  // display: ((this.curCompletionState === 1) && this.rightItems.view) ? 'inline-block' : 'none',
                  display: ((this.curCompletionState === 1)) ? 'inline-block' : 'none',
                  marginRight: '4px'
                },
                on: {
                  'click': () => {
                    this.seePartsEvent(params.row.code);
                  }
                }
              }, '配件查看')
            ]);
          }
        },
        {
          title: '报修单号',
          key: 'code',
          align: 'left',
          minWidth: 120,
          fixed: 'left',
          render: (h, params) => {
            return h('a', {
              on: {
                'click': () => {
                  if (this.curCompletionState === 0) {
                    this.isShowSaveCancel = false;
                  } else if (params.row.auditState === '已关闭') {
                    this.isShowSaveCancel = false;
                  } else {
                    this.isShowSaveCancel = true;
                  }
                  this.isEdit = true;
                  this.curRepairMachineId = params.row.id;
                  this.repairmanTime = this.repairTime;
                  this.isEndTime = true;
                  this.endTime = '';
                  this.clearData();
                }
              }
            }, params.row.code);
          }
        },
        {
          title: '设备名称',
          key: 'machineName',
          align: 'left',
          minWidth: 100,
          fixed: 'left'
        },
        {
          title: '设备编号',
          key: 'machineCode',
          align: 'left',
          minWidth: 100
        },
        {
          title: '故障类别',
          key: 'faultTypeName',
          align: 'left',
          minWidth: 110
        },
        {
          title: '故障小类',
          key: 'faultSubclassName',
          align: 'left',
          minWidth: 100
        },
        {
          title: '故障信息',
          key: 'faultName',
          align: 'left',
          minWidth: 100
        },
        {
          title: '工序',
          key: 'processName',
          align: 'center',
          minWidth: 100
        },
        {
          title: '呼叫类型',
          key: 'callClass',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('span', {}, params.row.callClass === null ? '' : (params.row.callClass === 0 ? '手动' : '自动'));
          }
        },
        {
          title: '单据状态',
          key: 'auditState',
          align: 'center',
          minWidth: 100
        },
        {
          title: '车间',
          key: 'workshopName',
          align: 'left',
          minWidth: 100
        },
        {
          title: '报修人',
          key: 'createName',
          align: 'center',
          minWidth: 100
        },
        {
          title: '报修时间',
          key: 'createTime',
          align: 'left',
          minWidth: 150
        },
        {
          title: '维修人',
          key: 'repairmanName',
          align: 'center',
          minWidth: 100
        },
        {
          title: '接单时间',
          key: 'beginTime',
          align: 'left',
          minWidth: 150
        }
      ],
      // 分页参数
      repairMachineTotal: 0,
      RepairMachinePageOpts: publicJs.pageOpts,
      RepairMachinePageSize: publicJs.pageSize,
      RepairMachinePageIndex: 1,
      // 当前维修状态
      curCompletionState: 0,
      // 提示
      deleteWarnShow: false,
      deleteWarnMsg: '',
      deleteWarnLoading: false,
      // modal
      RepairMachineModalShow: false,
      RepairMachineModalLoading: false,
      RepairMachineModalMessage: '',
      // model
      faultCallMachineModel: {
        time: '',
        user: '',
        isStop: '',
        describe: ''
      },
      isStopMachine: [
        {
          id: 1,
          name: '是'
        },
        {
          id: 0,
          name: '否'
        }
      ],
      createTime: '',
      createName: '',
      reverseTime: '',
      reverseName: '',
      closeName: '',
      closeTime: '',
      faultCauseList: [],
      repairmanId: '',
      repairmanName: '',
      repairmanTime: '',
      faultCauseId: '',
      isReplace: 1,
      isShutdown: 1,
      faultTypeId: '',
      repairDescription: '',
      repairMachineDetail: {},
      repairTime: '',
      beginTime: '',
      endTime: '',
      // 故障类型
      faultCallTypeList: [],
      curRepairMachineId: '',
      isEndTime: true,
      // 是否维修完成
      isFinishFaultCall: false,
      // 选择关闭的机器
      curSelectRepairMachine: [],
      // 是否显示保存取消按钮
      isShowSaveCancel: true,
      // 警告的三个判断
      isCancel: false,
      isClose: false,
      isUnClose: false,
      // 是否是编辑状态
      isEdit: false,
      //   user
      userList: [],
      actualRepairmanIds: [],
      actualRepairmanNames: [],
      actualRepairmanNamesList: []
    };
  },
  methods: {
    getuserListData () {
      this.$api.manufacture.userList().then(res => {
        if (res.data.status === 200) {
          this.userList = res.data.res.filter((item) => item.onJob === true)
          this.actualRepairmanIds = this.userList.id
        }
      })
    },
    seePartsEvent (code) {
      this.spinShow = true;
      this.seePartsModalState = true;
      this.seePartsLoading = true;
      this.$api.parts.upkeepPartsList({
        'sourceCode': code
      }).then(res => {
        if (res.data.status === 200) {
          this.spinShow = false;
          this.seePartsLoading = false;
          this.seePartsTableData = res.data.res;
        };
      });
    },
    seePartsCancelEvent () {
      this.seePartsModalState = false;
    },
    visibleChangeEvent (e) {
      this.seePartsModalState = e;
      if (e === false) { this.spinShow = false; };
    },
    // 选择选项卡
    selectMenu (val) {
      this.code = '';
      this.repairMachineName = '';
      this.repairMachineProcessId = '';
      this.curCompletionState = val.id;
      this.RepairMachinePageIndex = 1;
      setTimeout(() => {
        this.repairMachineTotal = 1;
      }, 0);
      if (val.id === 0) {
        this.repairMachineColumns = this.repairMachineColumnsBasic.map(item => {
          if (item.key === 'operation') {
            item.width = 150;
          }
          return item;
        });
      } else if (val.id === 1) {
        this.repairMachineColumns = this.repairMachineColumnsBasic.filter(x => x.type === undefined).map(item => {
          if (item.key === 'operation') {
            item.width = 250;
          }
          return item;
        });
      } else {
        this.repairMachineColumns = this.repairMachineColumnsBasic.filter(x => x.key !== 'operation');
      }
      this.isShowSaveCancel = true;
      this.curSelectRepairMachine = [];
      this.getRepairList();
    },
    // 改变页数
    changePageIndexRepairMachine (val) {
      this.RepairMachinePageIndex = val;
    },
    // 改变页的数量
    changePageSizeRepairMachine (val) {
      this.RepairMachinePageSize = val;
    },
    // 清空数据
    clearData () {
      this.repairmanName = '';
      this.repairmanId = '';
      this.beginTime = this.repairTime;
      this.isReplace = 0;
      this.isShutdown = 1;
      this.faultTypeId = '';
      this.faultCauseId = '';
      this.repairDescription = '';
      this.getRepairOrderDetail();
    },
    // 获取维修工单详情
    getRepairOrderDetail () {
      const _this = this;
      this.$api.repair.getRepairOrderDetail({ 'id': this.curRepairMachineId }).then(res => {
        let content = res.data;
        if (content.status === 200) {
          _this.callClass = content.res.callClass;
          _this.repairMachineDetail = content.res;
          _this.repairMachineDetail.state = content.res.auditState === 1 ? '创建' : '关闭';
          _this.repairMachineDetail.completionState = _this.orderStateList.find(x => x.id === content.res.completionState).name;
          _this.repairmanName = content.res.repairmanName;
          _this.repairmanTime = content.res.repairmanTime === null ? _this.repairmanTime : content.res.repairmanTime;
          _this.repairmanId = content.res.repairmanId;
          _this.faultTypeName = content.res.faultTypeName;
          _this.faultName = content.res.faultName;
          _this.faultSubclassName = content.res.faultSubclassName;
          _this.beginTime = content.res.beginTime === null ? this.beginTime : content.res.beginTime;
          _this.endTime = content.res.endTime === null ? this.endTime : content.res.endTime;
          // this.isEndTime = content.res.endTime === null ? true : false;
          _this.isReplace = content.res.isReplace === null ? this.isReplace : content.res.isReplace;
          _this.isShutdown = content.res.isShutdown === null ? this.isShutdown : content.res.isShutdown;
          _this.faultTypeId = content.res.faultTypeId;
          _this.faultCauseId = content.res.faultCauseId === null ? '' : content.res.faultCauseId;
          _this.repairDescription = content.res.repairDescription;
          _this.createName = content.res.createName;
          _this.reverseName = _this.curCompletionState === 0 ? '' : content.res.updateName;
          _this.createTime = content.res.createTime;
          _this.reverseTime = _this.curCompletionState === 0 ? '' : content.res.updateTime;
          // 获取故障原因
          _this.getRepairCause(content.res.faultTypeId);
        }
      });
      this.RepairMachineModalShow = true;
    },
    // 搜索维修单
    searchMachine () {
      this.RepairMachinePageIndex = 1;
      setTimeout(() => {
        this.repairMachineTotal = 1;
      }, 0);
      this.getRepairList();
      this.getCompletionState();
    },
    // 选择关闭的机器
    selectRepairData (val) {
      this.curSelectRepairMachine = val;
    },
    // 获取故障原因
    getRepairCause (id) {
      this.$api.fault.getFaultType({ faultTypeId: id }).then(res => {
        let content = res.data;
        if (content.status === 200) {
          this.faultCauseList = content.res;
        }
      });
    },
    // 获取维修数据
    getRepairList () {
      let params = {
        pageIndex: this.RepairMachinePageIndex,
        pageSize: this.RepairMachinePageSize,
        workshopId: this.repairMachineWorkshopId,
        processId: this.repairMachineProcessId,
        code: this.code.trim(),
        completionState: this.curCompletionState,
        machineName: this.repairMachineName.trim()
      };
      this.repairMachineLoading = true;
      this.$call('repair.order.list', params).then(res => {
        let content = res.data;
        this.repairMachineLoading = false;
        if (content.status === 200) {
          this.repairMachineTotal = content.count;
          this.repairMachineData = content.res.map(item => {
            item.state = completionState.find(x => x.id === item.completionState).name;
            item.auditState = item.auditState === 1 ? '创建' : '已关闭';
            return item;
          });
        }
      });
    },
    // 提示区域 ----开始
    deleteWarnCancel () {
      this.deleteWarnLoading = false;
      this.deleteWarnShow = false;
      this.isCancel = false;
      this.isUnClose = false;
      this.isClose = false;
    },
    deleteWarnConfirm () {
      if (this.curCompletionState === 0) {
        this.isCancel = false;
        this.deleteWarnLoading = true;
        let ids = this.curSelectRepairMachine.map(x => x.id);
        this.$api.repair.getRepairCancel(ids).then(res => {
          let content = res.data;
          this.deleteWarnLoading = false;
          this.deleteWarnShow = false;
          if (content.status === 200) {
            this.getCompletionState();
            this.$Message.success('取消成功');
            this.getRepairList();
          }
        });
      }
      if (this.curCompletionState === 2) {
        let ids = this.curSelectRepairMachine.map(item => item.id);
        let params = {
          ids: ids,
          auditState: this.isClose === true ? 4 : 1
        };
        this.$api.repair.getRepairClose(params).then(res => {
          this.getRepairList();
          this.getCompletionState();
          this.deleteWarnShow = false;
          this.curSelectRepairMachine = [];
          this.$Message.success('操作成功');
        });
      }
    },
    // 提示区域 ----结束
    // modal ----开始
    RepairMachineModalCancel () {
      this.RepairMachineModalShow = false;
      this.isEdit = false;
    },
    RepairMachineModalSubmit () {
      let params = {
        id: this.curRepairMachineId,
        repairmanName: this.repairmanName,
        completionState: this.curCompletionState,
        repairmanId: this.repairmanId,
        machineId: this.repairMachineDetail.machineId,
        repairmanTime: this.repairTime,
        beginTime: this.beginTime,
        endTime: this.endTime,
        isShutdown: this.isShutdown,
        isReplace: this.isReplace,
        faultTypeId: this.faultTypeId,
        faultCauseId: this.faultCauseId,
        faultCauseName: this.faultCauseId === '' ? '' : this.faultCauseList.find(x => x.id === this.faultCauseId).name,
        repairDescription: this.repairDescription,
        actualRepairmanIds: JSON.stringify(this.actualRepairmanIds),
        actualRepairmanNames: JSON.stringify(this.userList.filter((x) => this.actualRepairmanIds.includes(x.id)).map((y) => y.name))
      };
      // 接单  || 维修完成
      if ((this.curCompletionState === 0) || (this.curCompletionState === 1 && !this.isEdit)) {
        this.RepairMachineModalLoading = true;
        this.$api.repair.getRepairOrderTake(params).then(res => {
          let content = res.data;
          this.RepairMachineModalLoading = false;
          this.RepairMachineModalShow = false;
          if (content.status === 200) {
            this.getRepairList();
            this.getCompletionState();
            this.$Message.success('保存成功');
          }
        });
      }
      // 编辑
      if ((this.curCompletionState === 1 && this.isEdit) || (this.curCompletionState === 2 && this.isEdit)) {
        this.isEdit = false;
        this.RepairMachineModalLoading = true;
        this.$api.repair.getRepairOrderSave(params).then(res => {
          let content = res.data;
          this.RepairMachineModalLoading = false;
          this.RepairMachineModalShow = false;
          if (content.status === 200) {
            this.getRepairList();
            this.getCompletionState();
            this.$Message.success('编辑成功');
          }
        });
      }
    },
    // 改变故障类型
    changeFaultType (val) {
      this.getRepairCause(val);
      this.faultCauseId = '';
    },
    // 获取工序
    getFaultCallProcess () {
      const _this = this;
      publicJs.processLevel().then(res => {
        _this.processList = res;
      });
    },
    // 获取当前时间
    getStartTime () {
      var mydate = new Date();
      var y = mydate.getFullYear();
      var m = mydate.getMonth() + 1;
      var d = mydate.getDate();
      if (m < 10) {
        m = '0' + m;
      }
      if (d < 10) {
        d = '0' + d;
      }
      const h = mydate.getHours() < 10 ? '0' + mydate.getHours() + ':' : mydate.getHours() + ':';
      const mi = mydate.getMinutes() < 10 ? '0' + mydate.getMinutes() + ':' : mydate.getMinutes() + ':';
      const s = mydate.getSeconds() < 10 ? '0' + mydate.getSeconds() : mydate.getSeconds();
      return this.repairTime = y + '-' + m + '-' + d + ' ' + h + mi + s;
    },
    // 获取故障类型
    getFaultCallType () {
      this.$fetch('dict/list', { parentcode: 'fault_type' }).then((res) => {
        let content = res.data;
        if (content.status === 200) {
          this.faultCallTypeList = content.res;
        }
      });
    },
    // 获取维修状态
    getCompletionState () {
      this.$call('repair.order.stateCount', { workshopId: this.repairMachineWorkshopId }).then((res) => {
        let content = res.data;
        if (content.status === 200) {
          this.orderStateList.map(item => {
            item.count = content.res.find(x => x.id === item.id).count;
            return item;
          });
        }
      });
    },
    // 关闭
    handleClose () {
      if (this.curSelectRepairMachine.length === 0) {
        return false;
      }
      this.isUnClose = false;
      this.isClose = true;
      this.deleteWarnShow = true;
      this.deleteWarnMsg = '确定要关闭吗？';
    },
    // 反关闭
    handleUnClose () {
      if (this.curSelectRepairMachine.length === 0) {
        return false;
      }
      this.isClose = false;
      this.isUnClose = true;
      this.deleteWarnShow = true;
      this.deleteWarnMsg = '确定要反关闭吗？';
    },
    // 取消呼叫
    cancelFaultCall () {
      let ids = this.curSelectRepairMachine.map(x => x.id);
      if (ids.length === 0) {
        this.deleteWarnLoading = false;
        this.$Modal.warning({
          title: '提示',
          content: '请选择数据'
        });
        return false;
      } else {
        this.deleteWarnShow = true;
        this.deleteWarnMsg = '确定要取消呼叫吗？';
      }
    }
  },
  created () {
    this.repairMachineColumns = this.repairMachineColumnsBasic.map(item => {
      if (item.key === 'operation') {
        item.width = 150;
      }
      return item;
    });
    // 开始时间
    this.getStartTime();
    // 获取工序
    this.getFaultCallProcess();
    // 获取故障类型
    this.getFaultCallType();
    // 获取所有的车间
    this.$api.dept.getWorkshopList().then((res) => {
      let content = res.data;
      this.workshopList = content.res;
      if (content.res.length > 0) {
        if (content.res.find(x => x.isDefault === 1)) {
          this.repairMachineWorkshopId = content.res.find(x => x.isDefault === 1).deptId;
        } else {
          this.repairMachineWorkshopId = content.res[0].deptId;
        }
        // 获取维修状态
        this.getCompletionState();
        this.getRepairList();
      } else {
        // 该用户没有权限访问
        this.repairMachineData = [];
      }
    });
  },
  updated () {
    let H = document.getElementById('selectedHeight').clientHeight;
    this.tableHeight = document.documentElement.clientHeight - H - 220;
  },
  mounted () {
    window.onresize = () => {
      let Height = document.getElementById('selectedHeight').clientHeight;
      this.tableHeight = document.documentElement.clientHeight - Height - 220;
    };
  }
};
</script>

<style scoped>
.spanTitle {
  /*vertical-align: top;*/
  /*line-height: 32px;*/
  font-size: 12px;
  font-weight: bold;
}
.spanDescription {
  position: relative;
  top: -8px;
}
.spanBlock {
  background-color: #f9f9f9;
  width: 152px;
  height: 32px;
  line-height: 32px;
  border-radius: 3px;
}
.spanContent {
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  display: inline-block;
  padding-left: 8px;
}
.formWidth {
  width: 152px;
}
.formItem {
  margin: 0;
}
.borderBottom {
  border-bottom: 1px solid #9b9b9b;
}
.padding {
  padding: 0 20px;
}
.border {
  border: 1px solid #999;
  border-radius: 5px;
}
.modal-title {
  padding: 5px 0px 5px 20px;
  display: inline-block;
  width: 100%;
  /*background-color: #f1f1f1;*/
  border-bottom: 1px solid #dddddd;
  font-size: 14px;
  margin: 20px 10px 10px 0;
  font-weight: 600;
}
</style>
