<template>
    <div>
        <Card>
            <Row class="flexBetween" id="selectedHeight">
                <Col class="leftFlex">
                    <Button icon="md-add" class="buttonBottom" @click="add" type="primary">新增</Button>
                    <Dropdown class="marginButtonLeft" trigger="click">
                        <Button class="marginBottom" :disabled="!selectIds.length" type="primary" href="javascript:void(0)">
                            审核
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem  @click.native="audit">审核</DropdownItem>
                            <DropdownItem @click.native="unAudit">反审核</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Button :disabled="!selectIds.length" class="marginBottom marginButtonLeft" type="error" @click="deleteList" icon="ios-trash">删除</Button>
                </Col>
                <Col>
                    <Select clearable class="formWidth marginBottom" v-model="workshopId" placeholder="请选择车间">
                        <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <!--<Select clearable class="formWidth marginBottom" v-model="processId" placeholder="请选择工序">-->
                        <!--<Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                    <!--</Select>-->
                    <!--<Select clearable class="formWidth marginBottom" v-model="stateId" placeholder="请选择数据状态">-->
                        <!--<Option v-for="item in stateList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                    <!--</Select>-->
                    <!--<Input class="formWidth marginBottom" type="text" v-model="codeName" placeholder="输入区域编号或名称"/>-->
                    <Button class="marginBottom" type="primary" @click="searchList">搜索</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table class="marginBottom" @on-selection-change="select" :height="tableHeight" ref="selection" size="small" border :columns="columns" :data="list"></Table>
                    <Page class="textRight" :total="total" show-elevator :page-size-opts="pageOpts" show-total :page-size="pageSize" @on-change="changePageIndex" show-sizer @on-page-size-change="changePageSize"></Page>
                </Col>
            </Row>
        </Card>
        <modal
                :isShow="show"
                :loading="loading"
                :title="title"
                :width="800"
                :isSubmit="isSave"
                :isCancel="isSave"
                @submit="submit"
                @cancel="cancel"
        >
            <div slot="content">
                <Form :label-width="120" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col span="12">
                            <FormItem label="所属车间：" prop="workshopId" class="formItemMargin">
                                <Select  class=" " v-model="formValidate.workshopId" placeholder="请选择车间">
                                    <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="所属工序：" prop="processId" class="formItemMargin">
                                <Select  class=" " v-model="formValidate.processId" placeholder="请选择工序">
                                    <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="电压最大值：" prop="voltageMax" class="formItemMargin">
                                <!--<Input class=" " type="text" v-model="formValidate.settingTemperature" placeholder="请输入温度"/>-->
                                <InputNumber class="formWidthModal" v-model="formValidate.voltageMax" placeholder="请输入最大电压"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="电压最小值：" prop="voltageMin" class="formItemMargin">
                                <!--<Input class=" " type="text" v-model="formValidate.temperatureDeviation" placeholder="请输入温度偏差值"/>-->
                                <InputNumber class="formWidthModal" v-model="formValidate.voltageMin" placeholder="请输入最小电压"></InputNumber>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="功率因数最大值：" prop="powerFactorMax" class="formItemMargin">
                                <!--<Input class=" " type="text" v-model="formValidate.temperatureDeviation" placeholder="请输入温度偏差值"/>-->
                                <InputNumber class="formWidthModal" v-model="formValidate.powerFactorMax" placeholder="请输入最大功率因数"></InputNumber>

                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="功率因数最小值：" prop="powerFactorMin" class="formItemMargin">
                                <!--<Input class=" " type="text" v-model="formValidate.temperatureDeviation" placeholder="请输入温度偏差值"/>-->
                                <InputNumber class="formWidthModal" v-model="formValidate.powerFactorMin" placeholder="请输入最小功率因数"></InputNumber>

                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="电流上线：" prop="currentMax" class="formItemMargin">
                                <!--<Input class=" " type="text" v-model="formValidate.settingTemperature" placeholder="请输入温度"/>-->
                                <InputNumber class="formWidthModal" v-model="formValidate.currentMax" placeholder="请输入电流上线"></InputNumber>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div class="marginBottom" v-if="editId">
                    <xw-operation-log-modal
                        :createName="createName"
                        :createTime="createTime"
                        :updateName="updateName"
                        :updateTime="updateTime"
                        :operationList="operationList">
                    </xw-operation-log-modal>
                </div>
            </div>
        </modal>
        <delete-warning
                :v-model="deleteWarnShow"
                :tipMsg="deleteWarnMsg"
                :loading="deleteWarnLoading"
                @cancel="deleteWarnCancel"
                @confirm="deleteWarnConfirm"
        ></delete-warning>
    </div>
</template>

<script>
    import processWarning from './process-warning';
    export default {
        ...processWarning
    };
</script>

<style scoped>
    .formWidthModal{
        width: 100%;
    }
</style>
