<template>
    <Card>
        <Row class="marginBottom">
            <Col>
                <span>选择车间：</span>
                <Select class="workshop" v-model="currentWorkshopId" @on-change="ChangeWorkshop">
                    <Option class="workshop-list" v-for="item in workShopList" :value="item.deptId" :key="item.deptId">
                       {{ item.deptName }}
                    </Option>
                </Select>
                <Button type="success" @click="evBatch(days)" :disabled="isDisabled">批量排班</Button>
            </Col>
        </Row>
        <Row>
            <Col>
                <div class="selectHead">
                    <span class="month last-month textLeft"><a @click="clickLastMonth">{{lastMonth}}月</a></span>
                    <span class="month cur-month textCenter">{{currentYear}}年{{currentMonth}}月</span>
                    <span class="month next-month textRight"><a @click="clickNextMonth">{{nextMonth}}月</a></span>
                </div>
            </Col>
            <Col>
                <table class="calendar-table" border="0" cellPadding="15px" cellSpacing="0">
                    <thead>
                    <tr>
                        <th class="calendar-week">日</th>
                        <th class="calendar-week">一</th>
                        <th class="calendar-week">二</th>
                        <th class="calendar-week">三</th>
                        <th class="calendar-week">四</th>
                        <th class="calendar-week">五</th>
                        <th class="calendar-week">六</th>
                    </tr>
                    </thead>
                    <tbody>
                    <!--<CheckboxGroup v-model="calendarSixData">-->
                        <tr v-for="(weekData, index) of calendarSixData" :class="{isMoreSeven: moreSeven}">
                            <td class="calendar" v-for="(dayData, index) of weekData"
                                :class="{isNotMonth: calendarJudge(dayData).isMonth !== currentMonth, isToday:calendarJudge(dayData).isToday === nowToady}"
                                @dblclick="setShiftType(dayData)">
                                <div class="calendarBox">
                                    <!--复选框批量排班日期选择-->
                                    <Checkbox class="calendarChecked" v-if="calendarJudge(dayData).isSet === false" v-model="dayData.isCheck"
                                              @on-change="evCalendarChecked($event,dayData)">
                                    </Checkbox>

                                    <div class="calendar-day textCenter">{{dayData.day}}</div>
                                    <div class="calendar-data">
                                        <div class="isNotSet" v-if="calendarJudge(dayData).isSet === false">
                                            <a @click="shiftTypeSet(dayData)">日历班制</a><br>
                                        </div>
                                        <div class="shift-block" v-if="calendarJudge(dayData).isSet===true"
                                             :class="{istwice: calendarJudge(dayData).shiftType === 'isTwice', isThird:  calendarJudge(dayData).shiftType === 'isThird', isFullTime:  calendarJudge(dayData).shiftType === 'isFullTime'}">
                                            <a class="shiftType" @click="changeShiftType(dayData)">{{dayData.shiftTypeName}}</a>
                                            <p class="shiftClass" v-for="item in dayData.shifts">
                                                <Icon class="iconStyle" type="md-flag"></Icon>
                                                {{item.shiftName}}：
                                                <span class="shiftGroup"><a
                                                        @click="getGroupUser(dayData ,et, dayData.belongDate)"
                                                        v-for="et in item.groups">{{et.groupName}}</a></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    <!--</CheckboxGroup>-->
                    </tbody>
                </table>
            </Col>
        </Row>
        <!--设置排班弹框-->
        <modal
                :isShow="SchedulingModalShow"
                :loading="SchedulingLoading"
                :width="800"
                :title="SchedulingTitle"
                @cancel="SchedulingCancel"
                @submit="SchedulingSubmit"
        >
            <div slot="content" style="height: 250px;">
                <Row>
                    <Col>
                        <p class="marginBottom">车间：<span class="marginRight">{{curWorkShopName}}</span><span>({{curTimeJoin}})</span>
                        </p>
                        <p class="marginBottom">班制：
                            <RadioGroup v-model="defaultShiftId" @on-change="ChangeShiftTypeRadio">
                                <!--eslint-disable-->
                                <Radio v-for="item of shiftType" :label="item.id" :key="item.id">{{item.name}}</Radio>
                            </RadioGroup>
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table ref="selection" border size="small" :columns="shiftGroupTableColumns"
                               :data="shiftGroupTableData"></Table>
                    </Col>
                </Row>
            </div>
        </modal>
        <modal
                :isShow="shiftGroupModalShow"
                :loading="shiftGroupLoading"
                :width="800"
                :isSubmit="false"
                :isCancel="false"
                @cancel="shiftGroupCancel"
                :title="'人员(' + shiftGroupTitle + ')'"
        >
            <div slot="content">
                <Row class="marginBottom">
                    <Col>
                        <Button type="success" :disabled="addUserDisabled" @click="addCurShiftGroupUser">添加当班人员</Button>
                        <Button type="error" :disabled="removeUserDisabled" @click="removeCurShiftGroupUser">移除当班人员
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table ref="selection" border height="600" :loading="shiftGroupUserLoading" size="small"
                               :columns="shiftGroupUserColumns" :data="shiftGroupUserData"
                               @on-selection-change="selectRemoveGroupUser"></Table>
                    </Col>
                </Row>
            </div>
        </modal>
        <modal
                :isShow="userModalShow"
                :loading="userLoading"
                :width="800"
                @cancel="userCancel"
                @submit="userSubmit"
                :title="'班组用户'"
        >
            <div slot="content">
                <Row class="marginBottom">
                    <Col>
                        <div class="userForm">
                            <span>班组：</span>
                            <!--<Cascader class="marginRight userFormInput" :change-on-select="true" :data="departDataList" @on-change="changeDepart" v-model="curDepart"></Cascader>-->
                            <Select class="workshop" v-model="curDepartId" @on-change="changeDepartSelect">
                                <Option class="workshop-list" v-for="item in shiftGroup" :value="item.groupId"
                                        :key="item.groupId">{{ item.groupName }}
                                </Option>
                            </Select>
                            <span class="userMargin">人员姓名：</span>
                            <Input class="userFormInput" placeholder="请输入姓名查询" v-model="searchName"></Input>
                        </div>
                        <div class="userButton textRight">
                            <Button type="success" @click="searchUserResult(searchName)">查询</Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col class="marginBottom">
                        <Table ref="selection" size="small" border height="540" @on-selection-change="selectAllUser"
                               @on-select="selectUser" @on-select-cancel="cancelSelectUser" :columns="userColumns"
                               :data="userData"></Table>
                    </Col>
                </Row>
                <!--<Row>-->
                <!--<Col class="textRight">-->
                <!--<Page show-elevator show-total show-sizer :total="userTotal" size="small" placement="top" :page-size="userPageSize" :page-size-opts="userPageSizeOpts" @on-change="changePageIndex" @on-page-size-change="changePageOpts"></Page>-->
                <!--</Col>-->
                <!--</Row>-->
            </div>
        </modal>
        <modal
                :isShow="adjustPostShow"
                :loading="adjustPostLoading"
                :width="400"
                @cancel="adjustPostCancel"
                @submit="adjustPostSubmit"
                :title="'设置岗位'"
        >
            <div slot="content" style="height: 200px;">
                <Row>
                    <Col>
                        <p class="marginBottom"><span>姓名：</span>{{adjustPostUserName}}</p>
                        <p style="vertical-align: top"><span style="vertical-align: top">岗位：</span>
                            <Select style="width:320px; vertical-align: top" v-model="postIds" filterable multiple>
                                <OptionGroup v-for="(pList, index) of postBasicList" :key="index"
                                             :label="pList.typeName">
                                    <Option v-for="item in pList.data" :value="item.id" :key="item.id">{{ item.name }}
                                    </Option>
                                </OptionGroup>
                            </Select>
                        </p>
                    </Col>
                </Row>
            </div>
        </modal>
        <modal
                :isShow="deleteShow"
                :loading="deleteLoading"
                :width="400"
                @cancel="deleteCancel"
                @submit="deleteSubmit"
                :title="'移除人员'"
        >
            <div slot="content">
                <Form :label-width="120" ref="deleteValidate" :model="deleteValidate" :rules="ruleDeleteValidate"
                      :show-message="false">
                    <Row>
                        <Col>
                            <FormItem label="移除原因：" prop="abnormityId" class="formItemMargin">
                                <!--<span>移除原因：</span>-->
                                <Select class="textLeft" :clearable="true" v-model="deleteValidate.abnormityId">
                                    <Option v-for="item in abnormityList" :value="item.id" :key="item.id">{{ item.name
                                        }}
                                    </Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <!--<Col span="12">-->
                        <!--<FormItem label="故障别名：" prop="alias" class="formItemMargin">-->
                        <!--<Input type="text" v-model="formValidate.alias" placeholder="请输入小类别名"/>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                    </Row>
                </Form>
            </div>
        </modal>
        <delete-warning
                :v-model="deleteWarningShow"
                :tipMsg="deleteWarningMessage"
                :loading="deleteWarningLoading"
                @cancel="deleteWarningCancel"
                @confirm="deleteWarningSubmit"
        ></delete-warning>
    </Card>
