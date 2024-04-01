import { Module } from "vuex";
import criterionDefaultState from "./criterionState/criterionDefaultState";
import criterionMutations from "./criterionMutations";
import criterionActions from "./criterionActions";
import criterionGetters from "./criterionGetters";
import CriterionState from "./criterionState/criterionStateInterface";


const criterionModule: Module<CriterionState, any> = {
    namespaced: true,
    state: criterionDefaultState,
    mutations: criterionMutations,
    actions: criterionActions,
    getters: criterionGetters
};

export default criterionModule;
