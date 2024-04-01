import { Module } from "vuex";
import studentDefaultState from "./studentState/studentDefaultState";
import studentMutations from "./studentMutations";
import studentActions from "./studentActions";
import studentGetters from "./studentGetters";
import StudentState from "./studentState/studentStateInterface";


const studentModule: Module<StudentState, any> = {
    namespaced: true,
    state:studentDefaultState,
    mutations:studentMutations,
    actions:studentActions,
    getters:studentGetters,
};

export default studentModule;
