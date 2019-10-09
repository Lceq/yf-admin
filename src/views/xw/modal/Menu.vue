<template>
    <div>
        <Card>
            <Menu :open-names="['1']" :active-name="'1-2'" @on-open-change="changeSupMenu" @on-select="changeMenu" >
                <Submenu v-for="(item, index) of menu" :key="index" :name="item.id + ''">
                    <template slot="title">
                        <Icon type="ios-analytics" />
                        Navigation One
                    </template>
                    <MenuGroup v-for="(g, index) of item.groups" :key="index">
                        <MenuItem :name="g.id">{{g.name}}</MenuItem>
                    </MenuGroup>
                </Submenu>
            </Menu>
        </Card>
    </div>
</template>

<script>
export default {
    // name: 'Menu'
    data () {
        return {
            menu: [
                {
                    id: 1,
                    name: 'name1',
                    groups: [
                        {
                            id: '1-1',
                            name: 'option1'
                        },
                        {
                            id: '1-2',
                            name: 'option2'
                        },
                        {
                            id: '1-3',
                            name: 'option3'
                        },
                        {
                            id: '1-4',
                            name: 'option4'
                        }
                    ]
                },
                {
                    id: 2,
                    name: 'name2',
                    groups: [
                        {
                            id: '2-1',
                            name: 'opt1'
                        },
                        {
                            id: '2-2',
                            name: 'opt2'
                        },
                        {
                            id: '2-3',
                            name: 'opt3'
                        },
                        {
                            id: '2-4',
                            name: 'opt4'
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        changeSupMenu (val) {

        },
        changeMenu (val) {

        }
    }
};
</script>

<style scoped>

</style>
