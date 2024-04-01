import { ActionTree, Commit, ActionContext } from "vuex";
import createActions from "../actions";
import ReportState from "./reportState/reportStateInterface";
import Report from "@/models/Report/Report";
import ReportApi from "@/api/Report/ReportApi";
import reportFaker from "@/fakerApi/reportFaker";
import reportMutationTypes from "./reportMutationTypes";


const reportActions: ActionTree<ReportState, any> = {
    // Specific actions for Activity model
    async fetchActivityReports(context: ActionContext<ReportState, any>, activityId: number) {
        const currentUser = context.rootGetters.getCurrentUser();
        if(currentUser){
            const items = await (process.env.VUE_APP_API_URL !== undefined ? ReportApi.fetchActivityReports(activityId, currentUser.token) : reportFaker.fetchActivityReports(activityId));
            context.commit(reportMutationTypes.SET_ITEMS, items);
            return items
        }
        return null;
    },
    // Exted existing actions
    ...createActions<Report, ReportState>(ReportApi, reportFaker, reportMutationTypes)
};

export default reportActions;
