import { ActionTree, ActionContext } from "vuex";
import CriterionState from "./criterionState/criterionStateInterface";
import createActions from "../actions";
import Criterion from "@/models/Criterion/Criterion";
import CriterionApi from "@/api/Criterion/CriterionApi";
import CriterionFaker from "@/fakerApi/criterionFaker";
import criterionMutationTypes from "./criterionMutationTypes";


const criterionActions: ActionTree<CriterionState, any> = {
    // Specific actions for Criterion model
    async fetchActivityCriteria(context: ActionContext<CriterionState, any>, activityId: number) {
        const currentUser = context.rootGetters.getCurrentUser();
        if(currentUser && activityId !== undefined){
            const items = await (process.env.VUE_APP_API_URL !== undefined ? CriterionApi.readActivityCriteria(activityId, currentUser.token) : CriterionFaker.readAcitivityCriteria(activityId));
            context.commit(criterionMutationTypes.SET_ITEMS, items);
            return items
        }
        return null
    },

    // Exted existing actions
    ...createActions<Criterion, CriterionState>(CriterionApi, CriterionFaker, criterionMutationTypes)
};

export default criterionActions;
