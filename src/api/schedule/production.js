import { post } from '../../ajax/http';
// 工艺路线
export default {
    getMachineOnDuty (params) {
        return post('duty/machine/on/duty', params);
    },
    getMachineCancelDuty (params) {
        return post('duty/machine/cancel/duty', params);
    },
    getDutyMachineList (params) {
        return post('duty/machine/list', params);
    },
    getDutyMachineUpdate (params) {
        return post('duty/machine/update', params);
    }
};
