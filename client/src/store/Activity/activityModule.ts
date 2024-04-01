import { Module } from "vuex";
import activityMutations from "./activityMutations";
import activityActions from "./activityActions";
import activityGetters from "./activityGetters";

import ActivityState from "./activityState/activityStateInterface";
import activityDefaultState from "./activityState/activityDefaultState";


const activityModule: Module<ActivityState, any> = {
    namespaced: true,
    state: activityDefaultState,
    mutations: activityMutations,
    actions: activityActions,
    getters: activityGetters
};

export default activityModule;
