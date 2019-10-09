<template>
    <div>
        <select-product>
        </select-product>
    </div>
</template>

<script>
import selectProduct from '../../components/selectProduct';
import { mapState } from 'vuex';
// import store from '../../../store';
export default {
    name: 'work',
    components: {
        selectProduct
    },
    computed: {
        ...mapState({
            workshopList: state => state.work.workshopList
        })
    },
    mounted () {
        // store.dispatch('work/GET_NUMBER_LIST');
        // console.log(this.workshoplist);
    }
};
</script>

<style scoped>

</style>
