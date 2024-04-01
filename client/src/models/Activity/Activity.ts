import Student from "../Student/Student";
import Team from "../Team/Team";

export default interface Activity{
  id:number;
  name: string;
  teamBased: boolean;
  emailTemplate: string;
  teams?: number[];
  students?: number[];
  courseId: number;
}