import Course from "@/models/Course/Course";
import Faker from "./faker";
import fakerSetup from "./fakerSetup";
import { faker } from "@faker-js/faker";


class CourseFaker extends Faker<Course> {
    constructor(length = fakerSetup.courses) {
        super(length)
        this.data = Array.from({ length }, (_, index) => this.generateFake(index));
    }

    generateFake = (index:number): Course => {
        return {
            id: index + 1,
            abbrevation: 'C' + (index + 1),
            name: 'Course ' + (index + 1),
            year: 2023,
            guarantorId: faker.number.int({min: 0, max: fakerSetup.users}),
            students: this.generateUniqueArray(1, fakerSetup.students, Math.floor(fakerSetup.students/2))
        };
    };

    async create(item: Course): Promise<Course> {
        item.id = this.data.length + 1
        item.students = [],

        this.data.push(item);
        return item;
    }
}

const courseFaker = new CourseFaker();
export default courseFaker;
