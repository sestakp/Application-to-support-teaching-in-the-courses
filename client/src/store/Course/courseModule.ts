import { Module } from "vuex";
import CourseState from "./courseState/courseStateInterface";
import courseDefaultState from "./courseState/courseDefaultState";
import courseMutations from "./courseMutations";
import courseGetters from "./courseGetters";
import courseActions from "./courseActions";


const courseModule: Module<CourseState, any> = {
    namespaced: true,
    state:courseDefaultState,
    mutations:courseMutations,
    actions:courseActions,
    getters:courseGetters,
};

export default courseModule;
