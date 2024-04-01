import Faker from "./faker";
import { faker } from "@faker-js/faker";
import Report from "@/models/Report/Report";
import fakerSetup from "./fakerSetup";
import taskFaker from "./taskFaker";
class ReportFaker extends Faker<Report> {
  
    constructor(length = fakerSetup.reports) {
        super(length)
        this.data = Array.from({ length }, (_, index) => this.generateFake(index));
    }
  
    generateFake = (index:number): Report => {
      return {
        id: index + 1,
        description: faker.lorem.words(30),
        taskId: faker.number.int({min: 1, max: fakerSetup.tasks}),
        hours: "01:00:00",
        userId: faker.number.int({min: 0, max: fakerSetup.users})
      };
    };

    async fetchActivityReports(activityId: number){
      const tasks = await taskFaker.readActivityTasks(activityId);
      let reports = [] as Report[]

      if(tasks != undefined){

        for(let i = 0; i < tasks.length; i++){
          const task = tasks[i]
          
          reports = [...reports, ...this.data.filter(r => r.taskId == task.id)]
        }

      }

      return reports;
    }
    
  }
  
const reportFaker = new ReportFaker();
export default reportFaker;