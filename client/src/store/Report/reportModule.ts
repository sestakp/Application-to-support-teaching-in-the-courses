import { Module } from "vuex";
import ReportState from "./reportState/reportStateInterface";
import reportDefaultState from "./reportState/reportDefaultState";
import reportMutations from "./reportMutations";
import reportActions from "./reportActions";
import reportGetters from "./reportGetters";


const reportModule: Module<ReportState, any> = {
    namespaced: true,
    state: reportDefaultState,
    mutations: reportMutations,
    actions: reportActions,
    getters: reportGetters
};

export default reportModule;
