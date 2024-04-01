import { Module } from "vuex";
import TypeState from "./typeState/typeStateInterface";
import typeDefaultState from "./typeState/typeDefaultState";
import typeMutations from "./typeMutations";
import typeActions from "./typeActions";
import typeGetters from "./typeGetters";


const typeModule: Module<TypeState, any> = {
    namespaced: true,
    state:typeDefaultState,
    mutations:typeMutations,
    actions:typeActions,
    getters:typeGetters,
};

export default typeModule;
