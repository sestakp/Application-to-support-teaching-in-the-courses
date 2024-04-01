import Faker from "./faker";
import User from "@/models/User/User";
import UserLogin from "@/models/User/UserLogin";
import UserRegister from "@/models/User/UserRegister";
import { faker } from '@faker-js/faker';
import fakerSetup from "./fakerSetup";
import Course from "@/models/Course/Course";


class UserFaker extends Faker<User> {
    constructor(length = fakerSetup.users) {
        super(length);
        this.data = Array.from({ length }, (_, index) => this.generateFake(index));
        this.data.push(<User> {
            id: 0,
            name: "Test Testov",
            email: "test@tempuri.com",
            password: "123",
            registrationDate: new Date(),
            privilegedCourses: []
        });
    }

    generateFake = (index: number): User => {
        return {
            id: index + 1,
            email: faker.internet.email(),
            password: "123",
            registrationDate: faker.date.past(),
            name: faker.person.fullName(),
            privilegedCourses: this.generateUniqueArray(1, fakerSetup.courses, Math.floor(fakerSetup.courses/4))
        } as User;
    };

    login(login: UserLogin): User | undefined {
        const user = this.data.find(p => p.email == login.email && p.password == login.password)
        return user;
    }

    logout(login: UserLogin): boolean | undefined {
        return true;
    }

    register(register: UserRegister): boolean | undefined {
        this.data.push(register)
        return true;
    }

    async readCourseUsers(course: Course): Promise<User[] | undefined> {
        const users = this.data as User[]
        return users.filter(p => p.privilegedCourses.includes(course.id) || p.id == course.guarantorId);
    }
}

const userFaker = new UserFaker();
export default userFaker;