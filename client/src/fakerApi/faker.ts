import modelBase from "@/models/modelBase";
import generateRandomDelay from "@/utils/generateRandomDelay";
import { faker } from "@faker-js/faker";


class Faker<T extends modelBase> {
    data: T[]; // Store courses for readAll
  
    constructor(length = 10) {
        this.data = Array.from({ length }, (_, index) => this.generateFake(index));
    }
    
    generateFake = (index: number): T => {
        return {} as T;
    };

    generateUniqueArray = (min:number, max: number, length: number) => {
        const uniqueStudentIds: number[] = [];

        while (uniqueStudentIds.length < length) {
            const randomNum = faker.number.int({ min, max });

            if (!uniqueStudentIds.includes(randomNum)) {
                uniqueStudentIds.push(randomNum);
            }
        }

        return uniqueStudentIds;
    }
  
    async create(item: T): Promise<T> {
        item.id = this.data.length + 1
        this.data.push(item);
        return item;
    }
  
    async readAll(): Promise<T[]> {
        // Simulate fetching courses
        await generateRandomDelay(0,1);
        return [...this.data];
    }
  
    async read(id: number): Promise<T | null> {
        // Simulate fetching a single course by ID
        const course = this.data.find((c) => c.id === id);
        return course || null;
    }
  
    async update(item: T): Promise<T> {
        // Simulate updating a course (no actual data storage)
        const index = this.data.findIndex((c) => c.id === item.id);
        if (index !== -1) {
            this.data[index] = item;
        }
        return item
    }
  
    async delete(id: number): Promise<void> {
        // Simulate deleting a course (no actual data removal)
        this.data = this.data.filter((c) => c.id !== id);
    }
}

export default Faker;
