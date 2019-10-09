<template>
    <Card>
        <Row>
            <Col>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">
                    <FormItem label="正常出勤：" prop="attendance">
                        <p>在上班考勤前<Input style="width: 100px;margin: 0 10px;" v-model="formValidate.attendance"></Input>分钟内签到有效</p>
                    </FormItem>
                    <FormItem label="正常签退：" prop="signBack">
                        <p>在下班考勤后<Input style="width: 100px;margin: 0 10px;" v-model="formValidate.signBack"></Input>分钟内签退有效</p>
                    </FormItem>
                    <FormItem label="迟到：" prop="late">
                        <p>在上班考勤后<Input style="width: 100px;margin: 0 10px;" v-model="formValidate.late"></Input>分钟外签到算迟到</p>
                    </FormItem>
                    <FormItem label="早退：" prop="LeaveEarly">
                        <p>在下班考勤前<Input style="width: 100px;margin: 0 10px;" v-model="formValidate.LeaveEarly"></Input>分钟外签退算早退</p>
                    </FormItem>
                    <FormItem label="备注："  prop="note">
                        <Input style="width: 300px;" v-model="formValidate.note" type="textarea" :rows="4" placeholder="请输入..."></Input>
                    </FormItem>
                    <FormItem>
                        <Button @click="handleReset('formValidate')" style="margin-right: 8px">重置</Button>
                        <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                    </FormItem>
                </Form>
            </Col>
        </Row>
    </Card>
</template>

<script>
export default {
    data () {
        return {
            formValidate: {
                attendance: 120,
                signBack: 120,
                late: 30,
                LeaveEarly: 30
            },
            // formValidate: {},
            ruleValidate: {
                attendance: [
                    { required: true, trigger: 'blur' }
                ],
                signBack: [
                    { required: true, trigger: 'blur' }
                ],
                late: [
                    { required: true, trigger: 'blur' }
                ],
                LeaveEarly: [
                    { required: true, trigger: 'blur' }
                ]
            }
        };
    }
};
</script>

<style scoped>

</style>
