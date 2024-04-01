import Faker from "./faker";
import Student from "@/models/Student/Student";
import { faker } from '@faker-js/faker';
import fakerSetup from "./fakerSetup";
import Course from "@/models/Course/Course";

class StudentFaker extends Faker<Student> {
  
    constructor(length = fakerSetup.students) {
        super(length)
        this.data = Array.from({ length }, (_, index) => this.generateFake(index));
    }
  
    generateFake = (index:number): Student => {
      return {
        id: index + 1,
        fitlogin: "xtest" + (index + 1).toString().padStart(2, '0'),
        vutlogin: (222001 + index).toString(),
        name: faker.person.fullName(),
        courseId: faker.number.int({min: 1, max: fakerSetup.courses}),
      };
    };

    async readCourseStudents(course: Course): Promise<Student[] | undefined> {
      return this.data.filter((s: Student) => course.students.includes(s.id));
    }
  }
  
  const studentFaker = new StudentFaker();
  export default studentFaker;