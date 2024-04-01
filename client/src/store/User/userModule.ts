import { Module } from "vuex";
import UserState from "./userState/userStateInterface";
import userDefaultState from "./userState/userDefaultState";
import userMutations from "./userMutations";
import userActions from "./userActions";
import userGetters from "./userGetters";


const userModule: Module<UserState, any> = {
    namespaced: true,
    state:userDefaultState,
    mutations:userMutations,
    actions:userActions,
    getters:userGetters,
};

export default userModule;
