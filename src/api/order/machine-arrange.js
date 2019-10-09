import { post } from '../../ajax/http';
// 生产订单
export default({
    getMachineArrangeList (params) {
        return post('machine/', params);
    }
});
