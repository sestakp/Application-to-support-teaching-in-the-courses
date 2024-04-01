import { GetterTree } from "vuex";
import createGetters from "../getters";
import CriterionState from "./criterionState/criterionStateInterface";
import Criterion from "@/models/Criterion/Criterion";


const criterionGetters: GetterTree<CriterionState, any> = {
    ...createGetters<Criterion, CriterionState>("criterion", "id"),
    getCategories: (state) => (activityId: number): string[] => { return [...new Set(state.data.filter(c =>c.activityId == activityId).map(item => item.category))] },

}

export default criterionGetters;
