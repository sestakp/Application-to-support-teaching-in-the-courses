export default interface Aassessment{
  id: number;
  points: number | undefined;
  criterionId: number;
  feedback?: string;
  userId: number;
  teamId?: number;
  studentId?: number;
}