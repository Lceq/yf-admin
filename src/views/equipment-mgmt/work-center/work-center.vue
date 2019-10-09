<template>
    <Card>
        <Row class="flexBetween" id="selectedHeight">
            <Col class="leftFlex">
                <Button class="marginBottom" type="primary" icon="md-add" @click="addWorkCenter">新增</Button>
                <Dropdown class="marginBottom marginButtonLeft" trigger="click">
                    <Button :disabled="auditDisabled" type="primary" href="javascript:void(0)">
                        审核
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem  @click.native="auditWorkCenter">审核</DropdownItem>
                        <DropdownItem @click.native="unAuditWorkCenter">撤销审核</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown class="marginBottom marginButtonLeft" trigger="click">
                    <Button :disabled="auditDisabled" type="error" href="javascript:void(0)">
                        禁用
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem  @click.native="disableWorkCenter">禁用</DropdownItem>
                        <DropdownItem  @click.native="enableWorkCenter">启用</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button :disabled="auditDisabled" icon="ios-trash" class="marginBottom marginButtonLeft" type="error" @click="deleteWorkCenter">删除</Button>
            </Col>
            <Col>
                <Select class="formWidth marginBottom" v-model="workCenterWorkshopId" placeholder="请选择车间">
                    <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                </Select>
                <Select clearable class="formWidth marginBottom" v-model="workCenterProcessId" placeholder="请选择工序">
                    <Option v-for="item in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select clearable class="formWidth marginBottom" v-model="curAuditStateId" placeholder="请选择数据状态">
                    <Option v-for="item in auditStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select clearable class="formWidth marginBottom" v-model="curEnableStateId" placeholder="请选择禁用状态">
                    <Option v-for="item in enableStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Input clearable v-model="code" placeholder="请输入编码或名称" class="formWidth marginBottom" />
                <Button icon="ios-search" class="marginBottom" type="primary" @click="searchWorkCenter">搜索</Button>
            </Col>
        </Row>
        <Row>
            <Col>
                <Table border :height="tableHeight" :loading="workCenterLoading" class="marginBottom" :columns="workCenterColumns" :data="workCenterList" @on-selection-change="selectWorkCenter" size="small"></Table>
                <Page class="textRight" :total="workCenterTotal" show-elevator :page-size-opts="workCenterPageOpts" show-total :page-size="workCenterPageSize" @on-change="changePageIndexWorkCenter" show-sizer @on-page-size-change="changePageSizeWorkCenter"></Page>
            </Col>
        </Row>
        <modal
                :isShow="workCenterModalShow"
                :loading="workCenterModalLoading"
                :width="800"
                :isSubmit="isCouldSave"
                :isCancel="isCouldSave"
                @cancel="workCenterModalCancel"
                @submit="workCenterModalSubmit('workCenterModal')"
                :title="workCenterModalTitle">
            <div slot="content">
                <Form :label-width="80" ref="workCenterModal" :model="workCenterModal" :rules="workCenterModelValidate" :show-message="false">
                    <Row>
                        <Col span="12">
                            <FormItem label="编码：" prop="code" class="formItemMargin">
                                <p v-if="!isCouldSave"><span class="spanBlock spanContent">{{ workCenterModal.code }}</span></p>
                                <Input v-else type="text" class="formModalWidth" v-model="workCenterModal.code" placeholder="请输入机型编码"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="名称：" prop="name" class="formItemMargin">
                                <p v-if="!isCouldSave"><span class="spanBlock spanContent">{{ workCenterModal.name }}</span></p>
                                <Input v-else type="text" class="formModalWidth"  v-model="workCenterModal.name" placeholder="请输入机型名称"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row class="marginBottom">
                        <Col span="12">
                            <FormItem label="所属车间：" class="formItemMargin" prop="workshopId">
                                <p v-if="!isCouldSave"><span class="spanBlock spanContent">{{ workCenterModal.workshopName }}</span></p>
                                <Select v-else class="formModalWidth" v-model="workCenterModal.workshopId">
                                    <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                </Select>
                                <!--<p v-if="isEdit"><span class="spanBlock spanContent">{{ workCenterModal.workshopName }}</span></p>-->
                            </FormItem>
                        </Col>
                        <Col  span="12">
                            <FormItem label="所属工序：" class="formItemMargin" prop="processId">
                                <p v-if="!isCouldSave"><span class="spanBlock spanContent">{{ workCenterModal.processName }}</span></p>
                                <Select v-else @on-change="changeProcess" class="formModalWidth"  v-model="workCenterModal.processId" clearable>
                                    <Option :style="item.style" v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                                <!--<p v-if="isEdit"><span class="spanBlock spanContent">{{ workCenterModal.processName }}</span></p>-->
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Tabs v-model="defaultName">
                    <TabPane v-for="(list, index) of workCenterResourceList" :key="index" :label="list.label" :name="list.name">
                        <Button class="marginBottom" type="success" @click="addMachinesToCenter(list.name)">{{ list.button }}</Button>
                        <Table class="marginBottom" border :height="260" :data="list.data" :columns="list.columns"></Table>
                    </TabPane>
                </Tabs>
                <!--<Button class="marginBottom" type="success" @click="addMachinesToCenter">添加机台资源</Button>-->
                <!--<Table class="marginBottom" border :height="260" :data="workCenterModalData" :columns="workCenterModalColumns"></Table>-->
                <div>
                    <other-message
                        :createTime="createTime"
                        :createName="createName"
                        :updateName="updateName"
                        :updateTime="updateTime"
                        :auditName="auditName"
                        :auditTime="auditTime"
                    ></other-message>
                </div>
            </div>
        </modal>
        <add-machines
         :addMachinesShow="addMachinesShow"
         :processId="workCenterModal.processId + ''"
         :workshopId="workCenterModal.workshopId + ''"
         :selectedMachineList="selectedMachineList"
         @cancel="addMachinesCancel"
         @submit="addMachinesSubmit"
        ></add-machines>
        <xw-select-product-work-center
            @selectProducts="selectProducts"
            @cancel="selectProductsCancel"
            :selectProductList="selectProductList"
            :processId="workCenterModal.processId + ''"
            :xwSelectProductShow="xwSelectProductShow"
        >
        </xw-select-product-work-center>
        <delete-warning
                :v-model="deleteWarnShow"
                :tipMsg="deleteWarnMsg"
                :loading="deleteWarnLoading"
                @cancel="deleteWarnCancel"
                @confirm="deleteWarnConfirm"
        ></delete-warning>
    </Card>
</template>

<script>
import workCenter from './work-center';
export default {
    ...workCenter,
    name: 'work-center'
};
</script>

<style scoped>
.formModalWidth{
    width: 280px;
}
    .spanBlock{
        border-radius: 5px;
        padding-left: 10px;
        display: inline-block;
        width: 280px;
        height: 32px;
        line-height: 32px;
        background-color: #f8f8f8;
    }
</style>
