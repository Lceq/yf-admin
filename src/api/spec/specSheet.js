import { post, fetch } from '../../ajax/http';
// 工艺单
export default {
    listHttp (params) {
        return post('spec/sheet/list', params);
    },
    detailHttp (params) {
        return post('spec/sheet/detail', params);
    },
    saveHttp (params) {
        return post('spec/sheet/save', params);
    },
    disableHttp (params) {
        return post('spec/sheet/disable', params);
    },
    enableHttp (params) {
        return post('spec/sheet/enable', params);
    },
    auditHttp (params) {
        return post('spec/sheet/approve', params);
    },
    unapproveHttp (params) {
        return post('spec/sheet/unapprove', params);
    },
    submitHttp (params) {
        return post('spec/sheet/submit', params);
    },
    cancelHttp (params) {
        return post('spec/sheet/cancel', params);
    },
    deleteHttp (params) {
        return post('spec/sheet/delete', params);
    },
    auditStateListHttp (params) {
        return post('enum/audit/state', params);
    },
    disableStateListHttp (params) {
        return post('enum/spec/path/state', params);
    },
    specSheetModelHttp (params) {
        return post('spec/sheet/process/listBySheetId', params);
    },
    leftMenuListHttp (params) {
        return post('spec/sheet/stateCount', params);
    }
};
