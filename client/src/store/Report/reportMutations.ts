import createMutations from "../mutations";
import Report from "@/models/Report/Report";
import ReportState from "./reportState/reportStateInterface";
import reportMutationTypes from "./reportMutationTypes";


const reportMutations = createMutations<Report, ReportState>(reportMutationTypes);

export default reportMutations;
