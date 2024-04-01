import Type from "../Type/Type";

export default interface Task{
  id: number;
  order: number;
  name: string;
  description:string;
  start: Date;
  end: Date;
  responsibleUserId?: number;
  typeId: number;
  courseId: number;
  activityId: number;
  criteriaCategory: string;
}