<style lang="less">

</style>

<template>
    <div>
        <Row>
    	    <span v-show="button1" > <Button type="primary"  @click="addItem()">新增</Button></span>
            <span v-show="button2" > <Button type="primary"  @click="addItem2()">{{button2Title}}</Button></span>
            <div style="float:right;">

                <DatePicker v-show="datePicker" style="font-size:12px"
                        :open="open"
                        :value="value3"
                        confirm
                        type="daterange"
                        :options="options2"
                        placement="bottom-end"
                        @on-change="handleChange"
                        @on-clear="handleClear"
                        @on-ok="handleOk">
                        <a href="javascript:void(0)" @click="handleClick">
                            <Icon type="ios-calendar-outline"></Icon>
                            <template v-if="value3 === ''">选择时间</template>
                            <template v-else>{{ value3[0] }} ~ {{ value3[1] }}</template>
                        </a>
                    </DatePicker>


        	   <Input  icon="search" placeholder="请输入名字搜索..." @on-keydown="keydownSearch()" style="width: 160px;" v-model="keyword"/>
            <Button type="primary" shape="circle" icon="ios-search" @click="search()">搜索</Button>
           </div>
        </Row>
        <Row class="margin-top-10">
        	<Table :ref="refs" :columns="columnsList" :data="tableData" border ref="selection" @on-selection-change="handleRowSelectChange" @on-sort-change="sortChange"></Table>
    	</Row>
    	<Row>
            <Page :total="totalSize" :current="pageIndex" style="float:right; margin-top:10px;" @on-change='pageIndexChanged' show-total></Page>
        </Row>
    </div>
</template>

<script>
const editButton = (vm, h, params, index) => {
    return h('Tooltip', {
        props: {content: '编辑'}
    }, [h('Button', {
        props: {
            shape: 'circle',
            icon: 'edit',
            size: 'small',
            type: 'success'
        },
        style: {
            marginRight: '5px'
        },
        on: {
            click: () => {
                        	vm.$emit('on-edit', params.id);
            }
        }
    })]
    );
};
const deleteButton = (vm, h, params, index) => {
    return h('Tooltip', {
        props: {content: '删除'}
    }, [h('Button', {
        props: {
            shape: 'circle',
            icon: 'ios-trash-outline',
            size: 'small',
            type: 'error'
        },
        style: {
            marginRight: '5px'
        },
        on: {
            click: () => {
                        	vm.$Modal.confirm({
                        	    title: '删除确认',
                        	    content: '<p>确认删除发布 <span style="color:red" >' + params.name + '</span> 吗？</p>',
                        	    onOk: () => {
                        	        vm.$emit('on-delete', params.id);
                        	    },
                        	    onCancel: () => {

                        	    }
                        	});
            }
        }
    })]
    );
};

export default {
    name: 'mes-table',
    props: {
        refs: String,
        columnsList: Array,
        tableData: Array,
        pageIndex: Number,
        totalSize: Number,
        button2Title: String,
        button2: {
            type: Boolean,
            default: false
        },
        button1: {
            type: Boolean,
            default: true
        },
        datePicker: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            columns: [],
            keyword: '',
            open: false,
            value3: '',
            options2: {
                shortcuts: [
                    {
                        text: '最近一周',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            return [start, end];
                        }
                    },
                    {
                        text: '最近两周',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
                            return [start, end];
                        }
                    },
                    {
                        text: '最近三周',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 21);
                            return [start, end];
                        }
                    },
                    {
                        text: '最近一个月',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            return [start, end];
                        }
                    },
                    {
                        text: '最近三个月',
                        value () {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            return [start, end];
                        }
                    }
                ]
            }
        };
    },

    methods: {

    	init () {
    		this.columnsList.forEach(item => {
                if (item.handle) {
                    item.render = (h, param) => {
                        let currentRowData = this.tableData[param.index];
                        let children = [];
                        item.handle.forEach(item => {
                            if (item === 'edit') {
                                children.push(editButton(this, h, currentRowData, param.index));
                            } else if (item === 'delete') {
                                children.push(deleteButton(this, h, currentRowData, param.index));
                            }
                        });
                        return h('div', children);
                    };
                }
            });
    	},

    	keydownSearch () {
    	    // enter健
    	    if (event.keyCode == '13') {
    	        this.$emit('on-search', this.keyword);
    	    }
    	},

    	search () {
    		this.$emit('on-search', this.keyword);
    	},

    	pageIndexChanged (pageIndex) {
    	  	this.$emit('page-change', pageIndex);
    	},

    	addItem () {
    		this.$emit('on-add');
    	},

        addItem2 () {
            this.$emit('on-add2');
        },

        handleRowSelectChange (selection) {
            this.$emit('handle-row-select-change', selection);
        },

        sortChange (column) {
            this.$emit('handle-sort-change', column);
        },

        handleClick () {
            this.open = !this.open;
        },
        handleChange (date) {
            this.value3 = date;
        },
        handleClear () {
            this.open = false;
            this.value3 = '';
            this.$emit('handle-time-change', '');
        },
        handleOk () {
            this.open = false;
            this.$emit('handle-time-change', this.value3);
        }
    },

    created () {
        this.init();
    },

    watch: {
        tableData (data) {
            this.init();
        }
    }
};
</script>
