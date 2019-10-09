// 字典管理
const _dircCateURL = 'dict/category/list';
const _dircSaveURL = 'dict/save';
const _dircListURL = 'dict/list?parentcode=';
const _dircDeleteURL = 'dict/delete';
const _dircDetailURL = 'dict/detail/';
const _dicFaultTypeURL = 'dict/list';
// 工序管理
const _processListURL = 'process/list?parentid=';
const _processSaveURL = 'process/save';
const _processDetailURL = 'process/detail/';
const _processDeleteURL = 'process/delete/';
const _processEnableURL = 'process/enable/';
const _processDisableURL = 'process/disable/';
const _processTypeURL = 'dict/list?parentcode=process_type';
// 岗位管理
const _postList = 'post/list';
const _postDetailURL = 'post/detail/';
const _postDeleteURL = 'post/delete/';
const _postSaveURL = 'post/save';
const _postParentCodeURL = 'dict/list?parentcode=post_type';
const _postProTypeURL = 'process/list';
// 员工管理
const _loginMsgURL = 'user/info';
const _empList = 'user/list';
const _empListURL = 'user/list?deptid=';
const _empSaveURL = 'user/save';
const _empDeleteURL = 'user/delete/';
const _empDetailURL = 'user/detail/';
const _empDeptURL = 'dept/list';
const _empPostURL = 'post/list';
const _empSearchURL = 'user/search?name=';
const _empPageURL = 'user/list?deptid=';
const _userSetPassword = 'user/setpwd?id=';
const _userOnjob = 'user/onjob?result=false&id=';
const _userRecoveryInser = 'user/onjob?result=true&id=';
const _userEnable = 'user/enable';
const _userDisable = 'user/disable';

// 角色管理
const _roleListManager = 'role/list';
const _roleSaveManager = 'role/save';
const _roleDeleURL = 'role/delete/';
const _roleUserAddURL = 'role/user/add?roleid=';
const _roleUserListURL = 'user/list';
const _roleUserDeleURL = 'role/user/remove?roleid=';
// 模块管理
const _moduleListManager = 'module/list';
const _moduleSaveManager = 'module/save';
const _moduleDelete = 'module/delete/';
// 模块角色
const _moduleAddRole = 'module/role/add?moduleid=';
const _moduleRemoveRole = 'module/role/remove?moduleid=';
const _moduleRoleList = 'role/list';
// 模块用户
const _moduleUserList = 'user/list';
const _moduleUserAddList = 'module/user/add?moduleid=';
const _moduleUserRemoveList = 'module/user/remove?moduleid=';
// 班制管理
const _shiftManager = 'shift/save';
// 组织结构
const _orgListURL = 'dept/list';
const _orgTreeTabelURL = 'dept/list?parentid=';
const _orgSaveURL = 'dept/save';
const _orgEnableURL = 'dept/enable/';
const _orgDisableURL = 'dept/disable/';
const _orgDeleteURL = 'dept/delete/';
const _orgDetailURL = 'dept/detail/';
const _orgSearchURL = 'user/search?name=';
const _enumDeptType = 'enum/dept/type';
// 物料类别
const _cryListURL = 'product/category/list';
const _crySaveURL = 'product/category/save';
const _cryDeleteURL = 'product/category/delete/';
// 计量单位
const _unitListUrL = 'unit/list';
const _unitSaveUrL = 'unit/save';
const _unitDetailURL = 'unit/detail/';
const _unitDeleteURL = 'unit/delete';

// 物料属性
const _attrListURL = 'product/property/item/list';
const _attrSaveURL = 'product/property/item/save';
const _attrDetailUrl = 'product/property/item/detail/';
const _attrDeleteUrl = 'product/property/item/delete/';
// 物料管理
const _allMaterialURL = 'product/category/list';
const _materialSearchURL = 'product/list?&categoryid=';
const _materialSaveURL = 'product/save';
const _materialDeleteURL = 'product/delete/';
const _materialDetailURL = 'product/detail/';
const _materialPageTableURL = 'product/list?pagesize=';
const _materialAddTableURL = 'product/property/item/list?categoryid=';
const _materialTreeTableURL = 'product/list?pagesize=';
const _stockTypeList = 'dict/list?parentcode=stock_type';
const _productQuantifySaveProductId = 'product/quantify/save?productid=';
const _productQuantifyList = 'product/quantify/list';
const _productApprove = 'product/approve';
const _productUnApprove = 'product/unapprove';
const _productDisable = 'product/disable';
const _productEnable = 'product/enable';

