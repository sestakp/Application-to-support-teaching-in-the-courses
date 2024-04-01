import Faker from "./faker";
import { faker } from "@faker-js/faker";
import Aassessment from "@/models/Aassessment/Aassessment";
import fakerSetup from "./fakerSetup";
import taskFaker from "./taskFaker";
import criterionFaker from "./criterionFaker";
import activityFaker from "./activityFaker";

class AassessmentFaker extends Faker<Aassessment> {

  taskFaker = taskFaker;
  criterionFaker = criterionFaker;
  activityFaker = activityFaker;

  constructor(length = fakerSetup.aassessments) {
    super(length)
    this.data = Array.from({ length }, (_, index) => this.generateFake(index));
  }

  generateFake = (index: number): Aassessment => {

    
    const teamBased = faker.datatype.boolean();

    return {
      id: index + 1,
      criterionId: faker.number.int({min: 1, max: fakerSetup.criterias}),
      points: faker.number.int({min: 1, max: 12}),
      userId: faker.number.int({min: 1, max: fakerSetup.users}),
      [teamBased ? "teamId" : "studentId"]: faker.number.int({min: 1, max: teamBased? fakerSetup.teams : fakerSetup.students}),
    };
  };

  async readAassessmentsByTask(taskId: number): Promise<Aassessment[] | undefined> {
    const task = await taskFaker.read(taskId);
    if(task == undefined) return undefined;

    const criteriaIds = (await criterionFaker.readAcitivityCriteria(task.activityId))?.map(c => c.id);

    if(criteriaIds == undefined) return undefined;
    
    return this.data.filter((v) => criteriaIds?.includes(v.criterionId));
  }

  async readAassessmentsByActivity(activityId: number): Promise<Aassessment[] | undefined> {
    
    const criteriaIds = (await criterionFaker.readAcitivityCriteria(activityId))?.map(c => c.id);

    if(criteriaIds == undefined) return undefined;
    
    return this.data.filter((v) => criteriaIds?.includes(v.criterionId));
  }
}

const aassessmentFaker = new AassessmentFaker();
export default aassessmentFaker;