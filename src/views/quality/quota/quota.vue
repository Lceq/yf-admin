<template>
    <div>
        <Card>
            <Row class="flexBetween" id="selectedHeight">
                <Col class="leftFlex">
                    <Button icon="md-add" class="buttonBottom" @click="addNewQmProduct" type="primary">新增</Button>
                    <Dropdown class="marginButtonLeft" trigger="click">
                        <Button class="marginBottom" :disabled="auditDisabled" type="primary" href="javascript:void(0)">
                            审核
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem  @click.native="auditQmProduct">审核</DropdownItem>
                            <DropdownItem @click.native="unAuditQmProduct">反审核</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Button class="marginBottom marginButtonLeft" :disabled="auditDisabled" type="error" icon="ios-trash" @click="deleteQmProduct">删除</Button>
                </Col>
                <Col>
                    <Select clearable class="formWidth marginBottom" v-model="curQmProductProcessId" placeholder="请选择工序">
                        <Option v-for="item in processList" :style="item.style"  :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Select clearable class="formWidth marginBottom" v-model="curQmProductAuditStateId" placeholder="请选择数据状态">
                        <Option v-for="item in auditStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Input class="formWidth marginBottom" type="text" v-model="machineCode" placeholder="请输入产品编码或名称"/>
                    <Button icon="ios-search" class="marginBottom" type="primary" @click="searchQmProduct">搜索</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table :height="tableHeight" :loading="qmProductLoading" @on-selection-change="selectQmProduct" class="marginBottom" border :columns="qmProductColumns" :data="qmProductList" size="small"></Table>
                    <Page class="textRight" :total="qmProductTotal" show-elevator :page-size-opts="qmProductPageOpts" show-total :page-size="qmProductPageSize" @on-change="changePageIndexQmProduct" show-sizer @on-page-size-change="changePageSizeQmProduct"></Page>
                </Col>
            </Row>
        </Card>
        <quota-modal
            :selectProductCodeState="selectProductCodeState"
            :isCouldSave="isCouldSave"
            :qmProductDetail="curQmProductDetail"
            :saveModalState="qmProductModalShow"
            @cancel="qmProductModalCancel"
            @submit="qmProductModalSubmit"
        >
        </quota-modal>
        <!--<quota-modal-copy-->
            <!--:selectProductCodeState="selectProductCodeStateCopy"-->
            <!--:isCouldSave="isCouldSaveCopy"-->
            <!--:qmProductDetail="curQmProductDetailCopy"-->
            <!--:saveModalState="qmProductModalShowCopy"-->
            <!--@cancel="qmProductModalCancelCopy"-->
            <!--@submit="qmProductModalSubmitCopy"-->
        <!--&gt;-->
        <!--</quota-modal-copy>-->
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
import qualityQuota from './quality-quota';
export default {
    ...qualityQuota,
    name: 'qualityQuota'
};
</script>

<style scoped>

</style>
