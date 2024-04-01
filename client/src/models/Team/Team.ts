import Student from "../Student/Student";

export default interface Team{
  id:number;
  name: string;
  studentIds: number[];
  activityId: number;
}