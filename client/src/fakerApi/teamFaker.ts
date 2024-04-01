import Faker from "./faker";
import Team from "@/models/Team/Team";
import { faker } from '@faker-js/faker';
import fakerSetup from "./fakerSetup";
import Student from "@/models/Student/Student";

class TeamFaker extends Faker<Team> {
  
    constructor(length = fakerSetup.teams) {
        super(length)
        this.data = Array.from({ length }, (_, index) => this.generateFake(index));
    }
  
    generateFake = (index:number): Team => {
      return {
        id: index + 1,
        name: faker.internet.userName(),
        studentIds: this.generateUniqueArray(1, fakerSetup.students, 5),
        activityId: faker.number.int({min: 0, max: fakerSetup.activities}),
      };
    };

    readStudentTeams = (students: Student[]) => {
      const studentIds = students.map((s: Student) => s.id);
      return this.data.filter((team: Team) => team.studentIds.some(id => studentIds.includes(id)));
    };

    
  }
  
const teamFaker = new TeamFaker();
export default teamFaker;