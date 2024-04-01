import createMutations from "../mutations";
import Criterion from "@/models/Criterion/Criterion";
import CriterionState from "./criterionState/criterionStateInterface";
import criterionMutationTypes from "./criterionMutationTypes";


const criterionMutations = createMutations<Criterion, CriterionState>(criterionMutationTypes);

export default criterionMutations;