</template>

<script>
    import schedule from './schedule';

    export default {
        ...schedule
    };
</script>
<style scoped>
    .workshop {
        width: 150px;
    }

    .selectHead {
        width: 100%;
        background-color: #2d8cf0;
        font-size: 0;
        position: relative;
        top: 1px;
    }

    .month {
        font-size: 18px;
        line-height: 60px;
        display: inline-block;
        width: 33.33%;
        color: #fff;
        padding: 0 20px;
    }

    .month a {
        color: #fff;
    }

    .calendar-table {
        width: 100%;
        font-size: 0;
        border-top: 1px solid #dddee1;
        border-left: 1px solid #dddee1;
    }

    .calendar-table td, th {
        border-right: 1px solid #dddee1;
        border-bottom: 1px solid #dddee1;
    }

    .calendar-week {
        font-size: 14px;
        height: 60px;
        line-height: 60px;
        color: #495060;
        background-color: #eaeaea;
    }

    .calendar {
        height: 100px;
        width: 14.2857%;
    }

    .calendarBox {
        position: relative;
    }
    .calendarChecked{
        position: absolute;
        right: 2px;
        top: -25px;
        z-index: 1;
    }
    .isNotMonth .calendar-day {
        color: #e9e9e9 !important;
    }

    .calendar-day {
        vertical-align: middle;
        width: 30px;
        font-size: 18px;
        text-align: center;
        color: #999999;
        display: inline-block;
        /*float: left;*/
        /*font-size: 14px;*/
    }

    .calendar-data {
        vertical-align: middle;
        width: calc(100% - 30px);
        display: inline-block;
        /*float: left;*/
        font-size: 12px;
    }

    .isNotSet {
        display: inline-block;
        vertical-align: middle;
        width: calc(100% - 30px);
        font-size: 16px;
        text-align: center;
        margin-left: -10px;
    }

    .isNotSet a {
        color: #e9e9e9 !important;
        font-size: 16px;
        text-align: center;
    }

    .shiftType {
        font-size: 14px;
        margin: 10px 14px 0;
    }

    .isToday {
        box-shadow: 0px 0px 10px #9b9b9b;
    }

    .istwice {
        color: #ff9900 !important;
    }

    .istwice .shiftType {
        color: #ff9900 !important;
    }

    .istwice .shiftClass .shiftGroup a {
        color: #ff9900 !important;
    }

    .isThird {
        color: #19be6b !important;
    }

    .isThird .shiftType {
        color: #19be6b !important;
    }

    .isThird .shiftClass .shiftGroup a {
        color: #19be6b !important;
    }

    .isFullTime {
        color: #2d8cf0 !important;
    }

    .isFullTime .shiftType {
        color: #2d8cf0 !important;
    }

    .isFullTime .shiftClass .shiftGroup a {
        color: #2d8cf0 !important;
    }

    .isMoreSeven:last-child {
        display: none;
    }

    .shiftClass {
        margin-top: 10px;
    }

    .iconStyle {
        vertical-align: top;
        font-size: 12px;
        margin-top: 3px;
    }

    .shiftGroup {
        font-size: 12px;
        vertical-align: top;
        display: inline-block;
        width: calc(100% - 64px)
    }

    .shiftGroup a {
        margin-right: 10px;
    }

    .userButton {
        width: 68px;
        float: right;
        display: inline-block
    }

    .userForm {
        width: 700px;
        float: left;
        display: inline-block
    }

    .userMargin {
        margin-left: 10px;
    }

    .userFormInput {
        display: inline-block;
        width: 270px;
    }
</style>
