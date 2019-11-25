import { getOperationData, noticeTips, setPage, clearSpace, compClientHeight, defaultImgPath, translateState, emptyTips } from '../../../libs/common';
export default {
    methods: {
        showTabsIpt (typeName) {
            console.log('类型', typeName)
            if (typeName) {
                if (typeName === '成品') {
                    this.showBarCode = true;
                    this.showColor = true;
                    this.requiredPacketWeight = true;
                    this.requiredModels = true;

                    this.showMachiningProcess = true;
                    this.showBasicTabMaterial = true;
                    this.showBasicTabYarnUse = true;
                    this.showBasicTabCount = true;
                    this.showBasicTabSpinningProcess = true;
                    this.showBasicTabCore = true;
                    this.showBasicTabSlubYarn = true;
                    this.showBasicTabMachineModel = false;
                    this.showBasicTabMaterialRatio = false;
                    this.showBasicTabYarnCountMax = false;
                    this.showBasicTabYarnCountMin = false;
                    this.showBasicTabSupplier = false;
                    this.showBasicTabIsReused = false;
                    this.showPacketWeight = false;
                } else if (typeName === '半成品') {
                    this.showBarCode = true;
                    this.showColor = true;
                    this.requiredPacketWeight = true;
                    this.requiredModels = true;

                    this.showMachiningProcess = true;
                    this.showBasicTabMaterial = true;
                    this.showBasicTabYarnUse = false;
                    this.showBasicTabCount = false;
                    this.showBasicTabSpinningProcess = true;
                    this.showBasicTabCore = false;
                    this.showBasicTabSlubYarn = false;
                    this.showBasicTabMachineModel = false;
                    this.showBasicTabMaterialRatio = true;
                    this.showBasicTabYarnCountMax = true;
                    this.showBasicTabYarnCountMin = true;
                    this.showBasicTabSupplier = false;
                    this.showBasicTabIsReused = false;
                    this.showPacketWeight = false;
                } else if (typeName === '原料') {
                    this.showBarCode = false;
                    this.showColor = false;
                    this.requiredPacketWeight = false;
                    this.requiredModels = false;

                    this.showMachiningProcess = false;
                    this.showBasicTabMaterial = false;
                    this.showBasicTabYarnUse = false;
                    this.showBasicTabCount = false;
                    this.showBasicTabSpinningProcess = false;
                    this.showBasicTabCore = false;
                    this.showBasicTabSlubYarn = false;
                    this.showBasicTabMachineModel = false;
                    this.showBasicTabMaterialRatio = false;
                    this.showBasicTabYarnCountMax = false;
                    this.showBasicTabYarnCountMin = false;
                    this.showBasicTabSupplier = true;
                    this.showBasicTabIsReused = false;
                    this.showPacketWeight = true;
                } else if (typeName === '辅料') {
                    this.showBarCode = true;
                    this.showColor = true;
                    this.requiredPacketWeight = true;
                    this.requiredModels = true;

                    this.showMachiningProcess = false;
                    this.showBasicTabMaterial = false;
                    this.showBasicTabYarnUse = false;
                    this.showBasicTabCount = false;
                    this.showBasicTabSpinningProcess = false;
                    this.showBasicTabCore = false;
                    this.showBasicTabSlubYarn = false;
                    this.showBasicTabMachineModel = false;
                    this.showBasicTabMaterialRatio = false;
                    this.showBasicTabYarnCountMax = false;
                    this.showBasicTabYarnCountMin = false;
                    this.showBasicTabSupplier = false;
                    this.showBasicTabIsReused = false;
                    this.showPacketWeight = false;
                } else if (typeName === '机物料') {
                    this.showBarCode = true;
                    this.showColor = true;
                    this.requiredPacketWeight = true;
                    this.requiredModels = true;

                    this.showMachiningProcess = false;
                    this.showBasicTabMaterial = false;
                    this.showBasicTabYarnUse = false;
                    this.showBasicTabCount = false;
                    this.showBasicTabSpinningProcess = false;
                    this.showBasicTabCore = false;
                    this.showBasicTabSlubYarn = false;
                    this.showBasicTabMachineModel = true;
                    this.showBasicTabMaterialRatio = false;
                    this.showBasicTabYarnCountMax = false;
                    this.showBasicTabYarnCountMin = false;
                    this.showBasicTabSupplier = false;
                    this.showBasicTabIsReused = false;
                    this.showPacketWeight = false;
                } else if (typeName === '副产品') { // 原料成分、配比、加工工序
                    this.showBarCode = true;
                    this.showColor = true;
                    this.requiredPacketWeight = true;
                    this.requiredModels = true;

                    this.showMachiningProcess = true;
                    this.showBasicTabMaterial = true;
                    this.showBasicTabYarnUse = false;
                    this.showBasicTabCount = false;
                    this.showBasicTabSpinningProcess = false;
                    this.showBasicTabCore = false;
                    this.showBasicTabSlubYarn = false;
                    this.showBasicTabMachineModel = false;
                    this.showBasicTabMaterialRatio = true;
                    this.showBasicTabYarnCountMax = false;
                    this.showBasicTabYarnCountMin = false;
                    this.showBasicTabSupplier = false;
                    this.showBasicTabIsReused = true;
                    this.showPacketWeight = true;
                } else {
                    this.showBarCode = true;
                    this.showColor = true;
                    this.requiredPacketWeight = true;
                    this.requiredModels = true;

                    this.showMachiningProcess = false;
                    this.showBasicTabMaterial = false;
                    this.showBasicTabYarnUse = false;
                    this.showBasicTabCount = false;
                    this.showBasicTabSpinningProcess = false;
                    this.showBasicTabCore = false;
                    this.showBasicTabSlubYarn = false;
                    this.showBasicTabMachineModel = false;
                    this.showBasicTabMaterialRatio = false;
                    this.showBasicTabYarnCountMax = false;
                    this.showBasicTabYarnCountMin = false;
                    this.showBasicTabSupplier = false;
                    this.showBasicTabIsReused = false;
                    this.showPacketWeight = false;
                };
            } else {
                this.showMachiningProcess = false;
                this.showBasicTabMaterial = false;
                this.showBasicTabYarnUse = false;
                this.showBasicTabCount = false;
                this.showBasicTabSpinningProcess = false;
                this.showBasicTabCore = false;
                this.showBasicTabSlubYarn = false;
                this.showBasicTabMachineModel = false;
                this.showBasicTabMaterialRatio = false;
                this.showBasicTabYarnCountMax = false;
                this.showBasicTabYarnCountMin = false;
                this.showBasicTabSupplier = false;
                this.showBasicTabIsReused = false;
                this.showPacketWeight = false;
            };
        },
        // 根据适用工序显示克重、米长、捻度
        byWorkProcessShowBasic (name) {
            if (name.indexOf('细纱') !== -1) {
                this.showBasicTabTwist = true;
                this.showBasicTabGramWeight = false;
                this.showBasicTabMeters = false;
            } else if (name.indexOf('络筒') !== -1) {
                this.showBasicTabTwist = true;
                this.showBasicTabGramWeight = false;
                this.showBasicTabMeters = false;
            } else if (name.indexOf('粗纱') !== -1) {
                this.showBasicTabTwist = true;
                this.showBasicTabGramWeight = true;
                this.showBasicTabMeters = true;
            } else if (name.indexOf('并') !== -1) { // 并条
                this.showBasicTabTwist = false;
                this.showBasicTabGramWeight = true;
                this.showBasicTabMeters = true;
            } else if (name.indexOf('梳棉') !== -1) {
                this.showBasicTabTwist = false;
                this.showBasicTabGramWeight = true;
                this.showBasicTabMeters = true;
            } else {
                this.showBasicTabTwist = false;
                this.showBasicTabGramWeight = false;
                this.showBasicTabMeters = false;
            };
        },
        // 拼树
        toTree (data) {
            data.forEach((item) => {
                delete item.children;
            });
            let map = {};
            data.forEach((item) => {
                map[item.id] = item;
            });
            let val = [];
            data.forEach((item) => {
                let parent = map[item.parentId];
                if (parent) {
                    item.title = item.code + ' ' + item.name;
                    item.label = item.code + ' ' + item.name;
                    item.value = item.id;
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    item.title = item.name;
                    item.label = item.name;
                    item.value = item.id;
                    val.push(item);
                }
            });
            return val;
        },
        initUpload () {
            this.defaultList = [{
                'name': '1',
                'url': defaultImgPath
            }];
            this.uploadList = [{
                name: '1',
                percentage: 100,
                status: 'finished',
                uid: 1550464027960,
                url: defaultImgPath
            }];
            this.$refs.upload.fileList = [{
                name: '1',
                percentage: 100,
                status: 'finished',
                uid: 1550464027960,
                url: defaultImgPath
            }];
            this.$set(this.$refs.upload.fileList[0], 'url', defaultImgPath);
            this.$set(this.$refs.upload.fileList[0], 'status', 'finished');
        },
        handleBeforeUpload () {
            this.$refs.upload.fileList.splice(0, 1);
            const check = this.uploadList.length < 5;
            if (!check) {
                emptyTips(this, '超出上传的最多数量!', 'error');
            };
            return check;
        },
        handleMaxSize (file) {
            emptyTips(this, '上传的图片太大了!', 'error');
        },
        handleFormatError (file) {
            emptyTips(this, '上传失败,仅支持jpg,jpeg,png格式!', 'error');
        }
    }
};
