import { Module } from "vuex";
import TeamState from "./teamState/teamStateInterface";
import teamDefaultState from "./teamState/teamDefaultState";
import teamMutations from "./teamMutations";
import teamActions from "./teamActions";
import teamGetters from "./teamGetters";


const teamModule: Module<TeamState, any> = {
    namespaced: true,
    state:teamDefaultState,
    mutations:teamMutations,
    actions:teamActions,
    getters:teamGetters,
};

export default teamModule;
