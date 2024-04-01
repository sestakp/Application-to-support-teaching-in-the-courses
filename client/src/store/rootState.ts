import ActivityState from "./Activity/activityState/activityStateInterface";
import CourseState from "./Course/courseState/courseStateInterface";// Import your module state type
import CriterionState from "./Criterion/criterionState/criterionStateInterface";
import StudentState from "./Student/studentState/studentStateInterface";
import TaskState from "./Task/taskState/taskStateInterface";
import TeamState from "./Team/teamState/teamStateInterface";
import TypeState from "./Type/typeState/typeStateInterface";
import UserState from "./User/userState/userStateInterface";

export interface RootState {
  course: CourseState;
  user: UserState;
  activity: ActivityState;
  criterion: CriterionState;
  task: TaskState;
  type: TypeState;
  student: StudentState;
  team: TeamState;
}