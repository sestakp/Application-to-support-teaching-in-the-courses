import Activity from "@/models/Activity/Activity";
import createMutations from "../mutations";
import ActivityState from "./activityState/activityStateInterface";
import activityMutationTypes from "./activityMutationTypes";


const activityMutations = createMutations<Activity, ActivityState>(activityMutationTypes);

export default activityMutations;
