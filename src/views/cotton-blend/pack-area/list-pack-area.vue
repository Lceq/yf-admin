<template>
  <Card>
    <Row type="flex" justify="space-between">
      <Col span="12" class="headerMargin flex-left">
        <div class="queryBarMarginRight">
          <Button icon="md-add" type="primary" @click="addEvent">新增</Button>
        </div>
        <div class="queryBarMarginRight">
          <Dropdown trigger="click" @on-click="getDropAuditEvent">
            <Button type="primary">
              审核
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem name="审核">审核</DropdownItem>
              <DropdownItem name="反审核">反审核</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <Button icon="ios-trash" type="error" @click="deleteEvent">删除</Button>
      </Col>
      <Col class="flex-left">
        <Select
          clearable
          v-model="queryBarWorkshopId"
          placeholder="请选择车间"
          class="queryBarMarginRight searchHurdles"
        >
          <Option
            v-for="item in workshopList"
            :value="item.deptId"
            :key="item.deptId"
          >{{ item.deptName }}</Option>
        </Select>
        <Select
          clearable
          v-model="queryBarTypeId"
          placeholder="请选择抓包方式"
          class="queryBarMarginRight searchHurdles"
        >
          <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <Select
          clearable
          v-model="queryBarAuditStateId"
          placeholder="请选择数据状态"
          class="queryBarMarginRight searchHurdles"
        >
          <Option v-for="item in auditStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
        <Input
          v-model="searchValue"
          placeholder="请输入编号或名称"
          class="queryBarMarginRight searchHurdles"
        />
        <Button
          icon="ios-search"
          type="primary"
          @click="searchButtonClickEvent"
          class="queryButtonStyle"
        >搜索</Button>
      </Col>
    </Row>
    <Row class="margin-top-10 tableOffsetTop">
      <Col>
        <Table
          :height="tableHeight"
          size="small"
          border
          :columns="tableHeader"
          :data="tableData"
          @on-selection-change="getCheckObjEvent"
        ></Table>
      </Col>
    </Row>
    <tips-modal
      :v-model="deleteModalStatus"
      :tipMsg="deleteModalMsg"
      :loading="deleteButtonLoading"
      @cancel="deleteModalCancel"
      @confirm="deleteModalConfirm"
    ></tips-modal>
    <save-modal
      :selectMachineModalProcessList="processList"
      :saveModalState="saveModalState"
      :showOther="showOther"
      :saveModalData="saveModalData"
      :saveModalTitle="saveModalTitle"
      @on-visible-change="saveModalStateChangeEvent"
      @on-confirm="saveConfirmEvent"
      @on-cancel="saveCancelEvent"
    ></save-modal>
  </Card>
