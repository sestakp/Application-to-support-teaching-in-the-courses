import { Module } from "vuex";
import taskDefaultState from "./taskState/taskDefaultState";
import taskActions from "./taskActions";
import TaskState from "./taskState/taskStateInterface";
import taskMutations from "./taskMutations";
import taskGetters from "./taskGetters";


const taskModule: Module<TaskState, any> = {
    namespaced: true,
    state:taskDefaultState,
    mutations:taskMutations,
    actions:taskActions,
    getters:taskGetters,
};

export default taskModule;
