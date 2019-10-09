<template>
    <div>
        <modal
            :isShow="showGroupMachine"
            :loading="groupMachineLoading"
            :title="'机台分配'"
            :width="800"
            :isSubmit="isCouldSave"
            :isCancel="isCouldSave"
            @submit="groupMachineSubmit"
            @cancel="groupMachineCancel"
        >
            <div slot="content">
                <div class="flexLayOutBetween">
                    <p><span class="fontBold">当前日期：</span><span class="">{{ curDate }}</span></p>
                    <p><span class="fontBold">当前车间：</span>{{ curWorkShopName }}</p>
                    <p><span class="fontBold">当前班次：</span>{{ curShiftName }}</p>
                    <p><span class="fontBold">当前班组：</span>{{ curGroupName }}</p>
                </div>
                <Table class="marginBottom" border ref="selection" :height="550" :loading="groupMachineTableLoading" size="small" :columns="groupMachineColumns" :data="groupMachineData"></Table>
            </div>
        </modal>
        <select-machines
                :userMachineData="userMachineData"
                :isShowSelectMachine="isShowSelectMachine"
                :saveSuccess="saveSuccess"
                @cancel="cancelUserMachine"
                @submit="submitUserMachine"
        ></select-machines>
    </div>
</template>
<script>
import groupMachine from './group-machine';
export default {
    ...groupMachine,
    name: 'group-machine'
};
</script>
<style scoped>
</style>
