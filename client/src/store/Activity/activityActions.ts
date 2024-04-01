import { ActionContext, ActionTree, Commit } from "vuex";
import ActivityState from "./activityState/activityStateInterface";
import createActions from "../actions";
import Activity from "@/models/Activity/Activity";
import ActivityApi from "@/api/Activity/ActivityApi";
import ActivityFaker from "@/fakerApi/activityFaker";
import activityMutationTypes from "./activityMutationTypes";


const activityActions: ActionTree<ActivityState, any> = {
    // Specific actions for Activity model
    async fetchCourseActivities(context: ActionContext<any, any>, courseId: number) {
        const currentUser = context.rootGetters.getCurrentUser();

        const items = await (process.env.VUE_APP_API_URL !== undefined ?
            ActivityApi.readCourseActivities(courseId, currentUser.token) :
            ActivityFaker.readCourseActivities(courseId));

        context.commit(activityMutationTypes.SET_ITEMS, items);
    },

    // Exted existing actions
    ...createActions<Activity, ActivityState>(ActivityApi, ActivityFaker, activityMutationTypes)
};

export default activityActions;
