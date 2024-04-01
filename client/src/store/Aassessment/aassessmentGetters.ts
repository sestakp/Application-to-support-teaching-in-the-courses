import { GetterTree } from "vuex";
import createGetters from "../getters";
import AassessmentState from "./aassessmentState/aassessmentStateInterface";
import Aassessment from "@/models/Aassessment/Aassessment";


const aassessmentGetters: GetterTree<AassessmentState, any> = {
    ...createGetters<Aassessment, AassessmentState>("aassessment", "id")
}

export default aassessmentGetters;
