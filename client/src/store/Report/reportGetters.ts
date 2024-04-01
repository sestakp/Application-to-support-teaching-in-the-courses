import { GetterTree } from "vuex";
import createGetters from "../getters";
import ReportState from "./reportState/reportStateInterface";
import Report from "@/models/Report/Report";


const reportGetters: GetterTree<ReportState, any> = {
    ...createGetters<Report, ReportState>("aassessment", "id")
}

export default reportGetters;
