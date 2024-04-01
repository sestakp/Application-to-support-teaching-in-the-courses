import Faker from "./faker";
import Task from "@/models/Task/Task";
import { faker } from '@faker-js/faker';
import fakerSetup from "./fakerSetup";
import logger from "@/utils/loggerUtil";
import activityFaker from "./activityFaker";
import criterionFaker from "./criterionFaker";
import typeFaker from "./typeFaker";
class TaskFaker extends Faker<Task> {
  
    courseOrders: number[] = new Array(fakerSetup.courses+1).fill(0); // Store courses for readAll
    activityFaker = activityFaker
    criterionFaker = criterionFaker;
    typeFaker = typeFaker;
    constructor(length = fakerSetup.tasks) {
        super(length)
        this.data = [];
        this.generateDataAsync(length);
    }
  
    generateDataAsync = async(length:number): Promise<void> => {
      for (let index = 0; index < length; index++) {
        const fakeTask = await this.generateFakeAsync(index);
        this.data.push(fakeTask);
      }
  }

  generateFakeAsync = async(index:number): Promise<Task> => {

    const tRue = true
    while(tRue){
      const courseId = faker.number.int({min: 1, max: fakerSetup.courses})
      
      this.courseOrders[courseId] = this.courseOrders[courseId] + 1
  
      const courseActivities = await this.activityFaker.readCourseActivities(courseId);
      
      if(courseActivities == undefined){
        logger.error("Generate fake task error course activities are undefined")
        continue
      }
      if(courseActivities.length == 0){
        continue
      }
  
      //logger.debug("course activities: ", courseActivities)
      const randomActivityIndex = Math.floor(Math.random() * courseActivities?.length);
      //logger.debug("course activities index: ", randomActivityIndex)
      //logger.debug("course activities element: ", courseActivities[randomActivityIndex])
      const activityId = courseActivities[randomActivityIndex].id;
  
      const criteriaCategories = await this.criterionFaker.readAcitivityCriteria(activityId);
      if(criteriaCategories == undefined){
        logger.error("Generate fake task error activity criteria are undefined")
        continue;
      }
      
      if(criteriaCategories.length == 0){
        continue;
      }
  
      const randomCriteriaIndex = Math.floor(Math.random() * criteriaCategories?.length);
      const category = criteriaCategories[randomCriteriaIndex].category;
  
      const types = await this.typeFaker.readCourseTypes(courseId);
      if(types == undefined){
        logger.error("Generate fake task error types are undefined")
        continue;
      }
      
      if(types.length == 0){
        continue;
      }
      const randomTypeIndex = Math.floor(Math.random() * types?.length);
      const type = types[randomTypeIndex];

      return {
        id: index + 1,
        description: faker.lorem.words(50),
        start: faker.date.past(),
        end: faker.date.future(),
        name: "Task "+faker.lorem.words(1),
        order: this.courseOrders[courseId],
        responsibleUserId: undefined,//faker.number.int({min: 1, max: fakerSetup.users}),
        typeId: type.id,
        courseId: courseId,
        activityId: activityId,
        criteriaCategory: category
      };
    }
    
    return {} as Task
    
}

  
  async readCourseTasks(courseId: number): Promise<Task[] | undefined> {
    //logger.debug("readCourseTasks", this.data)
    return this.data.filter((v) => v.courseId == courseId);
  }

  async readActivityTasks(activityId: number): Promise<Task[] | undefined>{
    return this.data.filter(v => v.activityId == activityId);
  }
}
  
const taskFaker = new TaskFaker();
export default taskFaker;