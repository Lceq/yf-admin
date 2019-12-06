

import { proxy } from '../../ajax/http';
// BOM
export default {
    // 标准bom接口
    bomSaveRequest (params) {
        return proxy.call('bom.save', params);
    },
    bomProcessPreviousStepRequest (params) {
        return proxy.call('bom.process.previousStep', params);
    },
    bomProcessSave (params) {
        return proxy.call('bom.process.save', params);
    },
    bomDeleteRequest (params) {
        return proxy.call('bom.delete', params);
    },
    bomCancelRequest (params) {
        return proxy.call('bom.cancel', params);
    },
    bomApproveRequest (params) {
        return proxy.call('bom.approve', params);
    },
    bomUnApproveRequest (params) {
        return proxy.call('bom.unapprove', params);
    },
    bomCloseRequest (params) {
        return proxy.call('bom.close', params);
    },
    bomUnCloseRequest (params) {
        return proxy.call('bom.unclose', params);
    },
    bomDetailRequest (params) {
        return proxy.call('bom.detail', params);
    },
    bomSubmitRequest (params) {
        return proxy.call('bom.submit', params);
    },
    bomUnapproveRequest (params) {
        return proxy.call('bom.unapprove', params);
    },

    // 制造bom接口
    prdBomProcessSaveRequest (params) {
        return proxy.call('prd.bom.process.save', params);
    },
    listHttp (params) {
        return proxy.call('prd.bom.list', params);
    },
    saveHttp (params) {
        return proxy.call('prd.bom.save', params);
    },
    saveBomChild (params) {
        return proxy.call('prd.bom.process.save', params);
    },
    leftMenuListHttp (params) {
        return proxy.call('prd.bom.stateCount', params);
    },
    unapproveHttp (params) {
        return proxy.call('prd.bom.unapprove', params);
    },
    approveHttp (params) {
        return proxy.call('prd.bom.approve', params);
    },
    submitHttp (params) {
        return proxy.call('prd.bom.submit', params);
    },
    cancelHttp (params) {
        return proxy.call('prd.bom.cancel', params);
    },
    closeHttp (params) {
        return proxy.call('prd.bom.close', params);
    },
    uncloseHttp (params) {
        return proxy.call('prd.bom.unclose', params);
    },
    deleteHttp (params) {
        return proxy.call('prd.bom.delete', params);
    },
    prdBomDetailRequest (params) {
        return proxy.call('prd.bom.detail', params);
    },
    prdBomProcessDetailRequest (params) {
        return proxy.call('prd.bom.process.detail', params);
    },
    previousStepDetailHttp (params) {
        return proxy.call('prd.bom.process.previousStep', params);
    },
    rdNoticeMachineSpecObtainByPrdNoticeId (params) {
        return proxy.call('prd.notice.machine.spec.obtainByPrdNoticeId', params);
    } ,
    prdNoticeMachineSpecSaveAll (params) {
        return proxy.call('prd.notice.machine.spec.saveAll', params);
    },
    userList (params) {
        return proxy.call('user.list', params);
    },
    // prdNoticeMachineSpecSaveAll (params) {
    //     return proxy.call('prd.notice.machine.spec.saveAll', params);
    // }


};