// 设备配件管理
const _partsSaveURL = 'parts/save';
const _partsPageTableURL = 'parts/list?categoryid=';
const _partsTreeTableURL = 'parts/list?categoryid=';
const _partsTypeURL = 'dict/list?parentcode=equipment_type';
const _partsDeleteURL = 'parts/delete/';
const _partsModelURL = 'model/list?typeid=';
const _partsDetailURL = 'parts/detail/';
// 设备机型
const _modelDeleteURL = 'model/delete';
const _modelSaveURL = 'model/save';
const _modelDetailURL = 'model/detail/';
const _modelListURL = 'model/list';
// 设备档案管理
const _fileSaveURL = 'machine/save';
const _fileDetailURL = 'machine/detail/';
const _fileListURL = 'machine/list';
const _fileDeleteURL = 'machine/delete';
const _workshopsURL = 'dept/workshops';
const _machineApprove = 'machine/approve';
const _machineUnapprove = 'machine/unapprove';
const _machineDisable = 'machine/disable';
const _machineEnable = 'machine/enable';
const _enumAuditState2 = 'enum/audit/state2';
const _enumEnableState = 'enum/enable/state';

// 通知单
const _noticeSheetList = 'notice/sheet/list';
const _noticeSheetClose = 'notice/sheet/close';
const _noticeSheetDelete = 'notice/sheet/delete';
const _noticeSheetCancel = 'notice/sheet/cancel';
const _noticeSheetSubmit = 'notice/sheet/submit';
const _noticeSheetAudit = 'notice/sheet/audit';
const _deptWorkshops = 'dept/workshops';
const _enumAuditState = 'enum/audit/state';
const _noticeSheetSaveStaging = 'notice/sheet/save?staging=';
const _materialSaveSheetId = 'material/save?sheetid=';
const _noticeProcessSave = 'notice/process/save';
const _noticeMachineSaveNoticeProcessId = 'notice/machine/save?noticeprocessid=';
const _noticeProcessParamSave = 'notice/process/param/save';
const _dictListParentCodeCylinderColor = 'dict/list?parentcode=cylinder_color';
const _dictListParentCodeBobbinColor = 'dict/list?parentcode=bobbin_color';
const _dictListParentCodePaperTubeColor = 'dict/list?parentcode=papertube_color';
const _specPathList = 'spec/path/list';
const _noticeSheetDetail = 'notice/sheet/detail/';
const _noticeMaterialListSheetId = 'notice/material/list?sheetid=';
const _specSheetParamListSheetId = 'spec/sheet/param/list?sheetid=';
const _specParamList = 'spec/param/list';
const _specSheetList = 'spec/sheet/list';
const _orderListInprodFalse = 'order/list?inprod=false';
const _noticeMaterialSaveSheetId = 'notice/material/save?sheetid=';
// 生产订单
const _orderList = 'order/list';
const _orderDelete = 'order/delete';
const _orderClose = 'order/close';
const _orderCancel = 'order/cancel';
const _orderAudit = 'order/audit';
const _orderSubmit = 'order/submit';
const _orderSaveStaging = 'order/save?staging=';
const _orderDeliverySaveOrderId = 'order/delivery/save?orderid=';
const _orderDetail = 'order/detail/';
const _orderDeliveryList = 'order/delivery/list';
const _dictListParentCodeOrderTpye = 'dict/list?parentcode=order_tpye';
// 工艺单
const _specSheetEnable = 'spec/sheet/enable';
const _specSheetDisable = 'spec/sheet/disable';
const _specSheetDelete = 'spec/sheet/delete';
const _specSheetSubmit = 'spec/sheet/submit';
const _specSheetCancel = 'spec/sheet/cancel';
const _specSheetAudit = 'spec/sheet/audit';
const _enumSpecPathState = 'enum/spec/path/state';
const _specSheetSaveStaging = 'spec/sheet/save?staging=';
const _specSheetParamSaveSheetId = 'spec/sheet/param/save?sheetid=';
const _specSheetDetail = 'spec/sheet/detail/';
// 开台
const _machineOpenList = 'machine/open/list';
const _machineOpenListProcessId = 'machine/open/list?processid=';
//
const _reportSheetList = 'report/sheet/list';
// 工艺参数
const _specParamDetail = 'spec/param/detail/';
const _specParamSave = 'spec/param/save';
const _specParamDelete = 'spec/param/delete';
// 工艺路线
const _specPathDelete = 'spec/path/delete';
const _specPathSave = 'spec/path/save';
const _specPathDetail = 'spec/path/detail/';
// 公司管理
const _corpSave = 'corp/save';
const _corpDetail = 'corp/detail';
// 故障类别
const _faultTypeListURL = 'fault/type/list';
const _faultClassifyDetailURL = 'fault/type/detail/';
const _faultTypeDeleteURL = 'fault/type/delete';
// 首页
const _homeMachineOpenURL = 'home/todayMachineOpen';
const _homeOnlineURL = 'notice/machine/onList';
// 登录用户的车间
const _userWorkshopURL = 'user/workshop';
// 保养
const _upkeepSingleDetailsList = 'upkeep/single/details/list';
const _upkeepSingleDetail = 'upkeep/single/detail/';
const _upkeepDetailURL = 'upkeep/single/details/detail/';
const _maiRepListUrl = 'machine/faultUpkeepList';
const _upkeepTypeListURL = 'upkeep/type/list';
const _upkeepSingleListURL = 'upkeep/single/list';
const _upkeepNewSaveURL = 'upkeep/single/newSave';
const _upkeepOrderStateURL = 'upkeep/single/orderState';
const _upkeepDeleteURL = 'upkeep/single/delete';
const _upkeepStopStateURL = 'upkeep/single/details/endState';
const _upkeepSaveURL = 'upkeep/single/save';
const _upkeepBeginStateURL = 'upkeep/single/details/beginState';
// 维修
const _maintainDeleteURL = 'maintain/single/delete';
const _maintainOrderTakeURL = 'maintain/single/orderTake';
const _maintainFixMachineURL = 'maintain/single/fixMachine';
const _maintainSaveURL = 'maintain/single/save';
const _maintainListURL = 'maintain/single/list';
const _maintainDetailURL = 'maintain/single/detail/';
// 运转监测
const _processMachinesList = 'process/machines/list2';
const _noticeMachineProductList = 'notice/machine/product/list';
export default {
    // 运转监测
    getNoticeMachineProductList () {
        return _noticeMachineProductList;
    },
    getProcessMachinesList () {
        return _processMachinesList;
    },
    // 维修
    getMaintainDetail () {
        return _maintainDetailURL;
    },
    getMaintainList () {
        return _maintainListURL;
    },
    postMaintainSave () {
        return _maintainSaveURL;
    },
    postMaintainFixMachine () {
        return _maintainFixMachineURL;
    },
    postMaintainOrderTake () {
        return _maintainOrderTakeURL;
    },
    postMaintainDelete () {
        return _maintainDeleteURL;
    },
    // 保养
    postUpkeepBeginState () {
        return _upkeepBeginStateURL;
    },
    postUpkeepSave () {
        return _upkeepSaveURL;
    },
    postUpkeepStopState () {
        return _upkeepStopStateURL;
    },
    postUpkeepDelete () {
        return _upkeepDeleteURL;
    },
    postUpkeepOrderState () {
        return _upkeepOrderStateURL;
    },
    postUpkeepNewSave () {
        return _upkeepNewSaveURL;
    },
    getUpkeepSingleList () {
        return _upkeepSingleListURL;
    },
    getUpkeepSingleDetailsList () {
        return _upkeepSingleDetailsList;
    },
    getUpkeepTypeList () {
        return _upkeepTypeListURL;
    },
    getMaiRepList () {
        return _maiRepListUrl;
    },
    getUpkeepDetail () {
        return _upkeepDetailURL;
    },
    getUpkeepSingleDetail () {
        return _upkeepSingleDetail;
    },
    // 登录用户的车间
    getUserWorkshop () {
        return _userWorkshopURL;
    },
    // 首页
    getOnlinePro () {
        return _homeOnlineURL;
    },
    getProcessOpenMachine () {
        return _homeMachineOpenURL;
    },
    // 故障类别
    faultClassifyDelete () {
        return _faultTypeDeleteURL;
    },
    getFaultClassify () {
        return _faultClassifyDetailURL;
    },
    getFaultTypeList () {
        return _faultTypeListURL;
    },
    // 公司管理
    corpSave () {
        return _corpSave;
    },
    corpDetail () {
        return _corpDetail;
    },
    // 工艺路线
    specPathDetail () {
        return _specPathDetail;
    },
    specPathSave () {
        return _specPathSave;
    },
    specPathDelete () {
        return _specPathDelete;
    },
    // 工艺参数
    specParamDelete () {
        return _specParamDelete;
    },
    specParamSave () {
        return _specParamSave;
    },
    specParamDetail () {
        return _specParamDetail;
    },
    reportSheetList () {
        return _reportSheetList;
    },
    // 开台
    machineOpenListProcessId () {
        return _machineOpenListProcessId;
    },
    machineOpenList () {
        return _machineOpenList;
    },
    // 工艺单
    specSheetDetail () {
        return _specSheetDetail;
    },
    specSheetParamSaveSheetId () {
        return _specSheetParamSaveSheetId;
    },
    specSheetSaveStaging () {
        return _specSheetSaveStaging;
    },
    enumSpecPathState () {
        return _enumSpecPathState;
    },
    specSheetAudit () {
        return _specSheetAudit;
    },
    specSheetCancel () {
        return _specSheetCancel;
    },
    specSheetSubmit () {
        return _specSheetSubmit;
    },
    specSheetDelete () {
        return _specSheetDelete;
    },
    specSheetDisable () {
        return _specSheetDisable;
    },
    specSheetEnable () {
        return _specSheetEnable;
    },
    // 生产订单
    dictListParentCodeOrderTpye () {
        return _dictListParentCodeOrderTpye;
    },
    orderDeliveryList () {
        return _orderDeliveryList;
    },
    orderDetail () {
        return _orderDetail;
    },
    orderDeliverySaveOrderId () {
        return _orderDeliverySaveOrderId;
    },
    orderSaveStaging () {
        return _orderSaveStaging;
    },
    orderSubmit () {
        return _orderSubmit;
    },
    orderAudit () {
        return _orderAudit;
    },
    orderCancel () {
        return _orderCancel;
    },
    orderClose () {
        return _orderClose;
    },
    orderList () {
        return _orderList;
    },
    orderDelete () {
        return _orderDelete;
    },
    // 通知单
    noticeMaterialSaveSheetId () {
        return _noticeMaterialSaveSheetId;
    },
    orderListInprodFalse () {
        return _orderListInprodFalse;
    },
    specSheetList () {
        return _specSheetList;
    },
    specParamList () {
        return _specParamList;
    },
    specSheetParamListSheetId () {
        return _specSheetParamListSheetId;
    },
    noticeMaterialListSheetId () {
        return _noticeMaterialListSheetId;
    },
    noticeSheetDetail () {
        return _noticeSheetDetail;
    },
    specPathList () {
        return _specPathList;
    },
    dictListParentCodePaperTubeColor () {
        return _dictListParentCodePaperTubeColor;
    },
    dictListParentCodeBobbinColor () {
        return _dictListParentCodeBobbinColor;
    },
    dictListParentCodeCylinderColor () {
        return _dictListParentCodeCylinderColor;
    },
    noticeProcessParamSave () {
        return _noticeProcessParamSave;
    },
    noticeMachineSaveNoticeProcessId () {
        return _noticeMachineSaveNoticeProcessId;
    },
    noticeProcessSave () {
        return _noticeProcessSave;
    },
    materialSaveSheetId () {
        return _materialSaveSheetId;
    },
    noticeSheetSaveStaging () {
        return _noticeSheetSaveStaging;
    },
    enumAuditState () {
        return _enumAuditState;
    },
    deptWorkshops () {
        return _deptWorkshops;
    },
    noticeSheetAudit () {
        return _noticeSheetAudit;
    },
    noticeSheetSubmit () {
        return _noticeSheetSubmit;
    },
    noticeSheetCancel () {
        return _noticeSheetCancel;
    },
    noticeSheetDelete () {
        return _noticeSheetDelete;
    },
    noticeSheetList () {
        return _noticeSheetList;
    },
    noticeSheetClose () {
        return _noticeSheetClose;
    },
    // 设备档案管理
    fileSave () {
        return _fileSaveURL;
    },
    getFileDetail (id) {
        return _fileDetailURL + id;
    },
    getFileList () {
        return _fileListURL;
    },
    fileDelete (id) {
        return _fileDeleteURL;
    },
    getWorkshop () {
        return _workshopsURL;
    },
    machineApprove () {
        return _machineApprove;
    },
    machineUnapprove () {
        return _machineUnapprove;
    },
    machineDisable () {
        return _machineDisable;
    },
    machineEnable () {
        return _machineEnable;
    },
    enumAuditState2 () {
        return _enumAuditState2;
    },
    enumEnableState () {
        return _enumEnableState;
    },
    // 设备机型
    getModelList () {
        return _modelListURL;
    },
    modelDelete (id) {
        return _modelDeleteURL;
    },
    modelSave () {
        return _modelSaveURL;
    },
    modelDetail (id) {
        return _modelDetailURL + id;
    },

    // 设备配件管理
    partsSave () {
        return _partsSaveURL;
    },
    getPartsPageTable (id, pageIndex, pageSize, authStateValue, stateValue, searchData) {
        return _partsPageTableURL + id + '&pageindex=' + pageIndex + '&pagesize=' + pageSize + '&auditstate=' + authStateValue + '&enablestate=' + stateValue + '&name=' + encodeURIComponent(searchData);
    },
    getPartsTreeTable (id, pageSize, pageIndex) {
        return _partsTreeTableURL + id + '&pagesize=' + pageSize + '&pageindex=' + pageIndex;
    },
    getPartsType () {
        return _partsTypeURL;
    },
    partsDelete (id) {
        return _partsDeleteURL + id;
    },
    getPartsModel (id) {
        return _partsModelURL + id;
    },
    getPartsDetail (id) {
        return _partsDetailURL + id;
    },

    // 角色管理
    getRoleListManager () {
        return _roleListManager;
    },
    getRoleSaveManager () {
        return _roleSaveManager;
    },
    deleteRoleManager (id) {
        return _roleDeleURL + id;
    },
    AddRoleUser (id) {
        return _roleUserAddURL + id;
    },
    getRoleUserList () {
        return _roleUserListURL;
    },
    removeRoleUser (id) {
        return _roleUserDeleURL + id;
    },
    // 模块管理
    getModulemanager () {
        return _moduleListManager;
    },
    SaveModulemanager () {
        return _moduleSaveManager;
    },
    removeModule (id) {
        return _moduleDelete + id;
    },
    moduleAddRole (id) {
        return _moduleAddRole + id;
    },
    moduleRemoveRole (id) {
        return _moduleRemoveRole + id;
    },
    getModuleList () {
        return _moduleRoleList;
    },
    // 模块用户
    getModuleUserList () {
        return _moduleUserList;
    },
    moduleUserAddList (id) {
        return _moduleUserAddList + id;
    },
    moduleUserRemove (id) {
        return _moduleUserRemoveList + id;
    },
    // 班制
    ShiftManager () {
        return _shiftManager;
    },
    // 物料管理
    getStockTypes () {
        return _stockTypeList;
    },
    getAllMaterial () {
        return _allMaterialURL;
    },
    materialSearch (id, pageSize, state, name, authstate, pageIndex) {
        return _materialSearchURL + id + '&pagesize=' + pageSize + '&enablestate=' + state + '&name=' + encodeURIComponent(name) + '&auditstate=' + authstate + '&pageindex=' + pageIndex;
    },
    materialSave () {
        return _materialSaveURL;
    },
    materialDelete (id) {
        return _materialDeleteURL + id;
    },
    materialDetail (id) {
        return _materialDetailURL + id;
    },
    materialPageTable (pageSize, pageindex, id) {
        return _materialPageTableURL + pageSize + '&pageindex=' + pageindex + '&categoryid=' + id;
    },
    materialAddTable (id) {
        return _materialAddTableURL + id;
    },
    materialTreeTable (pageSize, id, pageIndex) {
        return _materialTreeTableURL + pageSize + '&categoryid=' + id + '&pageindex=' + pageIndex;
    },
    productQuantifySaveProductId () {
        return _productQuantifySaveProductId;
    },
    productQuantifyList () {
        return _productQuantifyList;
    },
    productApprove () {
        return _productApprove;
    },
    productUnapprove () {
        return _productUnApprove;
    },
    productDisable () {
        return _productDisable;
    },
    productEnable () {
        return _productEnable;
    },

    // 物料属性
    getAttrList () {
        return _attrListURL;
    },
    attrSave () {
        return _attrSaveURL;
    },
    getAttrDetail (id) {
        return _attrDetailUrl + id;
    },
    attrDelete (id) {
        return _attrDeleteUrl + id;
    },

    // 计量单位
    getUnitList () {
        return _unitListUrL;
    },
    unitSave () {
        return _unitSaveUrL;
    },
    unitDetail (id) {
        return _unitDetailURL + id;
    },
    unitDelete (id) {
        return _unitDeleteURL;
    },

    // 组织架构
    getOrgList () {
        return _orgListURL;
    },
    getOrgTreeTable (id) {
        return _orgTreeTabelURL + id;
    },
    orgSave () {
        return _orgSaveURL;
    },
    orgEnable (id) {
        return _orgEnableURL + id;
    },
    orgDisable (id) {
        return _orgDisableURL + id;
    },
    orgDelete (id) {
        return _orgDeleteURL + id;
    },
    orgDetail (id) {
        return _orgDetailURL + id;
    },
    orgSearch (word) {
        return _orgSearchURL + encodeURIComponent(word);
    },
    enumDeptType () {
        return _enumDeptType;
    },

    // 员工管理
    getLoginMsg () {
        return _loginMsgURL;
    },
    getUserList () {
        return _empList;
    },
    empPageData (id, pageSize, pageIndex, word) {
        return _empPageURL + id + '&pagesize= ' + pageSize + '&pageindex=' + pageIndex + '&name=' + encodeURIComponent(word);
    },
    userSetPassword () {
        return _userSetPassword;
    },
    userOnjob () {
        return _userOnjob;
    },
    recoveryInser () {
        return _userRecoveryInser;
    },
    userDisable () {
        return _userDisable;
    },
    userEnable () {
        return _userEnable;
    },
    getEmpList (id) {
        return _empListURL + id;
    },
    empSave () {
        return _empSaveURL;
    },
    empDelete (id) {
        return _empDeleteURL + id;
    },
    empDetail (id) {
        return _empDetailURL + id;
    },
    getDept () {
        return _empDeptURL;
    },
    getEmpPostList () {
        return _empPostURL;
    },
    empSearch (name) {
        return _empSearchURL + encodeURIComponent(name);
    },
    // 岗位管理
    postList () {
        return _postList;
    },
    getPostDetail (id) {
        return _postDetailURL + id;
    },
    postDelete (id) {
        return _postDeleteURL + id;
    },
    postSave () {
        return _postSaveURL;
    },
    getPostParentCode () {
        return _postParentCodeURL;
    },
    getPostProType () {
        return _postProTypeURL;
    },
    // 工序管理标签页
    getProList (pId) {
        return _processListURL + pId;
    },
    postProcessSave () {
        return _processSaveURL;
    },
    getProcessDetail (id) {
        return _processDetailURL + id;
    },
    postProcessDelete (id) {
        return _processDeleteURL + id;
    },
    postProcessEnable (id) {
        return _processEnableURL + id;
    },
    postProcessDisable (id) {
        return _processDisableURL + id;
    },
    getProcessType () {
        return _processTypeURL;
    },
    // 字典管理
    getdircCateList () {
        return _dircCateURL;
    },
    postDircSave () {
        return _dircSaveURL;
    },
    getDircList (parentcode) {
        return _dircListURL + parentcode;
    },
    postDircDelete (id) {
        return _dircDeleteURL;
    },
    getDircDtail (id) {
        return _dircDetailURL + id;
    },
    getFaultType () {
        return _dicFaultTypeURL;
    },
    getCryList () {
        return _cryListURL;
    },
    getCrySave () {
        return _crySaveURL;
    },
    cryDelete (id) {
        return _cryDeleteURL + id;
    }
};
