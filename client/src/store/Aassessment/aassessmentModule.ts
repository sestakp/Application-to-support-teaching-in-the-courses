import { Module } from "vuex";
import AassessmentState from "./aassessmentState/aassessmentStateInterface";
import aassessmentDefaultState from "./aassessmentState/aassessmentDefaultState";
import aassessmentMutations from "./aassessmentMutations";
import aassessmentActions from "./aassessmentActions";
import aassessmentGetters from "./aassessmentGetters";


const aassessmentModule: Module<AassessmentState, any> = {
    namespaced: true,
    state: aassessmentDefaultState,
    mutations: aassessmentMutations,
    actions: aassessmentActions,
    getters: aassessmentGetters
};

export default aassessmentModule;
