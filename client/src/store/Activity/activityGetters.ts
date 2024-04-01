import { GetterTree } from "vuex";
import ActivityState from "./activityState/activityStateInterface";
import createGetters from "../getters";
import Activity from "@/models/Activity/Activity";


const activityGetters: GetterTree<ActivityState, any> = {
    ...createGetters<Activity, ActivityState>("activity", "id")
}

export default activityGetters;
