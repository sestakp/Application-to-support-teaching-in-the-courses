import { ActionTree, Commit, ActionContext } from "vuex";
import createActions from "../actions";
import AassessmentState from "./aassessmentState/aassessmentStateInterface";
import AassessmentApi from "@/api/Aassessment/AassessmentApi";
import aassessmentFaker from "@/fakerApi/aassessmentFaker";
import aassessmentMutationTypes from "./aassessmentMutationTypes";
import Aassessment from "@/models/Aassessment/Aassessment";


const aassessmentActions: ActionTree<AassessmentState, any> = {
    // Specific actions for Activity model

    async fetchAassessmentsByTask(context: ActionContext<AassessmentState, any>, taskId: number) {
        const currentUser = context.rootGetters.getCurrentUser();
        if(currentUser){
            const items = await (process.env.VUE_APP_API_URL !== undefined ? AassessmentApi.readAassessmentsByTask(taskId, currentUser.token) : aassessmentFaker.readAassessmentsByTask(taskId));
            context.commit(aassessmentMutationTypes.SET_ITEMS, items);
        }
    },

    async fetchAassessmentsByActivity(context: ActionContext<AassessmentState, any>, activityId: number) {
        const currentUser = context.rootGetters.getCurrentUser();
        if(currentUser){
            const items = await (process.env.VUE_APP_API_URL !== undefined ? AassessmentApi.readAassessmentsByActivity(activityId, currentUser.token) : aassessmentFaker.readAassessmentsByActivity(activityId));
            context.commit(aassessmentMutationTypes.SET_ITEMS, items);
        }
    },
    // Exted existing actions
    ...createActions<Aassessment, AassessmentState>(AassessmentApi, aassessmentFaker, aassessmentMutationTypes)
};

export default aassessmentActions;
