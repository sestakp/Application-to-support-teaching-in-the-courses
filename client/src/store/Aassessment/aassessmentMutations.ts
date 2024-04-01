import createMutations from "../mutations";
import AassessmentState from "./aassessmentState/aassessmentStateInterface";
import aassessmentMutationTypes from "./aassessmentMutationTypes";
import Aassessment from "@/models/Aassessment/Aassessment";


const aassessmentMutations = createMutations<Aassessment, AassessmentState>(aassessmentMutationTypes);

export default aassessmentMutations;
