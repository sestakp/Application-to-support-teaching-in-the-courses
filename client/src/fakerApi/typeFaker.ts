import Type from "@/models/Type/Type";
import Faker from "./faker";
import { faker } from '@faker-js/faker';
import fakerSetup from "./fakerSetup";

class TypeFaker extends Faker<Type> {
  constructor(length = fakerSetup.types) {
    super(length)
    this.data = Array.from({ length }, (_, index) => this.generateFake(index));
  }

  generateFake = (index:number): Type => {
    return {
      id: index + 1,
      name: "Type " + faker.lorem.words(1),
      courseId: faker.number.int({min: 1, max: fakerSetup.courses})
    };
  };

  
  async readCourseTypes(courseId: number): Promise<Type[] | undefined> {
    return this.data.filter((v) => v.courseId == courseId);
}
}

const typeFaker =  new TypeFaker();
export default typeFaker;
