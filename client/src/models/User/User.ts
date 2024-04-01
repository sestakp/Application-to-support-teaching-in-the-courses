export default interface User {
  id: number
  email: string;
  name: string;
  registrationDate: Date;
  privilegedCourses: number[];
  password: string;
}