</template>
<script>
import tipsModal from "../../public/deleteWarning";
import {
  compClientHeight,
  noticeTips,
  translateState,
  emptyTips
} from "../../../libs/common";
import saveModal from "./save-modal";
export default {
  components: { tipsModal, saveModal },
  data() {
    return {
      processList: [],
      queryBarAuditStateId: "",
      auditStateList: [],
      queryBarTypeId: null,
      queryBarWorkshopId: null,
      machineList: [],
      typeList: [],
      workshopId: null,
      workshopName: "",
      workshopList: [],
      queryBarParamType: null,
      saveModalData: {},
      paramsTypeList: [
        {
          paramType: 1,
          paramTypeName: "腰绳"
        },
        {
          paramType: 2,
          paramTypeName: "封包绳"
        }
      ],
      searchValue: "",
      saveModalState: false,
      deleteButtonLoading: false,
      editId: "",
      buttonLoading: false,
      tableHeight: 0,
      showOther: false,
      formValidate: {},
      deleteModalStatus: false,
      deleteModalMsg: "",
      saveModalTitle: "",
      tableHeader: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "编号",
          key: "code",
          sortable: true,
          minWidth: 130,
          render: (h, params) => {
            return h("a", {
              domProps: {
                innerHTML: params.row.code
              },
              props: {
                size: "small"
              },
              on: {
                click: () => {
                  this.editEvent(params.row.id);
                }
              }
            });
          }
        },
        {
          title: "名称",
          key: "name",
          sortable: true,
          minWidth: 130
        },
        {
          title: "车间",
          key: "workshopName",
          sortable: true,
          minWidth: 130
        },
        {
          title: "抓包方式",
          key: "typeName",
          sortable: true,
          minWidth: 130
        },
        {
          title: "机台",
          key: "machineName",
          sortable: true,
          minWidth: 130
        },
        {
          title: "内圈包数",
          key: "innerPacketNumber",
          align: "right",
          sortable: true,
          minWidth: 130
        },
        {
          title: "外圈包数",
          key: "outerPacketNumber",
          align: "right",
          sortable: true,
          minWidth: 130
        },
        {
          title: "行数",
          key: "rowNumber",
          align: "right",
          sortable: true,
          minWidth: 130
        },
        {
          title: "列数",
          key: "columnNumber",
          align: "right",
          sortable: true,
          minWidth: 130
        },
        {
          title: "数据状态",
          key: "auditStateName",
          align: "center",
          sortable: true,
          minWidth: 100
        },
        {
          title: "创建人",
          key: "createName",
          sortable: true,
          minWidth: 100
        },
        {
          title: "创建时间",
          key: "createTime",
          sortable: true,
          minWidth: 150
        }
      ],
      tableData: [],
      checkArray: []
    };
  },
  methods: {
    // 审核菜单事件
    getDropAuditEvent(e) {
      if (this.checkArray && this.checkArray.length !== 0) {
        if (e === "审核") {
          if (this.validatorState(1).switchState) {
            this.approveRequest(this.validatorState().ids);
          } else {
            emptyTips(this, "只有创建状态下才能审核!");
          }
        } else {
          if (this.validatorState(3).switchState) {
            this.unApproveRequest(this.validatorState().ids);
          } else {
            emptyTips(this, "只有审核状态下才能反审核!");
          }
        }
      } else {
        noticeTips(this, "unCheckTips");
      }
    },
    // 验证是否允许审核等操作
    validatorState(state) {
      let switchState = true;
      let ids = this.checkArray.map(item => {
        if (item.auditState !== state) switchState = false;
        return item.id;
      });
      return {
        ids: ids,
        switchState: switchState
      };
    },
    // 反审核请求
    unApproveRequest(ids) {
      this.$call("packing.area.cancel", ids).then(res => {
        if (res.data.status === 200) {
          noticeTips(this, "unAuditTips");
          this.getListRequest();
        }
      });
    },
    approveRequest(ids) {
      this.$call("packing.area.approve", ids).then(res => {
        if (res.data.status === 200) {
          noticeTips(this, "auditTips");
          this.getListRequest();
        }
      });
    },
    // 搜索事件
    searchButtonClickEvent() {
      this.searchValue = this.searchValue.trimStart();
      this.searchValue = this.searchValue.trimEnd();
      this.getListRequest();
    },
    saveConfirmEvent() {
      this.getListRequest();
      this.saveModalState = false;
    },
    saveCancelEvent() {
      this.saveModalState = false;
    },
    saveModalStateChangeEvent(e) {
      this.saveModalState = e;
    },
    // 获取勾选的对象
    getCheckObjEvent(e) {
      this.checkArray = e;
    },
    // 删除的方法
    deleteEvent() {
      if (this.checkArray.length !== 0) {
        if (this.validatorState(1).switchState) {
          this.deleteModalStatus = true;
          this.deleteModalMsg = "确认删除?";
        } else {
          emptyTips(this, "只有创建状态下才能删除!");
        }
      } else {
        noticeTips(this, "unCheckTips");
      }
    },
    // 删除提示框的确认按钮
    deleteModalConfirm() {
      this.deleteButtonLoading = true;
      this.$call("packing.area.delete", this.validatorState(1).ids).then(
        res => {
          if (res.data.status === 200) {
            this.deleteButtonLoading = false;
            this.deleteModalMsg = "";
            noticeTips(this, "deleteTips");
            this.deleteModalStatus = false;
            this.getListRequest();
            this.checkArray = [];
          } else {
            this.deleteButtonLoading = false;
          }
        }
      );
    },
    deleteModalCancel() {
      this.deleteModalMsg = "";
      this.deleteButtonLoading = "";
      this.deleteModalStatus = false;
    },
    // 编辑的方法
    editEvent(id) {
      this.showOther = true;
      this.editId = id;
      this.saveModalTitle = "编辑排包区域";
      this.$call("packing.area.detail", { id: id }).then(res => {
        if (res.data.status === 200) {
          let responseData = res.data.res;
          this.saveModalState = true;
          this.getMachineListRequest(responseData.workshopId).then(res => {
            if (res.data.status === 200) {
              responseData.machineList = res.data.res;
              responseData.typeList = JSON.parse(JSON.stringify(this.typeList));
              responseData.workshopList = JSON.parse(
                JSON.stringify(this.workshopList)
              );
              this.saveModalData = responseData;
            }
          });
        }
      });
    },
    getListRequest() {
      this.$call("packing.area.list", {
        name: this.searchValue,
        paramType: this.queryBarParamType,
        workshopId: this.queryBarWorkshopId,
        typeId: this.queryBarTypeId,
        auditState: this.queryBarAuditStateId
      }).then(res => {
        if (res.data.status === 200) {
          this.tableData = translateState(res.data.res);
          this.checkArray = [];
        }
      });
    },
    // 新增的方法
    addEvent() {
      this.saveModalData = {
        code: "",
        name: "",
        workshopId: JSON.parse(JSON.stringify(this.workshopId)),
        workshopName: JSON.parse(JSON.stringify(this.workshopName)),
        workshopList: JSON.parse(JSON.stringify(this.workshopList)),
        typeId: null,
        typeList: JSON.parse(JSON.stringify(this.typeList)),
        machineList: JSON.parse(JSON.stringify(this.machineList)),
        innerPacketNumber: 0,
        outerPacketNumber: 0,
        rowNumber: 0,
        columnNumber: 0,
        packingAreaMachineList: [],
        isPremix: false
      };
      this.editId = "";
      this.showOther = false;
      this.saveModalTitle = "新增排包区域";
      this.saveModalState = true;
    },
    calculationTableHeight() {
      let tableDom = document.getElementsByClassName("tableOffsetTop")[0];
      this.tableHeight = compClientHeight(tableDom.offsetTop + 180);
      window.onresize = () => {
        this.tableHeight = compClientHeight(tableDom.offsetTop + 180);
      };
    },
    getWorkshopHttp(resolve, reject) {
      return this.$call("user.data.workshops2").then(res => {
        if (res.data.status === 200) {
          let responseData = res.data.res;
          this.workshopId = responseData.defaultDeptId;
          this.queryBarWorkshopId = responseData.defaultDeptId;
          this.workshopName = responseData.defaultDeptName;
          this.workshopList = responseData.userData;
          resolve(res);
        }
      });
    },
    // 获取抓包方式
    getTypeListRequest(resolve, reject) {
      return this.$call("dict.list", { parentCode: "grabbing_type" }).then(
        res => {
          if (res.data.status === 200) {
            let responseData = res.data.res;
            resolve(res);
            this.typeList = responseData;
          }
        }
      );
    },
    // 获取数据状态列表
    getAuditStateListRequest(resolve, reject) {
      return this.$call("enum.audit.state3").then(res => {
        if (res.data.status === 200) {
          let responseData = res.data.res;
          resolve(res);
          this.auditStateList = responseData;
        }
      });
    },
    getMachineListRequest(workshopId) {
      return this.$call("machine.cardingList", {
        workshopId: workshopId,
        typeId: 26,
        processCode: "QH"
      });
    },
    getProcessListRequest(resolve, reject) {
      return this.$api.process.getSearchProcessList().then(res => {
        this.processList = res;
        resolve(res);
      });
    }
  },
  created() {
    let workshopList = new Promise((resolve, reject) =>
      this.getWorkshopHttp(resolve, reject)
    );
    let typeList = new Promise((resolve, reject) =>
      this.getTypeListRequest(resolve, reject)
    );
    let auditStateList = new Promise((resolve, reject) =>
      this.getAuditStateListRequest(resolve, reject)
    );
    let processList = new Promise((resolve, reject) =>
      this.getProcessListRequest(resolve, reject)
    );
    Promise.all([workshopList, typeList, auditStateList, processList]).then(
      res => {
        this.getMachineListRequest(this.workshopId).then(res => {
          if (res.data.status === 200) {
            this.machineList = res.data.res;
          }
        });
        this.getListRequest();
      }
    );
  },
  mounted() {
    this.$nextTick(() => {
      this.calculationTableHeight();
    });
  }
};
</script>
