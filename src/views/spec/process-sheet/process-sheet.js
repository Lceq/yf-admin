// import api from '../../../ajax/api';
import publicJs from '../../../libs/common';
import tipsClear from '../../public/deleteWarning';
import selectProduct from './xw-select-product';
export default{
    components: {
        tipsClear,selectProduct
    },
    data(){
        const validateSpecUser = (rule, value, callback) => {
            if (value === '' || value === undefined || value === null) {
                callback(new Error());
            } else {
                callback();
            }
        };
        const validateProcessDate = (rule, value, callback) => {
            if (value === '' || value === undefined || value === null) {
                callback(new Error());
            } else {
                callback();
            }
        };
        const validateRoute =  (rule, value, callback) => {
            if (value === '' || value === undefined || value === null) {
                callback(new Error());
            } else {
                callback();
            }
        };
        const validateModel =   (rule, value, callback) => {
            if (value === '' || value === undefined || value === null) {
                callback(new Error());
            } else {
                callback();
            }
        };
        return{
            formDynamic: {
                processNameAndId:[],
            },
            remoteMaterialList: [],
            materialArr: [],
            remoteMaterialLoading: false,
            remoteUserList: [],
            defaultTabPane: '0',
            tableHeight:document.documentElement.clientHeight - 500,
            isDetailEdit:false,
            clearTipsStatus:false,
            clearTipsMsg:'',
            machineModelList: [],
            formValidate:{
                processSheetIpt:'',
                billDateIpt: publicJs.getDate(),
                specUserIpt:'',
                materielNameIpt:'',
                materielCodeIpt:'',
                modelIpt:'',
                routesIpt: '',
                deliveryDateIpt:'',
                machineModelIpt: null
            },
            ruleValidate:{
                billDateIpt:[
                    { required:true,validator:validateProcessDate,trigger:'change'}
                ],
                specUserIpt:[
                    { required:true,validator:validateSpecUser,trigger:'change'}
                ],
                materielCodeIpt:[
                    { required:true,trigger:'change'}
                ],
                modelIpt:[
                    { required:true,trigger:'blur'}
                ],
                routesIpt:[
                    { required:true,validator:validateRoute,trigger:'change'}
                ],
                deliveryDateIpt:[
                    { required:true,trigger:'blur'}
                ],
                machineModelIpt: [
                    { required:true,validator:validateModel,trigger: 'change' }
                ]
            },
            arrayProcess:[],
            isSearch:false,
            processRouteList: [],
            tableHeader: [
                {
                    title: '序号',
                    key: 'number',
                    width:80,
                    align:'center'
                },
                {
                    title: '工艺参数',
                    key: 'nameCode',
                    align:'left'
                },
                {
                    title: '工艺参数值',
                    key: 'val',
                    align:'left',
                    render:(h,params)=>{
                        if(params.row.dataType === 1){
                            return h('div',[
                                h('InputNumber',{
                                    props:{
                                        value: params.row.val ? parseFloat(params.row.val) : null,
                                        min:0,
                                    },
                                    style:{
                                        width:'100%'
                                    },
                                    on:{
                                        'on-change':(e)=>{
                                            params.row.val = e;
                                            this.formDynamic.processNameAndId[this.parentIndex].paramList[params.index] = params.row;
                                        },
                                    }
                                })
                            ])
                        }else {
                            return h('div',[
                                h('Input',{
                                    props:{
                                        value:params.row.val
                                    },
                                    on:{
                                        'on-change':(event)=>{
                                            params.row.val = event.target.value;
                                            this.formDynamic.processNameAndId[this.parentIndex].paramList[params.index] = params.row;
                                        }
                                    }
                                })
                            ])
                        }
                    }
                },
                {
                    title: '是否业务参数',
                    key: 'isBusiName',
                    align:'left'
                },
                {
                    title: '数据类型',
                    key: 'dataTypeName',
                    align:'left'
                }
            ],
            modalMaterialCategoryList: [],
            searchModelStatus:false,
            materielTableHeader: [
                {
                    title: '产品编码',
                    key: 'code',
                    align:'left'
                },
                {
                    title: '产品名称',
                    key: 'name',
                    align:'left'
                },
                {
                    title: '计量单位',
                    key: 'unitName',
                    align:'left'
                },
                {
                    title: '规格型号',
                    key: 'models',
                    align:'left'
                },
                {
                    title: '产品类别',
                    key: 'typeName',
                    align:'left'
                },
                {
                    title: '图片',
                    key: 'picUrl',
                    align:'center',
                    render: (h, params) => {
                        if (params.row.picUrl !== '') {
                            return h('div', [
                                h('img', {
                                    style:{
                                        width:'30px',
                                        height:'30px',
                                        marginTop:'4px'
                                    },
                                    domProps:{
                                        src:params.row.picUrl
                                    }
                                })
                            ])
                        };
                    }
                }
            ],
            materielTableData: [],
            pageTotal:0,
            pageSize:20,
            searchData:'',
            modalMaterialCategoryValue:[],
            materielData:[],
            pageIndex:1,
            doubleClickRowObj:null,
            remoteUserLoading:false,
            selectSpecUserObj: {
                value: '',
                label: ''
            },
            userList:[],
            materielId:'',
            editId:'',
            searchDataIpt:'',
            processList:[],
            selectSpecPathObj: null,
            parentIndex:0,
            materielArray:[],
            againGetDataSwitch:false,
            toCreated:false,
        }
    },
    methods:{
        // 提交的事件
        pushClickEvent () {
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    // 动态工序表单验证
                    this.$refs['formDynamic'].validate((valid) => {
                        if (valid) {
                            // 先保存再提交
                            this.saveHttp().then(res=>{
                                this.pushHttp(res.data.res);
                            });
                        } else {
                            this.$Message.error('请填写完整！');
                            this.directSubmitSwitch = false;
                        };
                    })
                } else {
                    this.$Message.error('请填写完整！');
                    this.directSubmitSwitch = false;
                }
            })
        },
        // 提交的请求
        pushHttp(ids){
            this.$api.specSheet.submitHttp(
                [ ids ]
            ).then(res=>{
                this.formValidate.processRouteIpt = '';
                this.directSubmitSwitch = false;
                this.$Notice.success({
                    title:'提示',
                    desc: '操作成功!'
                });
                this.$store.commit('removeTag', 'addProSheet');
                this.$router.push({
                    path:'editProSheet',
                    query:{
                        id:ids,
                        isEdit:true,
                        activated:true
                    }
                });
            });
        },
        // 保存的请求
        saveHttp () {
            this.$store.dispatch({
                type:'showLoading'
            });
            return this.$api.specSheet.saveHttp({
                "code": this.formValidate.processSheetIpt,
                "state": 1,
                "productId": this.materielId,
                "productCode": this.formValidate.materielCodeIpt,
                "productName": this.formValidate.materielNameIpt,
                "productModels": this.formValidate.modelIpt,
                "specPathId": this.selectSpecPathObj.value,
                "specPathName": this.selectSpecPathObj.label,
                "specUserId": this.selectSpecUserObj.value,
                "specUserName": this.selectSpecUserObj.label.split('(')[0],
                "specDate": publicJs.formatDate(this.formValidate.billDateIpt),
                "specProcessList": this.formDynamic.processNameAndId
            })
        },
        // 保存的事件
        saveClickEvent () {
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    // 动态工序表单验证
                    this.$refs['formDynamic'].validate((valid) => {
                        if (valid) {
                            this.saveHttp().then(res=>{
                                if(res.data.status === 200){
                                    this.editId = res.data.res;
                                    this.$Notice.success({
                                        title:'提示',
                                        desc: '操作成功!'
                                    });
                                    this.$store.commit('removeTag', 'addProSheet');
                                    this.$router.push({
                                        path:'editProSheet',
                                        query:{
                                            id:res.data.res,
                                            isEdit:true,
                                            activated:true
                                        }
                                    });
                                }
                            });
                        } else {
                            this.$Message.error('请填写完整！');
                            this.directSubmitSwitch = false;
                        }
                    })
                } else {
                    this.$Message.error('请填写完整！');
                    this.directSubmitSwitch = false;
                }
            });
        },
        // 产品编码的点击事件
        clickMainMaterialCodeEvent () {
            this.searchMaterielHttp();
        },
        // 选择产品事件
        getSelectMaterialEvent (e) {
            if (e !== undefined) {
                this.formValidate.codeValue = e;
                let materialObj = null;
                this.remoteMaterialList.forEach((item) => {
                    if (e === item.code) {
                        materialObj = item;
                    }
                });
                this.materielId = materialObj.id;
                this.formValidate.materielCodeIpt = materialObj.code;
                this.formValidate.materielNameIpt = materialObj.name;
                this.formValidate.modelIpt = materialObj.models;
            }
        },
        // 远程搜索的方法
        remoteMaterialMethod (query) {
            if (query !== '') {
                this.remoteMaterialLoading = true;
                setTimeout(() => {
                    this.remoteMaterialLoading = false;
                    this.remoteMaterialList = this.materialArr.filter(item => item.code.toLowerCase().indexOf(query.toLowerCase()) > -1);
                }, 200);
            } else {
                this.remoteMaterialList = [];
            }
        },
        // 工艺路线的事件
        selectProcessPathEvent (e) {
            this.selectSpecPathObj = e ||  {value: '', label: ''};
            if (this.selectSpecPathObj.value !== '') {
                this.defaultTabPane = '0';
                this.formDynamic.processNameAndId = [];
                this.$api.path.detailHttp({
                    id: this.selectSpecPathObj.value
                }).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.pathProcessList.forEach((item)=>{
                            delete item.id;
                            this.$set(item, 'sheetProcessEntity', {});
                            // 赋值设备机型下拉列表
                            let processModelData = this.machineModelList.filter((modelItem)=>{
                                let dataObj = null;
                                if (item.processId === modelItem.processId) {
                                    dataObj = modelItem;
                                };
                                return dataObj;
                            });
                            this.$set(item.sheetProcessEntity, 'machineModelList', processModelData);
                            this.$set(item.sheetProcessEntity, 'processId', item.processId);
                            this.$set(item.sheetProcessEntity, 'machineModelId', null);
                            this.$set(item.sheetProcessEntity, 'gramWeight', null);
                            this.$set(item.sheetProcessEntity, 'meters', null);
                            this.$set(item.sheetProcessEntity, 'numbers', null);
                            this.$set(item.sheetProcessEntity, 'moistureRegain', null);
                            this.$set(item.sheetProcessEntity, 'efficiencyPercent', null);
                            item.paramList.forEach((paramsItem)=>{
                                this.$set(paramsItem, 'val', null);
                                this.$set(paramsItem, 'specParamId', paramsItem.id);
                                this.$set(paramsItem, 'nameCode', paramsItem.name + '(' + paramsItem.code + ')');
                                delete paramsItem.id;
                            })
                        });
                        this.formDynamic.processNameAndId = this.initNumber(res.data.res.pathProcessList);
                    };
                })
            };
        },
        // 添加name
        initNumber (arr) {
            arr.forEach((processItem)=>{
                processItem.paramList.forEach((item, index)=>{
                    item.number = index + 1;
                    item.isBusi === true ? this.$set(item, 'isBusiName', '是') : this.$set(item, 'isBusiName', '否');
                    item.dataType === 1 ? this.$set(item, 'dataTypeName', '数值型') : this.$set(item, 'dataTypeName', '字符型');
                });
            });
            return arr;
        },
        clearTipsCancel(){
            this.clearTipsMsg = '';
            this.clearTipsStatus = false;
        },
        clearTipsConfirm(){
            // Object.assign(this.$data, this.$options.data());
            this. formDynamic =  {
                processNameAndId:[],
            };
            this.clearTipsStatus = false;
            setTimeout(()=>{
                this.$refs['formValidate'].resetFields();
                (async () => {
                    await this.getSpecPathList();
                    await this.getAllMaterialHttp();
                    await this.getMaterialTypeHttp();
                    await this.getMachineModelHttp();
                    await this.getUserListHttp();
                    await this.getUserInfoHttp();
                })();
            },0)
        },
        //
        selectProduct (val) {
            if (val) {
                this.formValidate.models = val.models;
                this.formValidate.processName = val.processName;
                this.formValidate.processId = val.processId;
            } else {
                this.formValidate.models = '';
                this.formValidate.processName = '';
                this.isShowProcessParams = false;
            }
        },
        // 新增的事件
        newAddClick(){
            this.clearTipsStatus = true;
            this.clearTipsMsg = '数据尚未保存，确认清空？';
        },
        // 点击tabs标签页
        clickTabs(e){
            this.parentIndex = e;
        },
        // 监听搜索产品的modal状态
        getMaterielStatusChange(e){
            if(e === false){
                this.materielTableData = [];
                this.searchDataIpt = '';
                this.isSearch = false;
                this.searchData = '';
                this.isSearch = false;
                this.modalMaterialCategoryValue = [];
            };
        },
        //获取选中的计划员(返回id和name)
        selectSpecUserEvent(e){
            this.selectSpecUserObj = e || { value: '', label: ''};
        },
        // 搜索工艺员的方法
        remoteMethod (query) {
            if (query !== '') {
                this.remoteUserLoading = true;
                setTimeout(() => {
                    this.remoteUserLoading = false;
                    this.userList = this.remoteUserList.filter(item => item.id + ''.toLowerCase().indexOf(query.toLowerCase()) > -1);
                }, 200);
            } else {
                this.userList = [];
            }
        },
        //获取页码
        getPageIndex(e){
            this.pageIndex = e;
            this.isSearch = false;
            //调用搜索产品类别的请求
            this.searchMaterielHttp();
        },
        //单击表格行
        getClickRow(obj,index){
            this.doubleClickRowObj = obj;
        },
        //获取双击新增内表格的行
        getDoubleClickRow(obj,index){
            this.doubleClickRowObj = obj;
            this.searchModalConfirm();
        },
        //获取产品类别
        getMaterielType(e,data){
            this.modalMaterialCategoryValue = e;
            this.isSearch = true;
            //调用搜索产品的请求
            this.searchMaterielHttp();
        },
        //搜索产品类别的请求
        searchMaterielHttp(){
            this.searchModelStatus = true;
            this.$api.product.getProductList({
                categoryId: this.modalMaterialCategoryValue[this.modalMaterialCategoryValue.length -1],
                enableState: 1,
                auditState: 3,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                name: this.searchData
            }).then((res)=>{
                if(res.data.status === 200){
                    this.materielTableData = res.data.res;
                    this.pageTotal = res.data.count;
                }
            });
        },
        //返回数据
        searchModalConfirm(){
            if(this.doubleClickRowObj){
                this.materielId = this.doubleClickRowObj.id;
                this.formValidate.materielCodeIpt = '';
                setTimeout(()=>{
                    this.formValidate.materielCodeIpt = this.doubleClickRowObj.code;
                },0);
                this.formValidate.materielNameIpt = this.doubleClickRowObj.name;
                this.formValidate.modelIpt = this.doubleClickRowObj.models;
                this.searchModelStatus = false;
            };
        },
        //搜索按钮的点击事件
        modalSelectMaterialSearchEvent () {
            //去除两边的空格
            this.searchDataIpt = this.searchDataIpt.replace(/(^\s*)|(\s*$)/g,"");
            //转大写字母
            this.searchDataIpt = this.searchDataIpt.toUpperCase();
            this.searchData = this.searchDataIpt;
            this.pageIndex = 1;
            this.isSearch = true;
            this.pageTotal = 1;
            //调用搜索产品类别的请求
            this.searchMaterielHttp();
        },
        //搜索的回车
        searchEnter(){
            //去除两边的空格
            this.searchDataIpt = this.searchDataIpt.replace(/(^\s*)|(\s*$)/g,"");
            //转大写字母
            this.searchDataIpt = this.searchDataIpt.toUpperCase();
            this.pageIndex = 1;
            this.searchData = this.searchDataIpt;
            this.isSearch = true;
            //调用搜索产品类别的请求
            this.searchMaterielHttp();
        },
        // 工艺路线的工序及参数进行匹配赋值
        getPathProcessHttp (responseProcessList, responseData) {
            this.$api.path.detailHttp({
                id: responseData.specPathId
            }).then(res => {
                if (res.data.status === 200) {
                    let pathData = res.data.res;
                    pathData.pathProcessList.forEach((pathProcessItem)=>{
                        delete pathProcessItem.id;
                        responseProcessList.forEach((detailProcessItem)=>{
                            if (pathProcessItem.processId === detailProcessItem.processId) {
                                delete detailProcessItem.sheetProcessEntity.id;
                                // 赋值设备机型下拉列表
                                let processModelData = this.machineModelList.filter((modelItem)=>{
                                    let dataObj = null;
                                    if (detailProcessItem.processId === modelItem.processId) {
                                        dataObj = modelItem;
                                    };
                                    return dataObj;
                                });
                                this.$set(detailProcessItem.sheetProcessEntity, 'machineModelList', processModelData);
                                // 将detail的sheetProcessEntity赋值给工艺路线带出来的工序对象
                                this.$set(pathProcessItem, 'sheetProcessEntity', detailProcessItem.sheetProcessEntity);
                                pathProcessItem.paramList.forEach((pathParamsItem)=>{
                                    this.$set(pathParamsItem, 'specParamId', pathParamsItem.id);
                                    this.$set(pathParamsItem, 'nameCode', pathParamsItem.name + '(' + pathParamsItem.code + ')');
                                    delete pathParamsItem.id;
                                    detailProcessItem.paramList.forEach((detailParamsItem)=>{
                                        if (pathParamsItem.specParamId === detailParamsItem.specParamId) {
                                            this.$set(pathParamsItem, 'val', detailParamsItem.val);
                                        };
                                    })
                                })
                            };
                        })
                        this.formDynamic.processNameAndId = this.initNumber(pathData.pathProcessList);
                        this.$store.dispatch({
                            type: 'hideLoading'
                        });
                    });
                };
            })
        },
        //获取详情的请求
        getDetailHttp(editId){
            this.$store.dispatch({
                type:'showLoading'
            });
            this.$api.specSheet.detailHttp({
                id: editId
            }).then(res=>{
                if(res.data.status === 200){
                    this.defaultTabPane = '0';
                    let responseData = res.data.res;
                    this.formValidate.billDateIpt = responseData.specDate;
                    this.selectSpecUserObj = {
                        value: responseData.specUserId,
                        label: responseData.specUserName
                    };
                    this.selectSpecPathObj = {
                        value: responseData.specPathId,
                        label: responseData.specPathName
                    };
                    this.formValidate.materielNameIpt = responseData.productName;
                    this.formValidate.modelIpt = responseData.productModels;
                    this.formValidate.routesIpt = responseData.specPathId;
                    this.remoteMaterialMethod(responseData.productCode);
                    this.formValidate.materielCodeIpt = responseData.productCode;
                    this.formValidate.specUserIpt = responseData.specUserId;
                    // 和工艺路线的工序及参数进行匹配赋值
                    this.getPathProcessHttp(responseData.specProcessList, responseData);
                };
            });
        },
        getSpecPathList(){
            return this.$api.path.listHttp({
                auditState: 3
            }).then(res=>{
                if(res.data.status === 200 ){
                    this.processRouteList = res.data.res;
                }
            });
        },
        getMaterialTypeHttp(){
            return this.$api.category.getProductCategoryList().then(res=>{
                if(res.data.status === 200){
                    this.modalMaterialCategoryList = publicJs.toTree(res.data.res);
                }
            });
        },
        // 初始化数据
        initData(){
            Object.assign(this.$data, this.$options.data());
            setTimeout(()=>{
                this.$refs['formValidate'].resetFields();
                (async ()=>{
                    await this.getSpecPathList();
                    await this.getAllMaterialHttp();
                    await this.getMaterialTypeHttp();
                    await this.getMachineModelHttp();
                    await this.getUserListHttp();
                    await this.getUserInfoHttp();
                    this.editId = this.$route.query.id;
                    //判断是否有id
                    if(this.editId !== undefined){
                        this.$store.dispatch({
                            type:'showLoading'
                        });
                        this.getDetailHttp(this.editId);
                    }
                })();
            },0);
        },
        // 获取所有员工
        getUserListHttp () {
            return this.$api.user.listHttp({
                name: ''
            }).then(res => {
                if (res.data.status === 200) {
                    let responseData = res.data.res;
                    responseData.forEach((items)=>{
                        items.label = items.name + '(' + items.code + ')';
                        items.value = items.id;
                    });
                    this.remoteUserList = responseData;
                }
            })
        },
        // 获取机型
        getMachineModelHttp () {
            return this.$api.model.listHttp({}).then(res => {
                if (res.data.status === 200) {
                    this.machineModelList = res.data.res;
                }
            });
        },
        // 获取所有产品
        getAllMaterialHttp () {
            return this.$api.product.getProductList({
                enableState: 1,
                name: '',
                auditState: 3
            }).then(res => {
                if (res.data.status === 200 ) {
                    this.materialArr = res.data.res;
                }
            })
        },
        // 获取当前用户
        getUserInfoHttp () {
            return this.$api.user.getUserInfo().then(res => {
                this.formValidate.specUserIpt = res.data.res.id;
                this.selectSpecUserObj = {
                    value: res.data.res.id,
                    label: res.data.res.name
                }
            })
        }
    },
    created(){
        this.toCreated = true;
        (async ()=>{
            await this.getSpecPathList();
            await this.getAllMaterialHttp();
            await this.getMaterialTypeHttp();
            await this.getMachineModelHttp();
            await this.getUserListHttp();
            await this.getUserInfoHttp();
            this.editId = this.$route.query.id;
            //判断是否有id
            if(this.editId !== undefined){
                this.getDetailHttp(this.editId);
            }
        })();
    },
    activated(){
        // 如果created钩子执行，activated就不执行
        this.toCreated === true ? this.againGetDataSwitch = false : this.againGetDataSwitch = this.$route.query.activated;
        if(this.againGetDataSwitch === true){
            this.defaultTabPane = '0';
            this.initData();
        }
        this.toCreated = false;
        this.$route.query.activated = false;
    },
    mounted(){
        window.onresize = () => {
            this.tableHeight = publicJs.compClientHeight(500);
        };
    }
}
