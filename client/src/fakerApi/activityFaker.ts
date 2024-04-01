import Activity from "@/models/Activity/Activity";
import Faker from "./faker";
import { faker } from '@faker-js/faker';
import fakerSetup from "./fakerSetup";


class ActivityFaker extends Faker<Activity> {
    constructor(length = fakerSetup.activities) {
        super(length)
        this.data = Array.from({ length }, (_, index) => this.generateFake(index));
    }
  
    generateFake = (index:number): Activity => {
        const courseId = faker.number.int({min: 1, max: fakerSetup.courses})
        const teamBased = fakerSetup.teams < 1 ? false : faker.datatype.boolean();


        return {
            id: index + 1,
            emailTemplate: faker.lorem.words(50),
            name: "Activity " + faker.lorem.words(1),
            teamBased: teamBased,
            teams: teamBased ? this.generateUniqueArray(1, fakerSetup.teams, Math.floor(fakerSetup.teams/2)) : undefined,
            students: teamBased ? undefined : this.generateUniqueArray(1, fakerSetup.students, Math.floor(fakerSetup.students/2)),
            courseId: courseId
        };
    }

    async readCourseActivities(courseId: number): Promise<Activity[] | undefined> {
        return this.data.filter((v) => v.courseId == courseId);
    }
}

const activityFaker = new ActivityFaker();
export default activityFaker;
