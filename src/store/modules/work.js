import {post, fetch} from '../../ajax/http';
import Cookies from 'js-cookie';
import {getWorkshopList} from '../../libs/tools';
const work = {
    namespaced: true,
    state () {
        return {
            workshopList: Cookies.get('allWorkShopList') ? Cookies.get('allWorkShopList') : getWorkshopList()
        };
    },
    mutations: {
        UPDATE_WORKSHOP_LIST: (state, payload) => {
            state.workshopList = payload;
        },
        UPDATE_PROCESS_LIST: (state, payload) => {
            state.workshopList = payload;
        }
    }
};
