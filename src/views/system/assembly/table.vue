<template>
    <div>
        <table style="width: 100%">
            <tbody>
                <tr v-for="(item, index) of row.children" :key="index">
                    <td class="td tdFirst">{{item.moduleName}}<a @click="addAssembly(item)">[添加权限]</a></td>
                    <!--<td class="td">{{item.age}}</td>-->
                    <td class="td"><span v-for="(right, index) of item.rightItems" :key="index"><span>{{right.rightName}}</span><a @click="getAssemblyDetail(item, right.id)" class="rightMargin">({{right.rightCode}})</a></span></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    // import assemblyJs from './assemblyJs';
    export default {
        // ...assemblyJs,
        props: {
            row: Object
        }
    };
</script>

<style scoped>
    .td {
        /*width: 33.33%;*/
        padding-left: 16px;
        background-color: #f8f8f9!important;
    }
    .tdFirst{
        width: 200px;
    }
    .rightMargin{
        margin-right: 10px;
    }
</style>
