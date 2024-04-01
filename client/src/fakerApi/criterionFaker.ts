import Faker from "./faker";
import { faker } from "@faker-js/faker";
import Criterion from "@/models/Criterion/Criterion";
import fakerSetup from "./fakerSetup";


class CriterionFaker extends Faker<Criterion> {

  categories = ["UI", "UX", "Installation", "Clean code", "Architecture"]
  aassessmentMethods = ["team", "individual"]

  constructor(length = fakerSetup.criterias) {
    super(length)
    this.data = Array.from({ length }, (_, index) => this.generateFake(index));
  }

  generateFake = (index: number): Criterion => {
    return {
      id: index + 1,
      activityId: faker.number.int({ min: 1, max: fakerSetup.activities }),
      category: this.categories[Math.floor(Math.random() * this.categories.length)],
      code: faker.lorem.word(3).toUpperCase(),
      description: faker.lorem.words(20),
      feedback: faker.lorem.words(20),
      minPoints: 0,
      maxPoints: faker.number.int({ min: 5, max: 12 }),
      name: faker.lorem.words(2),
      assessmentMethod: Math.floor(Math.random() * 2) === 0 ? 'Per student' : 'Per team'
    };
  };

  async readAcitivityCriteria(activityId: number): Promise<Criterion[] | undefined> {
    //logger.debug("readAcitivityCriteria: ", this.data.filter((v) => v.activityId == activityId))
    return this.data.filter((v) => v.activityId == activityId);
} 
}

const criterionFaker = new CriterionFaker();
export default criterionFaker;