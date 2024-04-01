export default interface Criterion{
  id:number;
  code: string;
  name: string;
  description: string;
  assessmentMethod: 'Per student' | 'Per team';
  category: string;
  maxPoints: number;
  minPoints: number;
  feedback: string;
  activityId: number;
}